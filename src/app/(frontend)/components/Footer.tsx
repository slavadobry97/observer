'use client';

import React from 'react';
import { ArticleCategory } from '../lib/types';

interface FooterProps {
    activeCategory: ArticleCategory | null;
    onCategorySelect: (category: ArticleCategory | null) => void;
    onArchiveClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ activeCategory, onCategorySelect, onArchiveClick }) => {
    return (
        <footer className="bg-ink text-paper py-16 border-t-12 border-uni-red no-print">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                    <h2
                        className="font-masthead text-4xl mb-6 cursor-pointer tracking-tighter hover:text-uni-gold transition-colors"
                        onClick={() => onCategorySelect(null)}
                    >
                        Студенческий Обозреватель
                    </h2>
                    <div className="w-20 h-1 bg-uni-red mb-6"></div>
                    <p className="font-serif text-base text-gray-400 max-w-md leading-relaxed">
                        Независимый голос студентов с 1885 года. Мы освещаем события Психологии, Менеджмента, Юриспруденции и Социальной работы через призму правды и крепкого эспрессо.
                    </p>
                </div>

                <div>
                    <h3 className="font-sans font-bold uppercase tracking-[0.3em] mb-6 text-xs text-uni-gold">Навигация</h3>
                    <ul className="space-y-3 font-serif text-base text-gray-400">
                        {Object.values(ArticleCategory).map((cat) => (
                            <li key={cat}>
                                <button
                                    onClick={() => onCategorySelect(cat)}
                                    className={`hover:text-white transition-all hover:translate-x-1 transform ${activeCategory === cat ? 'text-white font-bold' : ''}`}
                                >
                                    {cat}
                                </button>
                            </li>
                        ))}
                        <li className="pt-2 border-t border-gray-800">
                            <button
                                onClick={onArchiveClick}
                                className="hover:text-white transition-all hover:translate-x-1 transform italic"
                            >
                                Архив номеров
                            </button>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-sans font-bold uppercase tracking-[0.3em] mb-6 text-xs text-uni-gold">Редакция</h3>
                    <p className="font-serif text-sm text-gray-400 leading-loose">
                        Гл. корпус, каб. 207<br />
                        Университетский проспект, 1<br />
                        <span className="text-white">editor@observer.uni</span><br />
                        +7 (000) STUD-NEWS
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-20 pt-8 border-t border-white/5 text-center">
                <div className="font-masthead text-[10px] text-gray-600 uppercase tracking-[0.5em]">
                    Ex Luce In Tenebris • Студенческий Обозреватель • {new Date().getFullYear()}
                </div>
            </div>
        </footer>
    );
};
