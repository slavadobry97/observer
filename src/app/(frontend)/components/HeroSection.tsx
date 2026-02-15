'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Article } from '../lib/types';
import { Zap } from 'lucide-react';
import { getArticleImageUrl } from '../lib/utils';

interface HeroSectionProps {
    article: Article;
    breakingArticles: Article[];
    onClick: (article: Article) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ article, breakingArticles, onClick }) => {
    const [particles, setParticles] = useState<{ id: number; left: string; top: string; size: number; duration: number; delay: number; opacity: number; driftX: number; driftY: number; blur: number }[]>([]);
    const [parallaxY, setParallaxY] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const generatedParticles = [...Array(30)].map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 20 + 20,
            delay: Math.random() * -40,
            opacity: Math.random() * 0.2 + 0.1,
            driftX: Math.random() * 100 - 50,
            driftY: Math.random() * 100 - 50,
            blur: Math.random() * 2,
        }));
        setParticles(generatedParticles);
    }, []);

    useEffect(() => {
        let requestRef: number;

        const handleScroll = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const scrollDistance = viewportHeight - rect.top;
            const totalDistance = viewportHeight + rect.height;
            const progress = Math.min(Math.max(scrollDistance / totalDistance, 0), 1);

            const maxShift = 100;
            const offset = (progress - 0.5) * maxShift * 2;

            setParallaxY(offset);
            requestRef = requestAnimationFrame(handleScroll);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(requestRef);
        };
    }, []);

    const imageUrl = getArticleImageUrl(article);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-[750px] md:h-[95vh] overflow-hidden border-b-8 border-ink group bg-ink"
        >
            {/* Parallax Background */}
            <div
                className="absolute inset-0 w-full h-full cursor-pointer will-change-transform scale-[1.2]"
                onClick={() => onClick(article)}
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    transform: `translate3d(0, ${parallaxY}px, 0)`
                }}
            />

            {/* Subtle Dust Layer */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-60">
                <div className="dust-container w-full h-full relative">
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            className="dust-particle absolute rounded-full will-change-transform mix-blend-screen"
                            style={{
                                left: p.left,
                                top: p.top,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                background: `rgba(255, 253, 245, ${p.opacity})`,
                                boxShadow: `0 0 4px 1px rgba(255, 255, 255, ${p.opacity * 0.3})`,
                                filter: `blur(${p.blur}px)`,
                                animation: `dust-float ${p.duration}s linear infinite`,
                                animationDelay: `${p.delay}s`,
                                '--drift-x': `${p.driftX}px`,
                                '--drift-y': `${p.driftY}px`,
                            } as React.CSSProperties}
                        />
                    ))}
                </div>
            </div>

            {/* Overlay Gradients */}
            <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/20 to-transparent pointer-events-none z-10"></div>
            <div className="absolute inset-0 bg-linear-to-r from-ink/60 via-transparent to-ink/60 pointer-events-none z-10"></div>

            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] z-10"></div>

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col md:flex-row items-end md:items-stretch justify-between p-6 md:p-16 lg:p-24 text-white pointer-events-none z-20">
                <div className="container mx-auto flex flex-col md:flex-row justify-between w-full h-full pointer-events-auto">
                    <div className="max-w-4xl self-end mb-8 md:mb-0 animate-in slide-in-from-bottom-12 fade-in duration-1000 cursor-pointer" onClick={() => onClick(article)}>
                        <div className="flex items-center space-x-6 mb-8">
                            <span className="inline-block px-5 py-2 bg-uni-red text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl border border-white/10">
                                ЭКСКЛЮЗИВ
                            </span>
                            <div className="h-px bg-white/20 grow hidden md:block"></div>
                        </div>

                        <h2 className="font-serif text-5xl md:text-6xl lg:text-6xl font-black leading-[1.05] mb-10 group-hover:text-uni-gold transition-colors duration-700 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] tracking-wide">
                            {article.title}
                        </h2>

                        <div className="flex flex-col md:flex-row md:items-end gap-10 md:gap-16">
                            <p className="font-serif text-xl md:text-2xl text-gray-100/90 line-clamp-3 max-w-2xl italic border-l-4 border-uni-red pl-8 py-2 leading-relaxed tracking-tight">
                                {article.excerpt}
                            </p>

                            <div className="shrink-0 flex flex-col space-y-3 text-[11px] font-sans uppercase tracking-[0.3em] text-gray-400 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10">
                                <span className="text-white font-black">Автор: {article.author}</span>
                                <span>{article.date}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    {breakingArticles.length > 0 && (
                        <div className="hidden xl:flex flex-col w-96 h-full bg-black/70 backdrop-blur-2xl border-l border-white/10 p-10 animate-in slide-in-from-right-12 duration-1000 overflow-y-auto custom-scrollbar shadow-2xl">
                            <div className="flex items-center space-x-4 mb-12">
                                <div className="relative">
                                    <Zap size={20} className="text-uni-red fill-uni-red" />
                                    <div className="absolute inset-0 bg-uni-red rounded-full animate-ping opacity-40"></div>
                                </div>
                                <h3 className="font-sans font-black text-[11px] uppercase tracking-[0.5em] text-white/90">
                                    АКТУАЛЬНОЕ
                                </h3>
                            </div>

                            <div className="space-y-12">
                                {breakingArticles.map((breakArt) => (
                                    <div
                                        key={breakArt.id}
                                        className="group/item cursor-pointer border-b border-white/10 pb-10 last:border-none"
                                        onClick={() => onClick(breakArt)}
                                    >
                                        <span className="block text-[10px] font-bold text-uni-gold uppercase tracking-[0.3em] mb-4 opacity-70 group-hover/item:opacity-100 transition-all">
                                            {breakArt.category}
                                        </span>
                                        <h4 className="font-serif text-xl font-bold leading-snug text-white group-hover/item:text-uni-gold transition-colors line-clamp-3 tracking-tight">
                                            {breakArt.title}
                                        </h4>
                                        <div className="mt-5 flex items-center text-[10px] font-sans text-gray-400 uppercase tracking-widest font-medium">
                                            <span className="tabular-nums">{breakArt.date}</span>
                                            <span className="mx-3 text-gray-700">•</span>
                                            <span className="group-hover/item:text-white transition-colors border-b border-transparent group-hover/item:border-white">ЧИТАТЬ</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto pt-10 border-t border-white/10">
                                <p className="font-serif italic text-xs text-gray-500 text-center leading-relaxed">
                                    &quot;Новости, которые определяют завтрашний день&quot;
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-10 right-10 lg:right-auto lg:left-12 flex flex-col items-center space-y-6 animate-bounce opacity-40 z-20">
                <span className="[writing-mode:vertical-lr] text-[11px] uppercase tracking-[0.4em] text-white font-black">Листать</span>
                <div className="w-px h-16 bg-linear-to-b from-white to-transparent"></div>
            </div>

            <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 3px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); }
          @keyframes dust-float {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            20% { opacity: 0.6; }
            80% { opacity: 0.6; }
            100% { transform: translate(var(--drift-x, 60px), var(--drift-y, -60px)) scale(1.2); opacity: 0; }
          }
        `}</style>
        </section>
    );
};
