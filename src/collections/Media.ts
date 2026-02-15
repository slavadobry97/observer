import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.alt && data.filename) {
          data.alt = data.filename.split('.').slice(0, -1).join('.');
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      // required: true, // We auto-fill it, so strictly validation might be tricky if we keep this true in UI but user leaves it empty. 
      // Actually Payload validation runs after beforeValidate. So we can keep it required? 
      // Let's make it not required and rely on the hook, or keep it true and ensure hook fills it.
      // If it's required, the Admin UI might block submission before sending data?
      // No, Payload Admin sends data.
      required: false,
    },
  ],
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    displayPreview: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
}
