'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Search, User, X, Archive as ArchiveIcon, CloudSun } from 'lucide-react';
import { ArticleCategory, WeatherData } from '../lib/types';

interface MastheadProps {
    dailyBriefing: string;
    weather?: WeatherData;
    onSearchClick: () => void;
    onArchiveClick: () => void;
    activeCategory: ArticleCategory | null;
    onCategorySelect: (category: ArticleCategory | null) => void;
}

export const Masthead: React.FC<MastheadProps> = ({
    dailyBriefing,
    weather,
    onSearchClick,
    onArchiveClick,
    activeCategory,
    onCategorySelect
}) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [formattedDate, setFormattedDate] = React.useState("");

    React.useEffect(() => {
        const currentDate = new Date().toLocaleDateString('ru-RU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        setFormattedDate(currentDate.toUpperCase());
    }, []);

    return (
        <header className="bg-paper text-ink relative z-30">
            {/* Top Bar */}
            <div className="border-b border-gray-300 py-2.5">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center text-[10px] md:text-xs font-sans uppercase tracking-widest text-gray-600">
                        <div className="flex flex-col space-y-0.5">
                            <span className="font-bold text-ink">Выпуск 142, № 44</span>
                            <span className="text-gray-400 font-medium">{formattedDate || 'ЗАГРУЗКА...'}</span>
                        </div>

                        <div className="flex flex-col items-end space-y-1.5 text-right">
                            <div className="flex items-center space-x-3 md:space-x-4 leading-none">
                                <a href="#" className="hover:text-uni-red transition-colors font-bold text-ink">Войти</a>
                                <a href="#" className="hover:text-uni-red transition-colors font-bold text-ink">Подписка</a>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-500 font-medium h-4">
                                <CloudSun size={15} className="text-uni-gold -translate-y-[2px] shrink-0" />
                                <span className="tabular-nums tracking-normal translate-y-[0.5px]">
                                    {weather ? `${weather.condition.toUpperCase()}, ${weather.temp}°C` : 'ЗАГРУЗКА...'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Title Area */}
            <div className="py-8 md:py-14 border-b-4 border-double border-black relative">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center space-x-8 md:space-x-12 mb-3">
                        <div className="hidden lg:block w-8 md:w-24 h-px bg-black/10"></div>
                        <h1
                            onClick={() => onCategorySelect(null)}
                            className="font-masthead text-5xl md:text-7xl lg:text-7xl uppercase tracking-[0.05em] leading-none cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            Студенческий Обозреватель
                        </h1>
                        <div className="hidden lg:block w-8 md:w-24 h-px bg-black/10"></div>
                    </div>
                    <p className="font-serif italic text-xs md:text-xl text-gray-500 mt-2 tracking-wide">
                        &quot;Veritas, Libertas, et Caffeina&quot;
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div className="sticky top-0 bg-paper z-40 border-b border-black shadow-sm">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-between py-3">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="md:hidden p-1 hover:bg-gray-100 rounded-sm transition-colors"
                            aria-label="Открыть меню"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="hidden md:flex grow justify-center">
                            <ul className="flex space-x-10 font-sans font-bold uppercase text-[11px] tracking-[0.2em] text-gray-500">
                                {Object.values(ArticleCategory).map((cat) => (
                                    <li
                                        key={cat}
                                        onClick={() => onCategorySelect(cat)}
                                        className={`cursor-pointer transition-colors border-b-2 pb-1 ${activeCategory === cat ? 'text-uni-red border-uni-red' : 'hover:text-uni-red border-transparent hover:border-uni-red'}`}
                                    >
                                        {cat}
                                    </li>
                                ))}
                                <li className="text-gray-300">|</li>
                                <li
                                    onClick={onArchiveClick}
                                    className="cursor-pointer hover:text-uni-red transition-colors italic tracking-widest flex items-center gap-1"
                                >
                                    <ArchiveIcon size={14} />
                                    Архив
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button onClick={onSearchClick} className="hover:text-gray-600 transition-colors p-1" aria-label="Поиск">
                                <Search size={22} />
                            </button>
                            <User size={22} className="cursor-pointer hover:text-gray-600 hidden md:block" />
                        </div>
                    </nav>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 transition-opacity"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="fixed top-0 left-0 w-[80%] max-w-sm h-full bg-paper z-70 shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col border-r border-black">
                        <div className="p-6 border-b border-black flex justify-between items-center">
                            <span className="font-masthead text-2xl">МЕНЮ</span>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="grow overflow-y-auto py-8 px-6">
                            <ul className="space-y-6 font-sans font-black uppercase text-lg tracking-widest text-ink">
                                <li className="group flex items-center">
                                    <span className={`w-0 group-hover:w-4 h-0.5 bg-uni-red transition-all mr-0 group-hover:mr-2 ${!activeCategory ? 'w-4 mr-2' : ''}`}></span>
                                    <button onClick={() => { onCategorySelect(null); setIsMenuOpen(false); }} className={`hover:text-uni-red transition-colors ${!activeCategory ? 'text-uni-red' : ''}`}>Главная</button>
                                </li>
                                {Object.values(ArticleCategory).map((cat) => (
                                    <li key={cat} className="group flex items-center">
                                        <span className={`w-0 group-hover:w-4 h-0.5 bg-uni-red transition-all mr-0 group-hover:mr-2 ${activeCategory === cat ? 'w-4 mr-2' : ''}`}></span>
                                        <button onClick={() => { onCategorySelect(cat); setIsMenuOpen(false); }} className={`text-left hover:text-uni-red transition-colors ${activeCategory === cat ? 'text-uni-red' : ''}`}>{cat}</button>
                                    </li>
                                ))}
                                <li className="pt-4 border-t border-black/10">
                                    <button
                                        onClick={() => { onArchiveClick(); setIsMenuOpen(false); }}
                                        className="text-gray-500 italic hover:text-uni-red transition-colors"
                                    >
                                        Архив номеров
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )}

            {/* Daily Briefing Ticker */}
            <div className="bg-ink text-paper py-2 overflow-hidden relative border-t border-white/10">
                <div className="container mx-auto px-4 flex items-center">
                    <span className="font-bold text-[9px] md:text-xs bg-uni-red text-white px-2 py-0.5 mr-3 md:mr-4 whitespace-nowrap uppercase tracking-wider">
                        Сводка дня
                    </span>
                    <div className="overflow-hidden relative w-full">
                        <p className="whitespace-nowrap animate-[marquee_30s_linear_infinite] font-serif text-sm italic">
                            {dailyBriefing}
                        </p>
                    </div>
                </div>
            </div>

        </header>
    );
};
