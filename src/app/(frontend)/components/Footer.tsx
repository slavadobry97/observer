'use client';

import React from 'react';
import { ArticleCategory } from '../lib/types';
import { MapPin, Mail, Phone } from 'lucide-react';
import { FOOTER_LOCATION_DESCRIPTIONS, CONTACT_INFO, FOOTER_DESCRIPTION, FOOTER_TITLES, CONTACT_LABELS } from '../lib/constants';

interface FooterProps {
    activeCategory: ArticleCategory | null;
    onCategorySelect: (category: ArticleCategory | null) => void;
    onArchiveClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ activeCategory, onCategorySelect, onArchiveClick }) => {
    const [locationDesc, setLocationDesc] = React.useState("");

    React.useEffect(() => {
        const descriptions = [
            "Кузница горячих новостей (207)",
            "Лаборатория смыслов и мемов (207)",
            "Департамент правды и печенек (207)",
            "Редакция, спальня и кухня (207)"
        ];
        setLocationDesc(descriptions[Math.floor(Math.random() * descriptions.length)]);
    }, []);

    return (
        <footer className="bg-ink text-paper py-16 border-t-8 border-uni-red no-print relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>

            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
                {/* Brand Column */}
                <div className="col-span-1 md:col-span-5 pr-8">
                    <h2
                        className="font-masthead text-5xl mb-8 cursor-pointer tracking-tighter hover:text-uni-gold transition-colors inline-block"
                        onClick={() => onCategorySelect(null)}
                    >
                        {FOOTER_TITLES.brand.split(' ')[0]}<br/>{FOOTER_TITLES.brand.split(' ')[1]}
                    </h2>
                    <div className="w-24 h-1 bg-uni-red mb-8"></div>
                    <p className="font-serif text-lg text-gray-500 max-w-md leading-relaxed italic">
                        {FOOTER_DESCRIPTION}
                    </p>
                </div>

                {/* Navigation Column */}
                <div className="col-span-1 md:col-span-3 md:col-start-7">
                    <h3 className="font-sans font-black uppercase tracking-[0.2em] mb-8 text-xs text-uni-gold border-b border-white/10 pb-4">
                        {FOOTER_TITLES.navigation}
                    </h3>
                    <ul className="space-y-0">
                        {Object.values(ArticleCategory).map((cat) => (
                            <li key={cat} className="border-b border-white/5 last:border-none">
                                <button
                                    onClick={() => onCategorySelect(cat)}
                                    className={`group flex items-center w-full py-3 hover:pl-2 transition-all duration-300 text-left ${activeCategory === cat ? 'text-white' : 'text-gray-400 hover:text-uni-gold'}`}
                                >
                                    <span className="font-sans font-bold uppercase tracking-widest text-[10px]">{cat}</span>
                                </button>
                            </li>
                        ))}
                        <li className="pt-4 mt-2">
                            <button
                                onClick={onArchiveClick}
                                className="group flex items-center text-gray-400 hover:text-white transition-all"
                            >
                                <span className="font-serif italic text-sm border-b border-dashed border-gray-600 group-hover:border-white pb-0.5">{FOOTER_TITLES.archive}</span>
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Contacts Column */}
                <div className="col-span-1 md:col-span-3">
                    <h3 className="font-sans font-black uppercase tracking-[0.2em] mb-8 text-xs text-uni-gold border-b border-white/10 pb-4">
                        {FOOTER_TITLES.contacts}
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-start group">
                            <MapPin size={18} className="text-uni-red mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                            <div className="ml-4">
                                <span className="block font-sans font-bold text-[10px] uppercase tracking-wider text-gray-500 mb-1">{CONTACT_LABELS.address}</span>
                                <p className="font-serif text-gray-300 text-sm leading-snug">
                                    {CONTACT_INFO.address.city}, {CONTACT_INFO.address.street}<br />
                                    <span className={`italic opacity-70 transition-opacity duration-500 ${locationDesc ? 'opacity-70' : 'opacity-0'}`}>
                                        {locationDesc || "Загрузка..."}
                                    </span>
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start group">
                            <Mail size={18} className="text-uni-red mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                            <div className="ml-4">
                                <span className="block font-sans font-bold text-[10px] uppercase tracking-wider text-gray-500 mb-1">{CONTACT_LABELS.email}</span>
                                <a href={`mailto:${CONTACT_INFO.email}`} className="font-serif text-white hover:text-uni-gold transition-colors text-sm border-b border-white/20 pb-0.5">
                                    {CONTACT_INFO.email}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start group">
                            <Phone size={18} className="text-uni-red mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                            <div className="ml-4">
                                <span className="block font-sans font-bold text-[10px] uppercase tracking-wider text-gray-500 mb-1">{CONTACT_LABELS.phone}</span>
                                <p className="font-serif text-gray-300 text-sm tabular-nums">
                                    {CONTACT_INFO.phone}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-24">
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center opacity-40 hover:opacity-100 transition-opacity duration-500">
                     <div className="font-masthead text-xs tracking-[0.3em] mb-4 md:mb-0">
                        {FOOTER_TITLES.subtitle}
                    </div>
                    <div className="font-sans text-[9px] uppercase tracking-widest text-gray-500">
                        © {new Date().getFullYear()} {FOOTER_TITLES.copyright}
                    </div>
                </div>
            </div>
        </footer>
    );
};
