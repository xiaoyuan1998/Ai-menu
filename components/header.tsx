import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/90 transition-colors font-playfair">
          AI美食菜单生成器
        </Link>
        <nav>
          <ul className="flex space-x-1 md:space-x-4">
            <li>
              <Link href="#how-it-works" className="hover:text-primary transition-colors">
                <Button variant="ghost">工作原理</Button>
              </Link>
            </li>
            <li>
              <Link href="#examples" className="hover:text-primary transition-colors">
                <Button variant="ghost">案例展示</Button>
              </Link>
            </li>
            <li>
              <Link href="#create" className="hover:text-primary transition-colors">
                <Button variant="default">开始创建</Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

