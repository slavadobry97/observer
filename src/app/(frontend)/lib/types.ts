export interface Article {
    id: string;
    title: string;
    category: ArticleCategory;
    author: string;
    date: string;
    excerpt: string;
    imageUrl?: string;
    coverImage?: string | {
        url: string;
        alt: string;
        [key: string]: any;
    };
    imageCaption?: string;
    isBreaking?: boolean;
    content?: string;
}

export enum ArticleCategory {
    UNI_LIFE = 'Жизнь Университета',
    SPORT = 'Спорт',
    CULTURE = 'Культура',
    OPINION = 'Мнения',
}

export interface Ad {
    id: string;
    title: string;
    text: string;
    contact?: string;
}

export interface WeatherData {
    temp: number;
    condition: string;
}
