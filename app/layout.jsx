// app/layout.jsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { StateContext } from '../context/StateContext';
import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://epolet.ru'),
  title: {
    default: 'Изделия из ППУ - Эполет',
    template: '%s | Эполет'
  },
  description: 'Компания Эполет специализируется на производстве изделий из мягкого, жесткого и интегрального пенополиуретана.',
  keywords: 'Интегральный ппу, Жесткий ппу, Пена для матраса, Поролон с памятью, Подлокотники, Пенополиуретан',
  authors: [{ name: 'Эполет' }],
  verification: {
    yandex: '9ec83ae61756bb79',
    google: 'qOh-BE-b0Wza7g3_rzejubyBJcqZpwLJbxq2WOJAY0c',
  },
  icons: {
    icon: '/ep.png',
    shortcut: '/ep.png',
    apple: '/ep.png',
  },
  openGraph: {
    title: 'Изделия из ППУ - Эполет',
    description: 'Производство изделий из пенополиуретана',
    type: 'website',
    locale: 'ru_RU',
    images: [
      {
        url: '/ep.png',
        width: 512,
        height: 512,
        alt: 'Эполет',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className="bg-black">
      <body className="flex flex-col min-h-screen bg-black">
        <StateContext>
          <Navbar />
          <main className="flex-grow pt-[8vh]">{children}</main>
          <Footer />
        </StateContext>
      </body>
    </html>
  );
}