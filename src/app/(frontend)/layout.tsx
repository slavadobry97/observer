import React from 'react'
import './globals.css'

export const metadata = {
  title: 'Студенческий Обозреватель — Независимое издание университета',
  description: 'Независимый голос студентов. Новости университета, спорт, культура и мнения — всё в одном месте.',
  openGraph: {
    title: 'Студенческий Обозреватель',
    description: 'Независимое университетское издание',
    locale: 'ru_RU',
    type: 'website',
  },
}

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Forum&family=Inter:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  )
}
