import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { communionsData, libraryData, backgrounds } from './data.js';
import {
    initPWA, usePWA, useOnline, promptInstall, reloadApp,
    countCached, cacheImages
} from './pwa.js';

const Icon = ({ name, size = 24, className, fill = "none" }) => {
            const icons = {
                Sprout: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>,
                Hammer: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25V2.46V2a2 2 0 0 0-2-2H12a2 2 0 0 0-2 2v2.54c0 .85-.33 1.65-.93 2.25L7.86 8"/></svg>,
                Heart: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
                Moon: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
                Smile: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>,
                Scale: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>,
                Sun: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
                HeartHandshake: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.92 0l2.96 2.96"/></svg>,
                Droplets: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.8-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.35c.71-.77 1.37-1.71 1.37-2.65 0-2.73-3-3.75-1.9-7.12z"/></svg>,
                BookOpen: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
                Wind: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>,
                Stars: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275-1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 5H5"/><path d="M19 19v4"/><path d="M19 19h-4"/></svg>,
                Flower: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 1 4.5 4.5M7.5 12H9m3 4.5a4.5 4.5 0 1 1 4.5-4.5M12 16.5V15m4.5-3a4.5 4.5 0 1 0-4.5-4.5M16.5 12H15"/><path d="m8 8 8 8"/><path d="m8 16 8-8"/></svg>,
                Infinity: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z"/></svg>,
                Zap: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
                Book: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
                Video: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
                Image: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
                FileText: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
                ChevronDown: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>,
                Play: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
                Pause: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
                ArrowLeft: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
                X: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>,
                ExternalLink: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
                User: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
                Sunrise: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>,
                Users: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                Download: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
                Smartphone: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>,
                WifiOff: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/></svg>,
                Check: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>,
                Share: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>,
                PlusSquare: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>,
                RotateCcw: <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            };
            return icons[name] || null;
        };

        const AccordionItem = ({ title, icon, isOpen, onClick, children }) => (
            <div className="glass-accordion-item rounded-xl mb-4 overflow-hidden shadow-lg border border-white/10 flex flex-col">
                <button 
                    onClick={onClick}
                    aria-expanded={isOpen}
                    className={`w-full p-4 flex items-center justify-between text-left transition-colors shrink-0 ${isOpen ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                    <div className="flex items-center gap-3">
                        <Icon name={icon} className="text-amber-200 shrink-0" />
                        <span className="font-cinzel text-lg text-amber-100">{title}</span>
                    </div>
                    <div className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                        <Icon name="ChevronDown" className="text-amber-200/70" />
                    </div>
                </button>
                <div 
                    inert={!isOpen}
                    className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[60vh] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                    <div className="p-4 pt-0 text-gray-200 font-light border-t border-white/5">
                        <div className="mt-4 space-y-4">{children}</div>
                    </div>
                </div>
            </div>
        );

        const MeditationSession = ({ communion, onClose }) => {
            const TOTAL = 300; // 5 minutos
            const [timeLeft, setTimeLeft] = useState(TOTAL);
            const [isActive, setIsActive] = useState(true);
            const endRef = useRef(0);
            const audioRef = useRef(null);
            const finished = timeLeft === 0;

            // Cronómetro basado en la hora real: no se atrasa si la pantalla
            // se apaga o la app pasa a segundo plano.
            useEffect(() => {
                if (!isActive) return;
                endRef.current = Date.now() + timeLeft * 1000;
                const tick = () => {
                    const left = Math.max(0, Math.ceil((endRef.current - Date.now()) / 1000));
                    setTimeLeft(left);
                    if (left === 0) setIsActive(false);
                };
                const id = setInterval(tick, 250);
                document.addEventListener('visibilitychange', tick);
                return () => {
                    clearInterval(id);
                    document.removeEventListener('visibilitychange', tick);
                };
            }, [isActive]);

            // Mantiene la pantalla encendida durante la meditación.
            useEffect(() => {
                let lock = null;
                let cancelled = false;
                const request = async () => {
                    try {
                        if ('wakeLock' in navigator && document.visibilityState === 'visible') {
                            const l = await navigator.wakeLock.request('screen');
                            if (cancelled) { l.release().catch(() => {}); return; }
                            lock = l;
                        }
                    } catch (e) { /* no disponible: no pasa nada */ }
                };
                const onVisible = () => { if (document.visibilityState === 'visible') request(); };
                request();
                document.addEventListener('visibilitychange', onVisible);
                return () => {
                    cancelled = true;
                    document.removeEventListener('visibilitychange', onVisible);
                    if (lock) lock.release().catch(() => {});
                };
            }, []);

            // Audio para la campana final (se crea al abrir, tras el toque del usuario).
            useEffect(() => {
                try {
                    const Ctx = window.AudioContext || window.webkitAudioContext;
                    if (Ctx) {
                        audioRef.current = new Ctx();
                        if (audioRef.current.resume) audioRef.current.resume();
                    }
                } catch (e) { /* sin audio */ }
                return () => {
                    try { if (audioRef.current) audioRef.current.close(); } catch (e) { /* nada */ }
                };
            }, []);

            // Al terminar: vibración suave + campana.
            useEffect(() => {
                if (!finished) return;
                try { if (navigator.vibrate) navigator.vibrate([250, 120, 250]); } catch (e) { /* nada */ }
                const ctx = audioRef.current;
                if (!ctx) return;
                try {
                    if (ctx.resume) ctx.resume();
                    [528, 792].forEach((freq, i) => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'sine';
                        osc.frequency.value = freq;
                        const t0 = ctx.currentTime + i * 0.02;
                        gain.gain.setValueAtTime(0.0001, t0);
                        gain.gain.exponentialRampToValueAtTime(i === 0 ? 0.25 : 0.1, t0 + 0.05);
                        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.5);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(t0);
                        osc.stop(t0 + 3.6);
                    });
                } catch (e) { /* sin audio */ }
            }, [finished]);

            const restart = () => { setTimeLeft(TOTAL); setIsActive(true); };
            const togglePause = () => { if (finished) restart(); else setIsActive(!isActive); };

            const formatTime = (seconds) => {
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            };

            const mainIcon = finished ? 'RotateCcw' : (isActive ? 'Pause' : 'Play');
            const mainLabel = finished ? 'Meditar de nuevo' : (isActive ? 'Pausar' : 'Reanudar');

            return (
                <div className="fixed inset-0 z-50 overflow-y-auto text-white animate-fade-in" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="fixed inset-0 bg-cover bg-center z-0 bg-breathing-effect pointer-events-none"
                         style={{ backgroundImage: `url('${communion.symbolImage}')`, backgroundColor: '#0b1d26' }}>
                    </div>
                    <div className="fixed inset-0 bg-black/60 z-10 backdrop-blur-sm pointer-events-none"></div>

                    <div className="relative z-20 min-h-full w-full flex flex-col items-center justify-center py-12 px-6">
                        <button onClick={onClose} aria-label="Cerrar meditación" className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors z-30 bg-black/20 rounded-full">
                            <Icon name="X" size={32} />
                        </button>

                        <div className="w-full max-w-md flex flex-col items-center mt-8">
                            <h2 className="font-cinzel text-3xl text-amber-100 mb-2 text-center drop-shadow-lg">{communion.angel}</h2>
                            <p className="font-lato text-lg text-center text-gray-200 italic mb-8 opacity-90">"{communion.invocation}"</p>

                            {communion.meditationText && (
                                <div className="mb-8 p-6 rounded-xl bg-black/40 border border-amber-500/30 backdrop-blur-md shadow-lg w-full">
                                    <p className="font-cinzel text-base md:text-lg text-center text-amber-100 leading-relaxed italic">
                                        {communion.meditationText}
                                    </p>
                                </div>
                            )}

                            <div className="relative w-48 h-48 flex items-center justify-center mb-8 shrink-0">
                                <div className="absolute inset-0 border-4 border-white/20 rounded-full breathe-animation"></div>
                                <div className="absolute inset-0 border-2 border-white/10 rounded-full scale-75 breathe-animation" style={{ animationDelay: '1s' }}></div>

                                <div className="text-center">
                                    <span className="font-cinzel text-4xl font-bold tracking-widest text-white drop-shadow-2xl">
                                        {formatTime(timeLeft)}
                                    </span>
                                    <p className="text-[10px] uppercase tracking-[0.3em] mt-2 text-amber-200/70">{finished ? 'Paz' : 'Respirar'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 mb-8 shrink-0">
                                <button
                                    onClick={onClose}
                                    className="glass-button p-4 rounded-full text-white hover:bg-white/20 transition-all"
                                    title="Regresar"
                                    aria-label="Regresar"
                                >
                                    <Icon name="ArrowLeft" size={24} />
                                </button>

                                <button
                                    onClick={togglePause}
                                    className="glass-button p-6 rounded-full text-amber-100 bg-amber-500/20 hover:bg-amber-500/30 border-amber-200/40 transition-all scale-110"
                                    title={mainLabel}
                                    aria-label={mainLabel}
                                >
                                    <Icon name={mainIcon} size={32} fill={mainIcon === 'Pause' ? 'currentColor' : 'none'} />
                                </button>
                            </div>

                            <div className="glass-panel px-6 py-4 rounded-full text-center shrink-0">
                                <p className="text-sm font-light text-gray-100">{finished ? 'La meditación ha concluido. Paz sea contigo.' : 'Encuentra el centro del Árbol en ti...'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const WeekView = ({ communions }) => (
            <div className="w-full max-w-5xl animate-fade-in p-4 mt-20 mb-12">
                <div className="glass-panel rounded-2xl overflow-hidden">
                    <div className="p-6 bg-white/5 border-b border-white/10 text-center">
                        <h2 className="font-cinzel text-2xl text-amber-100">Comuniones de la Semana</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-black/20 text-amber-200 text-sm uppercase tracking-wider">
                                    <th className="p-4 font-cinzel">Día</th>
                                    <th className="p-4 font-cinzel text-orange-300">Mañana</th>
                                    <th className="p-4 font-cinzel text-yellow-300">Mediodía</th>
                                    <th className="p-4 font-cinzel text-indigo-300">Noche</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-100 divide-y divide-white/10 text-sm md:text-base">
                                {Object.values(communions).map((day, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-bold">{day.name}</td>
                                        <td className="p-4"><div className="flex items-center gap-2"><Icon name={day.morning.icon} size={16} className="text-orange-400 shrink-0" />{day.morning.angel}</div></td>
                                        <td className="p-4"><div className="flex items-center gap-2"><Icon name={day.midday.icon} size={16} className="text-yellow-400 shrink-0" />{day.midday.angel}</div></td>
                                        <td className="p-4"><div className="flex items-center gap-2"><Icon name={day.evening.icon} size={16} className="text-indigo-400 shrink-0" />{day.evening.angel}</div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );

        const ImageViewer = ({ src, alt, onClose }) => {
            const [failed, setFailed] = useState(false);
            return (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 animate-fade-in p-4" onClick={onClose}>
                    <button onClick={onClose} aria-label="Cerrar" className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors z-50">
                        <Icon name="X" size={32} />
                    </button>
                    {failed ? (
                        <div className="text-center text-gray-200 max-w-xs" onClick={(e) => e.stopPropagation()}>
                            <Icon name="WifiOff" size={40} className="mx-auto mb-3 text-amber-200" />
                            <p>Esta imagen aún no está guardada para uso sin conexión.</p>
                        </div>
                    ) : (
                        <img src={src} alt={alt} onError={() => setFailed(true)} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
                    )}
                </div>
            );
        };

        const LibraryView = ({ items }) => {
            const [selectedImage, setSelectedImage] = useState(null);
            const online = useOnline();
            const [notice, setNotice] = useState(null);

            return (
                <React.Fragment>
                    <div className="w-full max-w-4xl animate-fade-in p-4 mt-20 mb-12">
                        <h2 className="font-cinzel text-3xl text-center text-amber-100 mb-8 text-shadow-lg">Biblioteca Sagrada</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {items.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className="glass-panel rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
                                    onClick={() => {
                                        if (item.type === "Imagen" && item.url && item.url !== "#") {
                                            setSelectedImage(item);
                                        } else if (item.url && item.url !== "#") {
                                            if (!online) {
                                                setNotice("Este recurso necesita conexión a internet.");
                                                setTimeout(() => setNotice(null), 3500);
                                            } else {
                                                window.open(item.url, "_blank", "noopener,noreferrer");
                                            }
                                        }
                                    }}
                                >
                                    <div className="flex items-start gap-4">
                                        {item.thumbnail ? (
                                            <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-lg overflow-hidden border border-amber-500/30 group-hover:scale-105 transition-transform relative shadow-lg">
                                                <img src={item.thumbnail} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                                                    {item.type === 'Video' ? (
                                                        <Icon name="Play" size={24} className="text-white/90 drop-shadow-md" fill="currentColor" />
                                                    ) : (
                                                        <Icon name="ExternalLink" size={20} className="text-white/90 drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-amber-500/20 rounded-lg text-amber-300 group-hover:scale-110 transition-transform">
                                                <Icon name={item.icon} size={32} />
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-xs uppercase tracking-widest text-amber-400/80 mb-1 block">{item.type}</span>
                                            <h3 className="font-cinzel text-xl text-white mb-2">{item.title}</h3>
                                            <p className="text-sm text-gray-300 font-light">{item.desc}</p>
                                            {(item.type === "Imagen" && item.url !== "#") && (
                                                <div className="mt-2 text-xs text-amber-300 opacity-60 group-hover:opacity-100 flex items-center gap-1">
                                                    Ver imagen <Icon name="ExternalLink" size={10} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {selectedImage && (
                        <ImageViewer 
                            src={selectedImage.url} 
                            alt={selectedImage.title} 
                            onClose={() => setSelectedImage(null)} 
                        />
                    )}
                    {notice && <Toast message={notice} />}
                </React.Fragment>
            );
        };

        const TodayView = ({ selectedDay, setSelectedDay, timeOfDay, setTimeOfDay, communion, onStartMeditation }) => {
            const [openSection, setOpenSection] = useState(null);
            const online = useOnline();

            // Al cambiar de día o momento, se cierran los paneles abiertos.
            useEffect(() => { setOpenSection(null); }, [selectedDay, timeOfDay]);

            const toggleSection = (index) => {
                setOpenSection(openSection === index ? null : index);
            };

            const daysOfWeek = [0, 1, 2, 3, 4, 5, 6];

            const getYouTubeInfo = (url) => {
                if (!url) return null;
                const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/))([^"&?\/\s]{11})/;
                const match = url.match(regExp);

                if (match && match[1]) {
                    return {
                        id: match[1],
                        embedUrl: `https://www.youtube.com/embed/${match[1]}?rel=0&showinfo=0`,
                        watchUrl: url,
                        isShort: url.includes('shorts/')
                    };
                }
                return null;
            }

            const videoInfo = getYouTubeInfo(communion.videoUrl);

            return (
                <div className="flex flex-col items-center w-full max-w-md animate-fade-in mt-28 mb-12 relative z-10">
                     
                    {/* Selector de Días */}
                    <div className="flex space-x-2 mb-6 overflow-x-auto max-w-full p-2 scrollbar-hide w-full justify-start md:justify-center relative z-20 px-4">
                        {daysOfWeek.map((d) => (
                            <button key={d} onClick={() => setSelectedDay(d)} aria-label={communionsData[d].name} aria-pressed={selectedDay === d} title={communionsData[d].name}
                                className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${selectedDay === d ? 'bg-amber-100 text-black border-amber-200 scale-110 shadow-[0_0_15px_rgba(251,191,36,0.6)]' : 'bg-black/50 text-gray-300 border-white/10 hover:bg-black/70 hover:border-white/30 backdrop-blur-md'}`}>
                                {DAY_SHORT[d]}
                            </button>
                        ))}
                    </div>

                     {/* Controles de Día/Noche */}
                     <div className="w-full flex justify-center items-center gap-2 mb-4 bg-black/40 p-2 rounded-full backdrop-blur-md shadow-lg border border-white/10 relative z-20 overflow-hidden">
                        <button onClick={() => setTimeOfDay('morning')} className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-full transition-all duration-500 ${timeOfDay === 'morning' ? 'bg-amber-500 text-white shadow-lg' : 'bg-transparent text-gray-400 hover:bg-white/5'}`}>
                            <Icon name="Sunrise" size={20} />
                            {timeOfDay === 'morning' && <span className="font-cinzel text-xs font-bold tracking-widest uppercase hidden md:inline">Mañana</span>}
                        </button>
                        <button onClick={() => setTimeOfDay('midday')} className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-full transition-all duration-500 ${timeOfDay === 'midday' ? 'bg-yellow-500 text-white shadow-lg' : 'bg-transparent text-gray-400 hover:bg-white/5'}`}>
                            <Icon name="Sun" size={20} />
                            {timeOfDay === 'midday' && <span className="font-cinzel text-xs font-bold tracking-widest uppercase hidden md:inline">Mediodía</span>}
                        </button>
                        <button onClick={() => setTimeOfDay('evening')} className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-full transition-all duration-500 ${timeOfDay === 'evening' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-transparent text-gray-400 hover:bg-white/5'}`}>
                            <Icon name="Moon" size={20} />
                            {timeOfDay === 'evening' && <span className="font-cinzel text-xs font-bold tracking-widest uppercase hidden md:inline">Noche</span>}
                        </button>
                    </div>

                    <div className="relative z-20 px-4 mb-8">
                        <p className="text-center text-xs md:text-sm text-white/90 font-lato italic leading-relaxed drop-shadow-md">
                            "Al llegar el día abrazo a mi Madre, al llegar la noche me uno a mi Padre y con la llegada del atardecer y de la mañana respiraré tu Ley y no interrumpiré estas comuniones hasta el fin de los tiempos."
                        </p>
                        <div className="h-px w-16 bg-white/20 mx-auto mt-4"></div>
                    </div>

                    <div className="text-center mb-8 relative z-10">
                        <p className="font-cinzel text-xs tracking-[0.3em] uppercase text-amber-200/80 mb-3">{communionsData[selectedDay].name} · {TIME_LABEL[timeOfDay]}</p>
                        <h1 className="font-cinzel text-3xl md:text-4xl text-white font-bold drop-shadow-lg mb-2">{communion.angel}</h1>
                        <div className="h-px w-20 bg-amber-500/50 mx-auto"></div>
                    </div>

                    {/* MENU VERTICAL (ACORDEÓN) */}
                    <div className="w-full relative z-10">
                        
                        {videoInfo && (
                            <AccordionItem 
                                title="Introducción por Yahshua" 
                                icon="Video" 
                                isOpen={openSection === 0} 
                                onClick={() => toggleSection(0)}
                            >
                                <p className="text-sm text-gray-300 mb-4 text-center">Escucha las enseñanzas sagradas sobre esta comunión.</p>
                                <div className={`relative w-full rounded-lg overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] bg-black/50 ${videoInfo.isShort ? 'pb-[177.77%] max-w-[250px] mx-auto' : 'pb-[56.25%]'}`}>
                                    {/* Obtenemos la miniatura oficial de YouTube automáticamente */}
                                    <img 
                                        src={`https://img.youtube.com/vi/${videoInfo.id}/hqdefault.jpg`} 
                                        alt="Miniatura del video" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} 
                                        className="absolute top-0 left-0 w-full h-full object-cover opacity-60 hover:opacity-40 transition-opacity"
                                    />
                                    {!online && (
                                        <div className="absolute inset-0 z-10 bg-black/75 flex flex-col items-center justify-center p-4 text-center">
                                            <Icon name="WifiOff" size={28} className="text-amber-200 mb-2" />
                                            <span className="text-xs text-gray-200">El video necesita conexión a internet</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <a 
                                            href={videoInfo.watchUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="w-16 h-16 rounded-full flex items-center justify-center bg-red-600/90 hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)] group transition-all duration-300 transform hover:scale-110 cursor-pointer border border-white/20"
                                        >
                                            <Icon name="Play" size={30} className="text-white ml-1" fill="currentColor" />
                                        </a>
                                        <span className="mt-4 bg-black/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-white border border-white/10 uppercase shadow-lg">
                                            Abrir en YouTube
                                        </span>
                                    </div>
                                </div>
                            </AccordionItem>
                        )}

                        {(communion.symbolImage || communion.symbolMeaning) && (
                            <AccordionItem 
                                title={timeOfDay === 'midday' ? "Concepto para la contemplación" : "Símbolo de la comunión y concepto clave a meditar"} 
                                icon="Image" 
                                isOpen={openSection === 1} 
                                onClick={() => toggleSection(1)}
                            >
                                <div className="flex flex-col items-center">
                                    {communion.symbolImage && timeOfDay !== 'midday' && (
                                        <div className="w-full h-48 shrink-0 rounded-lg overflow-hidden mb-4 border border-white/20 shadow-inner bg-black/20">
                                            <img src={communion.symbolImage} alt="Símbolo" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                    {communion.symbolMeaning && (
                                        <p className="italic text-center text-amber-100/80 leading-relaxed text-sm md:text-base">"{communion.symbolMeaning}"</p>
                                    )}
                                </div>
                            </AccordionItem>
                        )}

                        {communion.messenger && (
                            <AccordionItem 
                                title="Mensajero Principal" 
                                icon="User" 
                                isOpen={openSection === 2} 
                                onClick={() => toggleSection(2)}
                            >
                                <h3 className="font-cinzel text-xl text-amber-200 mb-2">{communion.messenger}</h3>
                                <div className="space-y-4">
                                    {communion.messengerMeaning.split('\n').map((paragraph, idx) => (
                                        paragraph.trim() && <p key={idx} className="text-left text-gray-300 leading-relaxed text-sm md:text-base">{paragraph.trim()}</p>
                                    ))}
                                </div>
                            </AccordionItem>
                        )}

                        {communion.wordsOfYahshua && (
                            <AccordionItem 
                                title="Palabras de Yahshua" 
                                icon="Stars" 
                                isOpen={openSection === 4} 
                                onClick={() => toggleSection(4)}
                            >
                                <div className="space-y-4">
                                    {communion.wordsOfYahshua.split('\n').map((paragraph, idx) => (
                                        paragraph.trim() && <p key={idx} className="text-left text-gray-200 leading-relaxed text-sm md:text-base">"{paragraph.trim()}"</p>
                                    ))}
                                </div>
                            </AccordionItem>
                        )}

                        {timeOfDay === 'midday' && communion.meditationText && (
                            <AccordionItem 
                                title="Oración de Paz" 
                                icon="Heart" 
                                isOpen={openSection === 3} 
                                onClick={() => toggleSection(3)}
                            >
                                <p className="italic text-center text-amber-100/80 leading-relaxed text-sm md:text-base">"{communion.meditationText}"</p>
                            </AccordionItem>
                        )}

                        <div className="mt-8 flex justify-center">
                            <button 
                                onClick={onStartMeditation}
                                aria-label="Iniciar meditación"
                                className="glass-button w-20 h-20 rounded-full flex items-center justify-center bg-amber-500/20 hover:bg-amber-500/40 border-amber-200/30 group transition-all duration-500 shadow-[0_0_30px_rgba(251,191,36,0.2)] hover:shadow-[0_0_50px_rgba(251,191,36,0.4)]"
                            >
                                <Icon name="Play" size={32} className="text-amber-100 ml-1 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                        <p className="text-center mt-3 text-xs uppercase tracking-widest text-amber-200/50">Iniciar Meditación</p>
                    </div>
                </div>
            );
        };

        const GuideView = () => (
            <div className="w-full max-w-4xl animate-fade-in p-4 mt-20 mb-12">
                <h2 className="font-cinzel text-3xl md:text-4xl text-center text-amber-100 mb-8 text-shadow-lg drop-shadow-md">Guía de Práctica</h2>
                
                <div className="space-y-6">
                    {/* Momentos del Día */}
                    <div className="glass-panel p-6 md:p-8 rounded-2xl">
                        <h3 className="font-cinzel text-2xl text-amber-200 mb-4 flex items-center gap-3">
                            <Icon name="Sunrise" className="text-amber-300" /> Momentos Clave del Día
                        </h3>
                        <p className="text-gray-200 font-light mb-6">Las prácticas se dividen en tres momentos clave del día:</p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                <Icon name="Sunrise" className="text-orange-400 shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-white mb-1">Por la mañana <span className="text-sm font-normal text-gray-400">(antes de la salida del sol)</span></h4>
                                    <p className="text-sm md:text-base text-gray-300">Se realiza la Comunión con las fuerzas terrenales de la Madre Terrenal.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                <Icon name="Sun" className="text-yellow-400 shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-white mb-1">Al mediodía</h4>
                                    <p className="text-sm md:text-base text-gray-300">Se realiza la Contemplación de la Séptuple Paz.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                <Icon name="Moon" className="text-indigo-400 shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-white mb-1">Por la tarde/noche <span className="text-sm font-normal text-gray-400">(después de la puesta del sol o antes de dormir)</span></h4>
                                    <p className="text-sm md:text-base text-gray-300">Se realiza la Comunión con las fuerzas celestiales del Padre Celestial.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Técnica de Preparación */}
                    <div className="glass-panel p-6 md:p-8 rounded-2xl">
                        <h3 className="font-cinzel text-2xl text-amber-200 mb-4 flex items-center gap-3">
                            <Icon name="Wind" className="text-cyan-300" /> Preparación y Relajación
                        </h3>
                        <p className="text-gray-200 font-light mb-6">Para que el subconsciente y los centros sutiles del cuerpo se vuelvan receptivos a las energías, los esenios aplicaban un método de relajación en tres pasos:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-black/30 p-5 rounded-xl border border-white/10 hover:bg-black/50 transition-colors text-center">
                                <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center mx-auto mb-3 border border-cyan-500/30">
                                    <span className="font-cinzel font-bold text-cyan-200">1</span>
                                </div>
                                <h4 className="font-bold text-white mb-2">Relajación Muscular</h4>
                                <p className="text-sm text-gray-400">Liberar tensiones físicas contrayendo y relajando cada grupo de músculos del cuerpo paso a paso.</p>
                            </div>
                            <div className="bg-black/30 p-5 rounded-xl border border-white/10 hover:bg-black/50 transition-colors text-center">
                                <div className="w-10 h-10 rounded-full bg-teal-900/50 flex items-center justify-center mx-auto mb-3 border border-teal-500/30">
                                    <span className="font-cinzel font-bold text-teal-200">2</span>
                                </div>
                                <h4 className="font-bold text-white mb-2">Respiración Rítmica</h4>
                                <p className="text-sm text-gray-400">Mantener una respiración superficial y rítmica que reduce la frecuencia cardíaca y la actividad nerviosa.</p>
                            </div>
                            <div className="bg-black/30 p-5 rounded-xl border border-white/10 hover:bg-black/50 transition-colors text-center">
                                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center mx-auto mb-3 border border-purple-500/30">
                                    <span className="font-cinzel font-bold text-purple-200">3</span>
                                </div>
                                <h4 className="font-bold text-white mb-2">Silencio Mental</h4>
                                <p className="text-sm text-gray-400">Apagaba todo flujo de pensamientos imaginando la oscuridad y el silencio total de un "terciopelo negro", logrando un estado receptivo.</p>
                            </div>
                        </div>
                    </div>

                    {/* Pasos y Sonidos de Poder */}
                    <div className="glass-panel p-6 md:p-8 rounded-2xl">
                        <h3 className="font-cinzel text-2xl text-amber-200 mb-4 flex items-center gap-3">
                            <Icon name="Stars" className="text-yellow-300" /> Pasos y Sonidos de Poder
                        </h3>
                        <p className="text-gray-200 font-light mb-6">
                            Primero la oración de reverencia, luego saluda al guardián del árbol de la vida Enoc. Según el momento del día recita la oración y contempla el símbolo y concepto. 
                            Los iniciados (que hayan recibido los sonidos de poder) cantarán las palabras para cada rama y raíz. 
                            Sin embargo aquí te compartiremos el sonido de poder para algunas ramas:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-lg border border-white/10">
                                <span className="text-gray-300">Rama del Amor:</span>
                                <span className="font-cinzel text-amber-300 font-bold tracking-widest">Ahhh Hahh</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-lg border border-white/10">
                                <span className="text-gray-300">Paz:</span>
                                <span className="font-cinzel text-amber-300 font-bold tracking-widest">Ahhh Ommm</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-lg border border-white/10">
                                <span className="text-gray-300">Rama Central:</span>
                                <span className="font-cinzel text-amber-300 font-bold tracking-widest">Ahhh Yahhh</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-lg border border-white/10">
                                <span className="text-gray-300">Raíz Central (Madre Tierra):</span>
                                <span className="font-cinzel text-amber-300 font-bold tracking-widest text-right">Ahhh MAhhh</span>
                            </div>
                        </div>
                    </div>

                    {/* Requisito */}
                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-green-500 bg-green-900/20">
                        <div className="flex items-start gap-4">
                            <Icon name="Sprout" className="text-green-400 shrink-0" size={32} />
                            <div>
                                <h4 className="font-cinzel text-xl text-green-300 mb-2">Requisito Fundamental</h4>
                                <p className="text-gray-200">El único requisito fundamental para la práctica del Yoga Esenio es mantener una dieta libre de carne.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        const AboutView = () => (
            <div className="w-full max-w-2xl animate-fade-in p-4 mt-20 mb-12 flex flex-col items-center text-center">
                <div className="mb-8 animate-breathe-title">
                    <img src="icons/icon-512.png" alt="Logo de Yoga Esenio, Árbol de la Vida" width="112" height="112" className="w-28 h-28 rounded-full mx-auto mb-4 border border-amber-200/40 shadow-[0_0_30px_rgba(251,191,36,0.25)]" />
                    <h2 className="font-cinzel text-3xl md:text-4xl text-amber-100 text-shadow-lg">Acerca de la App</h2>
                </div>
                
                <div className="glass-panel p-8 rounded-2xl space-y-6 w-full">
                    <p className="text-gray-200 font-light leading-relaxed text-lg">
                        Esta app fue creada para facilitar la entrada y comienzo a las almas que buscan transitar el camino esenio. 
                    </p>
                    <p className="text-gray-300 font-light leading-relaxed">
                        Esta aplicación te ayudará a tener a la mano y memorizar los días para cada paz, rama y raíz, así como sus símbolos y conceptos. Quizá después de un tiempo no necesites volver a abrir la app y la sabiduría viva residirá en tu corazón.
                    </p>
                    
                    <div className="h-px w-3/4 bg-white/10 mx-auto my-6"></div>
                    
                    <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                        <Icon name="BookOpen" size={24} className="text-amber-400 mx-auto mb-3" />
                        <h3 className="font-cinzel text-lg text-amber-200 mb-3">Escrituras Base</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            La información de la app está basada en las sagradas escrituras: 
                            <br/><span className="text-gray-200 italic">El Evangelio de los Esenios.</span>
                            <br/><span className="text-gray-200 italic">El Libro de Mattanah o Génesis Nasareano.</span>
                            <br/><span className="text-gray-200 italic">El Nuevo Testamento de La Biblia Nasareana del camino esenio.</span>
                            <br/><span className="text-gray-200 italic font-bold">La Santa Meguillah.</span>
                        </p>
                    </div>

                    <OfflineCard />

                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center">
                        <p className="text-sm text-gray-300 uppercase tracking-widest mb-4">Esta aplicación es de libre uso y gratuita.</p>
                        <div className="inline-block bg-white/10 px-6 py-2 rounded-full border border-white/20 mb-6">
                            <p className="text-xs text-amber-100 uppercase tracking-widest font-bold">
                                Creada por <span className="text-amber-300">High Dimension Channel</span>
                            </p>
                        </div>
                        
                        <a 
                            href="https://paypal.me/IbarraOrtega?locale.x=es_XC" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group flex flex-col items-center p-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all duration-300"
                        >
                            <Icon name="Heart" size={20} className="text-amber-400 mb-2 group-hover:scale-110 transition-transform" fill="currentColor" />
                            <p className="text-sm text-amber-200/90 font-lato text-center max-w-xs">
                                Click aquí para agradecer al héroe anónimo que trabajó en la construcción de esta app.
                            </p>
                        </a>
                    </div>
                </div>
            </div>
        );

        const MainApp = ({ onBack, visible, initialView = 'today' }) => {
            const [currentView, setCurrentView] = useState(initialView);

            useEffect(() => {
                setCurrentView(initialView);
            }, [initialView]);

            const [selectedDay, setSelectedDay] = useState(new Date().getDay());
            const [timeOfDay, setTimeOfDay] = useState('morning');
            const [isMeditating, setIsMeditating] = useState(false);

            useEffect(() => {
                const hours = new Date().getHours();
                if (hours >= 18 || hours < 5) setTimeOfDay('evening');
                else if (hours >= 11 && hours < 18) setTimeOfDay('midday');
                else setTimeOfDay('morning');
            }, []);

            const currentData = communionsData[selectedDay];
            const activeCommunion = timeOfDay === 'morning' ? currentData.morning : timeOfDay === 'midday' ? currentData.midday : currentData.evening;

            const bgStyle = activeCommunion.symbolImage 
                ? { backgroundImage: `url('${activeCommunion.symbolImage}')`, backgroundColor: '#0b1d26' } 
                : {};
            
            const bgClass = activeCommunion.symbolImage 
                ? "bg-cover bg-center bg-breathing-effect" 
                : "bg-gradient-to-br bg-gray-900";

            if (!visible) return null;

            return (
                <div className="relative min-h-dvh w-full overflow-hidden text-white">
                    <div className={`absolute inset-0 z-0 transition-all duration-1000 ${bgClass}`} style={bgStyle}></div>
                    <div className="absolute inset-0 z-0 bg-black/50 backdrop-blur-[2px]"></div> 

                    <div className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden flex flex-col items-center p-4">
                        
                        <button onClick={onBack} aria-label="Volver al inicio" className="fixed top-6 left-3 p-2 text-white/60 hover:text-white z-50">
                            <Icon name="ChevronDown" size={24} className="rotate-90" />
                        </button>

                        <div className="fixed top-6 left-0 right-0 z-40 flex justify-center pl-14 pr-4 md:px-4 pointer-events-none">
                            <div className="glass-panel rounded-full p-1 flex space-x-1 pointer-events-auto shadow-xl bg-black/30 max-w-full overflow-x-auto scrollbar-hide">
                                <button onClick={() => setCurrentView('today')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${currentView === 'today' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}>Hoy</button>
                                <button onClick={() => setCurrentView('week')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${currentView === 'week' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}>Semana</button>
                                <button onClick={() => setCurrentView('library')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${currentView === 'library' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}>Biblioteca</button>
                                <button onClick={() => setCurrentView('guide')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${currentView === 'guide' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}>Guía</button>
                                <button onClick={() => setCurrentView('about')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${currentView === 'about' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}>Info</button>
                            </div>
                        </div>

                        <div className="w-full flex justify-center min-h-[80vh] shrink-0">
                            {currentView === 'today' && (
                                <TodayView 
                                    selectedDay={selectedDay} 
                                    setSelectedDay={setSelectedDay}
                                    timeOfDay={timeOfDay}
                                    setTimeOfDay={setTimeOfDay}
                                    communion={activeCommunion}
                                    onStartMeditation={() => setIsMeditating(true)}
                                />
                            )}

                            {currentView === 'week' && <WeekView communions={communionsData} />}
                            {currentView === 'library' && <LibraryView items={libraryData} />}
                            {currentView === 'guide' && <GuideView />}
                            {currentView === 'about' && <AboutView />}
                        </div>
                    </div>

                    {isMeditating && (
                        <MeditationSession 
                            communion={activeCommunion} 
                            onClose={() => setIsMeditating(false)} 
                        />
                    )}
                </div>
            );
        };

        const GuardianPage = ({ onContinue, visible }) => {
            const bgImageUrl = backgrounds.guardian;

            if (!visible) return null;

            return (
                <div className="fixed inset-0 w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center text-white animate-fade-in">
                    <div className="fixed inset-0 bg-cover bg-center z-0 bg-breathing-effect" style={{ backgroundImage: `url(${bgImageUrl})` }}></div>
                    <div className="fixed inset-0 bg-black/40 z-10"></div>
                    
                    <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-2xl w-full my-auto py-8">
                        <div className="glass-panel rounded-2xl p-8 md:p-12 mb-10 w-full transform transition-all hover:scale-[1.01]">
                            <h2 className="font-cinzel text-2xl md:text-3xl text-amber-200 mb-6 drop-shadow-md">Saludo al Guardián</h2>
                            <div className="h-px w-32 bg-amber-200/50 mx-auto mb-8"></div>
                            <p className="font-cinzel text-lg md:text-2xl leading-relaxed text-shadow-lg italic">
                                "Santo Enoc, ¡Guardián del Árbol de la Vida, te saludo!
                            </p>
                            <p className="font-lato text-base md:text-xl leading-relaxed mt-6 text-gray-100 font-light">
                                Ayúdame a encontrar el centro del Árbol en el centro de mi Ser, para que pueda saborear el fruto del Árbol."
                            </p>
                        </div>
                        <button onClick={onContinue} className="glass-button px-12 py-3 rounded-full text-lg font-bold tracking-widest uppercase text-white cursor-pointer active:scale-95 flex items-center gap-2 group">
                            Continuar <Icon name="BookOpen" size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            );
        };

        const ReverencePage = ({ onContinue, visible }) => {
            const [timeOfDay] = useState(() => {
                const h = new Date().getHours();
                if (h >= 18 || h < 5) return 'evening';
                if (h >= 11 && h < 18) return 'midday';
                return 'morning';
            });
            const { morning: morningImage, midday: middayImage, evening: eveningImage } = backgrounds;
            
            let bgImageUrl = morningImage;
            if (timeOfDay === 'midday') bgImageUrl = middayImage;
            if (timeOfDay === 'evening') bgImageUrl = eveningImage;

            if (!visible) return null;

            return (
                <div className="fixed inset-0 w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center text-white animate-fade-in">
                    <div className="fixed inset-0 bg-cover bg-center z-0 bg-breathing-effect" style={{ backgroundImage: `url(${bgImageUrl})` }}></div>
                    <div className="fixed inset-0 bg-black/50 z-10"></div>
                    
                    <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-3xl w-full my-auto py-8">
                        <div className="glass-panel rounded-2xl p-6 md:p-10 mb-8 w-full max-h-[80vh] overflow-y-auto scrollbar-hide shadow-2xl">
                            <h2 className="font-cinzel text-2xl md:text-3xl text-amber-200 mb-4 drop-shadow-md">Oración de Reverencia</h2>
                            <div className="h-px w-24 bg-amber-200/50 mx-auto mb-6"></div>
                            
                            <div className="font-lato text-sm md:text-base text-gray-200 font-light leading-relaxed text-justify space-y-4">
                                <p className="italic text-center text-amber-100 font-cinzel text-lg md:text-xl mb-4">
                                    "En el Sendero Nasareo del Camino Esenio, Camino en reverencia por el jardín eterno e infinito de YHWH."
                                </p>
                                <p>
                                    Cada día, como el primer día, entro en el jardín eterno e infinito, 
                                    con reverencia al Dios y Diosa Trascendente, Jah y Jahlah; 
                                    con reverencia a Dios y Diosa Inmanente, Jahday y Jahnah; 
                                    con reverencia a los Seres Angélicos que sirven a Dios y Diosa dentro del Óvulo Madre; 
                                    con reverencia a Abraham y Sa'arah que sirven al Señor y Señora como Sumo Sacerdote y Suma Sacerdotisa del Séptimo Cielo de este mundo; 
                                    con reverencia a los Querubines de Elkush que sirven al Árbol de la Vida en este mundo; 
                                    con reverencia al Alma Maternal que sirve como Madre Terrenal en este mundo; 
                                    con reverencia a los grandes maestros de la Senda Nasarea de la Vía Esenia; 
                                    con reverencia a las enseñanzas santas, puras y salvadoras; 
                                    con reverencia al Cuerpo de Cristo, que es la Iglesia del Señor Cristo y Señora Cristo; 
                                    con reverencia a Todos, porque Todos son hijos de Elohim.
                                </p>
                                <p className="font-cinzel text-xl text-center text-amber-200 mt-6 font-bold tracking-widest">Amén.</p>
                            </div>
                        </div>
                        <button onClick={onContinue} className="glass-button px-10 py-3 rounded-full text-lg font-bold tracking-widest uppercase text-white cursor-pointer active:scale-95 flex items-center gap-2 group shrink-0">
                            Continuar <Icon name="BookOpen" size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            );
        };

        const LandingPage = ({ onEnter, onOpenGuide, visible }) => {
            const [timeOfDay] = useState(() => {
                const h = new Date().getHours();
                if (h >= 18 || h < 5) return 'evening';
                if (h >= 11 && h < 18) return 'midday';
                return 'morning';
            });
            const { morning: morningImage, midday: middayImage, evening: eveningImage } = backgrounds;
            
            let bgImageUrl = morningImage;
            if (timeOfDay === 'midday') bgImageUrl = middayImage;
            if (timeOfDay === 'evening') bgImageUrl = eveningImage;

            if (!visible) return null;

            return (
                <div className="fixed inset-0 w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center text-white animate-fade-in">
                    <div className="fixed inset-0 bg-cover bg-center z-0 bg-breathing-effect" style={{ backgroundImage: `url(${bgImageUrl})` }}></div>
                    <div className="fixed inset-0 bg-black/30 z-10"></div>
                    <div className="relative z-20 flex flex-col items-center text-center px-4 space-y-12 my-auto py-8">
                        <div className="flex flex-col items-center space-y-4 animate-breathe-title">
                            <h1 className="font-cinzel text-4xl md:text-6xl font-bold tracking-wider leading-tight drop-shadow-2xl">Yoga Esenio</h1>
                            <div className="h-px w-32 bg-white/50"></div>
                            <h2 className="font-cinzel text-xl md:text-3xl tracking-[0.2em] uppercase opacity-90 rainbow-text">del árbol de la vida</h2>
                        </div>

                        <p className="font-lato text-sm md:text-lg italic tracking-wide text-amber-300 max-w-2xl drop-shadow-md leading-relaxed px-4">
                            "En el Sendero Nasareo del Camino Esenio, Camino en reverencia por el jardín eterno e infinito de YHWH."
                        </p>

                        <div className="flex flex-col gap-4 w-full items-center">
                            <button onClick={onEnter} className="glass-button px-16 py-4 rounded-full text-xl font-bold tracking-widest uppercase text-white cursor-pointer active:scale-95 w-full max-w-xs shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                                Entrar
                            </button>
                            <button onClick={onOpenGuide} className="glass-button px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase text-amber-200/90 cursor-pointer active:scale-95 flex items-center justify-center gap-2 bg-black/20 hover:bg-black/40 transition-colors w-full max-w-xs border border-white/10">
                                <Icon name="BookOpen" size={18} /> Guía de Práctica
                            </button>
                            <InstallButton className="glass-button px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase text-white/90 cursor-pointer active:scale-95 flex items-center justify-center gap-2 bg-black/20 hover:bg-black/40 transition-colors w-full max-w-xs border border-white/10" />
                        </div>
                    </div>
                    <div className="relative z-20 pb-4 opacity-60 font-lato text-xs tracking-widest">© {new Date().getFullYear()} High Dimension Channel</div>
                </div>
            );
        };

        const DAY_SHORT = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
        const TIME_LABEL = { morning: 'Mañana', midday: 'Mediodía', evening: 'Noche' };

        // Todas las imágenes remotas que la app puede mostrar (para el modo sin conexión).
        const collectImageUrls = () => {
            const set = new Set(Object.values(backgrounds));
            Object.values(communionsData).forEach((day) =>
                ['morning', 'midday', 'evening'].forEach((t) => { if (day[t].symbolImage) set.add(day[t].symbolImage); })
            );
            libraryData.forEach((i) => {
                if (i.type === 'Imagen' && i.url && i.url !== '#') set.add(i.url);
                if (i.thumbnail) set.add(i.thumbnail);
            });
            return [...set].filter((u) => {
                try { return new URL(u).hostname.endsWith('googleusercontent.com'); } catch (e) { return false; }
            });
        };

        const Toast = ({ message }) => (
            <div className="fixed bottom-6 inset-x-0 z-[70] flex justify-center px-4 pointer-events-none">
                <div role="status" className="glass-panel bg-black/60 rounded-full px-5 py-3 text-sm text-gray-100 flex items-center gap-2 animate-fade-in max-w-full">
                    <Icon name="WifiOff" size={16} className="text-amber-300 shrink-0" /> {message}
                </div>
            </div>
        );

        const OfflineBadge = () => {
            const online = useOnline();
            if (online) return null;
            return (
                <div className="fixed bottom-4 inset-x-0 z-[60] flex justify-center pointer-events-none">
                    <div role="status" className="glass-panel bg-black/50 rounded-full px-4 py-1.5 text-[11px] tracking-wider uppercase text-amber-100 flex items-center gap-2">
                        <Icon name="WifiOff" size={14} className="text-amber-300" /> Modo sin conexión
                    </div>
                </div>
            );
        };

        const UpdateBanner = () => {
            const pwa = usePWA();
            const [hidden, setHidden] = useState(false);
            if (!pwa.updateAvailable || hidden) return null;
            return (
                <div className="fixed bottom-4 inset-x-0 z-[75] flex justify-center px-4">
                    <div role="status" className="glass-panel bg-slate-900/90 rounded-2xl px-4 py-3 text-sm text-gray-100 flex items-center gap-3">
                        <span>Hay una nueva versión de la app.</span>
                        <button onClick={reloadApp} className="px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-bold uppercase tracking-wider">Actualizar</button>
                        <button onClick={() => setHidden(true)} aria-label="Cerrar aviso" className="text-white/60 hover:text-white"><Icon name="X" size={16} /></button>
                    </div>
                </div>
            );
        };

        const IOSInstallModal = ({ onClose }) => createPortal(
            <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/70 p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-label="Cómo instalar la app">
                <div className="glass-panel bg-slate-900/90 rounded-2xl p-6 w-full max-w-sm text-gray-100" onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-cinzel text-xl text-amber-200 mb-5 text-center">Instalar en iPhone / iPad</h3>
                    <ol className="space-y-4 text-sm text-left">
                        <li className="flex gap-3 items-start"><span className="w-6 h-6 shrink-0 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold flex items-center justify-center">1</span><span>Abre esta página en <b>Safari</b>.</span></li>
                        <li className="flex gap-3 items-start"><span className="w-6 h-6 shrink-0 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold flex items-center justify-center">2</span><span>Toca el botón <b>Compartir</b> <Icon name="Share" size={16} className="inline -mt-1 text-amber-200" /> en la barra del navegador.</span></li>
                        <li className="flex gap-3 items-start"><span className="w-6 h-6 shrink-0 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold flex items-center justify-center">3</span><span>Elige <b>«Añadir a pantalla de inicio»</b> <Icon name="PlusSquare" size={16} className="inline -mt-1 text-amber-200" />.</span></li>
                        <li className="flex gap-3 items-start"><span className="w-6 h-6 shrink-0 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold flex items-center justify-center">4</span><span>Toca <b>Añadir</b>. Se abrirá como una app, incluso sin internet.</span></li>
                    </ol>
                    <button onClick={onClose} className="glass-button mt-6 w-full py-2 rounded-full text-sm font-bold uppercase tracking-widest text-white">Entendido</button>
                </div>
            </div>,
            document.body
        );

        const InstallButton = ({ className = '' }) => {
            const pwa = usePWA();
            const [showIOS, setShowIOS] = useState(false);
            if (pwa.standalone) return null;
            const canPrompt = !!pwa.deferredPrompt;
            if (!canPrompt && !pwa.ios) return null;
            return (
                <React.Fragment>
                    <button onClick={() => (canPrompt ? promptInstall() : setShowIOS(true))} className={className}>
                        <Icon name="Download" size={18} /> Instalar app
                    </button>
                    {showIOS && <IOSInstallModal onClose={() => setShowIOS(false)} />}
                </React.Fragment>
            );
        };

        const OfflineCard = () => {
            const pwa = usePWA();
            const online = useOnline();
            const urls = React.useMemo(collectImageUrls, []);
            const [cached, setCached] = useState(0);
            const [busy, setBusy] = useState(false);
            const [progress, setProgress] = useState(null);
            const [note, setNote] = useState(null);
            const [showIOS, setShowIOS] = useState(false);

            const refresh = async () => setCached(await countCached(urls));
            useEffect(() => { refresh(); }, [pwa.swReady]);

            const download = async () => {
                if (busy) return;
                setBusy(true);
                setNote(null);
                setProgress({ done: 0, total: urls.length, failed: 0 });
                try {
                    const r = await cacheImages(urls, setProgress);
                    await refresh();
                    setNote(r.failed
                        ? { ok: false, text: `Se guardaron ${r.total - r.failed} de ${r.total} imágenes. Inténtalo de nuevo con mejor conexión.` }
                        : { ok: true, text: '¡Listo! Todo el contenido quedó guardado en tu dispositivo.' });
                } catch (e) {
                    setNote({ ok: false, text: 'Este modo de uso no permite guardar contenido. Abre la app desde su dirección web (https).' });
                } finally {
                    setBusy(false);
                    setProgress(null);
                }
            };

            const allCached = urls.length > 0 && cached >= urls.length;
            const pct = progress
                ? Math.round((progress.done / Math.max(1, progress.total)) * 100)
                : Math.round((cached / Math.max(1, urls.length)) * 100);
            const canPrompt = !!pwa.deferredPrompt;
            const btn = 'glass-button w-full py-3 rounded-full text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

            return (
                <div className="bg-black/20 p-6 rounded-xl border border-amber-500/20 text-left">
                    <div className="text-center">
                        <Icon name="Smartphone" size={24} className="text-amber-400 mx-auto mb-3" />
                        <h3 className="font-cinzel text-lg text-amber-200 mb-1">Instalar y usar sin conexión</h3>
                        <p className="text-sm text-gray-400 mb-6">Ten la app en tu pantalla de inicio y practica donde quieras, aunque no haya internet.</p>
                    </div>

                    <div className="mb-6">
                        <p className="text-xs uppercase tracking-widest text-amber-300/80 mb-3">1 · Instalación</p>
                        {pwa.standalone ? (
                            <p className="flex items-center gap-2 text-sm text-green-300"><Icon name="Check" size={16} /> La app ya está instalada en este dispositivo.</p>
                        ) : canPrompt ? (
                            <button onClick={promptInstall} className={btn + ' text-amber-100 bg-amber-500/20'}><Icon name="Download" size={18} /> Instalar en este dispositivo</button>
                        ) : pwa.ios ? (
                            <button onClick={() => setShowIOS(true)} className={btn + ' text-amber-100 bg-amber-500/20'}><Icon name="Share" size={18} /> Cómo instalar en iPhone / iPad</button>
                        ) : !pwa.swSupported ? (
                            <p className="text-sm text-gray-300">Para instalar la app y usarla sin conexión, ábrela desde su dirección web segura (https://…). Esta copia solo funciona con internet.</p>
                        ) : (
                            <p className="text-sm text-gray-300">Abre el menú de tu navegador y elige <b>Instalar app</b> o <b>Añadir a pantalla de inicio</b>.</p>
                        )}
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-widest text-amber-300/80 mb-3">2 · Contenido sin conexión</p>
                        <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                            <span>{allCached ? 'Todo guardado' : `${cached} de ${urls.length} imágenes guardadas`}</span>
                            <span className="text-amber-200 font-bold">{pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-4" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
                            <div className="h-full bg-amber-400/80 transition-all duration-300" style={{ width: `${pct}%` }}></div>
                        </div>
                        <button onClick={download} disabled={busy || allCached || !online} className={btn + ' text-white'}>
                            {busy ? <React.Fragment>Descargando… {pct}%</React.Fragment>
                                : allCached ? <React.Fragment><Icon name="Check" size={18} /> Guardado en este dispositivo</React.Fragment>
                                : <React.Fragment><Icon name="Download" size={18} /> Descargar para uso sin conexión</React.Fragment>}
                        </button>
                        {!online && !allCached && <p className="text-xs text-amber-200/80 mt-3 text-center">Conéctate a internet para poder descargar.</p>}
                        {note && <p className={`text-sm mt-3 text-center ${note.ok ? 'text-green-300' : 'text-amber-200'}`}>{note.text}</p>}
                        <p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">Los videos de YouTube y los libros de la Biblioteca se abren en sitios externos y siempre necesitan internet.</p>
                    </div>

                    {showIOS && <IOSInstallModal onClose={() => setShowIOS(false)} />}
                </div>
            );
        };

        const getStartView = () => {
            const v = new URLSearchParams(window.location.search).get('view');
            return ['today', 'week', 'library', 'guide', 'about'].includes(v) ? v : null;
        };

        const App = () => {
            // Los accesos directos de la app (?view=today / ?view=guide) saltan directo al contenido.
            const startView = React.useMemo(getStartView, []);
            const [currentScreen, setCurrentScreen] = useState(startView ? 'main' : 'landing');
            const [mainAppView, setMainAppView] = useState(startView || 'today');

            return (
                <React.Fragment>
                    {currentScreen === 'landing' && (
                        <LandingPage 
                            visible={true} 
                            onEnter={() => setCurrentScreen('reverence')} 
                            onOpenGuide={() => { setMainAppView('guide'); setCurrentScreen('main'); }} 
                        />
                    )}
                    {currentScreen === 'reverence' && <ReverencePage visible={true} onContinue={() => setCurrentScreen('guardian')} />}
                    {currentScreen === 'guardian' && <GuardianPage visible={true} onContinue={() => { setMainAppView('today'); setCurrentScreen('main'); }} />}
                    {currentScreen === 'main' && <MainApp visible={true} onBack={() => setCurrentScreen('landing')} initialView={mainAppView} />}
                    <OfflineBadge />
                    <UpdateBanner />
                </React.Fragment>
            );
        };

        initPWA();
        createRoot(document.getElementById('root')).render(<App />);
