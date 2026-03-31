// app/manifest.js
export default function manifest() {
    return {
      name: 'Эполет - Производство изделий из ППУ',
      short_name: 'Эполет',
      description: 'Профессиональное производство изделий из пенополиуретана',
      start_url: '/',
      display: 'standalone',
      background_color: '#000000',
      theme_color: '#FDB813',
      icons: [
        {
          src: '/ep.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/ep.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    };
  }