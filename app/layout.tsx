import './globals.css'
import type { Metadata } from 'next'
import { Noto_Sans_SC, Playfair_Display } from 'next/font/google'
import { LanguageProvider } from '@/contexts/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'

const notoSansSC = Noto_Sans_SC({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-sc',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'AI美食菜单生成器',
  description: '使用AI技术,将您的菜单转化为视觉盛宴',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className={`${notoSansSC.variable} ${playfair.variable}`}>
      <body className={notoSansSC.className}>
        <LanguageProvider>
          <LanguageSwitcher />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
