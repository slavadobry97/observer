import { CollectionConfig } from 'payload'

export const Announcements: CollectionConfig = {
    slug: 'announcements',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Заголовок',
        },
        {
            name: 'text',
            type: 'textarea',
            required: true,
            label: 'Текст объявления',
        },
        {
            name: 'contact',
            type: 'text',
            label: 'Контактная информация',
        },
    ],
}
