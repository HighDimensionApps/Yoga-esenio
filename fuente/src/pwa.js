// ============================================================
//  PWA: instalación, service worker, estado de conexión y
//  descarga de imágenes para uso sin conexión.
// ============================================================
import { useEffect, useState } from 'react';

export const IMG_CACHE = 'yoga-esenio-img-v1';

// ---------- Utilidades de plataforma ----------
export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.matchMedia('(display-mode: fullscreen)').matches ||
  window.navigator.standalone === true;

export const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const swAllowed = () =>
  'serviceWorker' in navigator &&
  (location.protocol === 'https:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1');

// ---------- Estado global (pequeño "store") ----------
const state = {
  deferredPrompt: null, // evento beforeinstallprompt (Chrome/Edge/Android)
  standalone: false,
  ios: false,
  secure: false,
  swSupported: false,
  swReady: false,
  updateAvailable: false,
};
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn({ ...state }));

export function initPWA() {
  state.standalone = isStandalone();
  state.ios = isIOS();
  state.secure = window.isSecureContext;
  state.swSupported = swAllowed();

  // Este evento puede dispararse antes de que React monte: lo guardamos aquí.
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    state.deferredPrompt = e;
    emit();
  });

  window.addEventListener('appinstalled', () => {
    state.deferredPrompt = null;
    state.standalone = true;
    emit();
  });

  window
    .matchMedia('(display-mode: standalone)')
    .addEventListener?.('change', () => {
      state.standalone = isStandalone();
      emit();
    });

  if (!state.swSupported) return;

  const hadController = !!navigator.serviceWorker.controller;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('No se pudo registrar el service worker:', err);
    });

    navigator.serviceWorker.ready.then(() => {
      state.swReady = true;
      emit();
    });
  });

  // Si ya había un SW controlando la página y aparece otro nuevo,
  // hay una versión nueva de la app lista.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController) {
      state.updateAvailable = true;
      emit();
    }
  });
}

export async function promptInstall() {
  const evt = state.deferredPrompt;
  if (!evt) return 'unavailable';
  evt.prompt();
  const { outcome } = await evt.userChoice;
  state.deferredPrompt = null; // el evento solo se puede usar una vez
  if (outcome === 'accepted') state.standalone = true;
  emit();
  return outcome;
}

export const reloadApp = () => window.location.reload();

// ---------- Hooks ----------
export function usePWA() {
  const [s, setS] = useState({ ...state });
  useEffect(() => {
    listeners.add(setS);
    setS({ ...state });
    return () => listeners.delete(setS);
  }, []);
  return s;
}

export function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

// ---------- Caché de imágenes ----------
export async function countCached(urls) {
  if (!('caches' in window)) return 0;
  try {
    const cache = await caches.open(IMG_CACHE);
    let n = 0;
    for (const u of urls) if (await cache.match(u)) n++;
    return n;
  } catch {
    return 0;
  }
}

// Descarga y guarda todas las imágenes (3 en paralelo).
export async function cacheImages(urls, onProgress) {
  if (!('caches' in window)) throw new Error('Caché no disponible');
  const cache = await caches.open(IMG_CACHE);
  const queue = [...urls];
  let done = 0;
  let failed = 0;

  // Pide al navegador que no borre los datos de la app si hay poco espacio.
  try {
    await navigator.storage?.persist?.();
  } catch {
    /* no pasa nada */
  }

  const worker = async () => {
    while (queue.length) {
      const url = queue.shift();
      try {
        if (!(await cache.match(url))) {
          let res;
          try {
            res = await fetch(url, { mode: 'cors', credentials: 'omit' });
            if (!res.ok) throw new Error('bad status');
          } catch {
            res = await fetch(url, { mode: 'no-cors' }); // respuesta opaca
          }
          await cache.put(url, res);
        }
      } catch {
        failed++;
      }
      done++;
      onProgress?.({ done, total: urls.length, failed });
    }
  };

  await Promise.all([worker(), worker(), worker()]);
  return { done, failed, total: urls.length };
}
