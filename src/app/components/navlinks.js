'use client'
 
import { usePathname } from 'next/navigation'
import Link from 'next/link'
 
export default function NavLinks() {
  const pathname = usePathname()
  return (
    <div className="blue-menu">
    <ul>
      <li><Link href="/category/16-latest-news.html" className={`link ${pathname === '/category/16-latest-news.html' ? 'active' : ''}`}>Latest News</Link></li>
      <li><Link href="/category/19-keralam.html" className={`link ${pathname === '/category/19-keralam.html' ? 'active' : ''}`}>Keralam</Link></li>
      <li><Link href="/category/20-india.html" className={`link ${pathname === '/category/20-india.html' ? 'active' : ''}`}>India</Link></li>
      <li><Link href="/category/21-international.html" className={`link ${pathname === '/category/21-international.html' ? 'active' : ''}`}>INTERNATIONAL</Link></li>
      <li><Link href="/category/15-cinema.html" className={`link ${pathname === '/category/15-cinema.html' ? 'active' : ''}`}>ENTERTAINMENT</Link></li>
      <li><Link href="/category/23-sports.html" className={`link ${pathname === '/category/23-sports.html' ? 'active' : ''}`}>SPORTS</Link></li>
      <li><Link href="/category/201-life-style.html" className={`link ${pathname === '/category/201-life-style.html' ? 'active' : ''}`}>LIFE</Link></li>
      <li><Link href="/category/186-health.html" className={`link ${pathname === '/category/186-health.html' ? 'active' : ''}`}>HEALTH</Link></li>
      <li><Link href="/category/17-pravasi.html" className={`link ${pathname === '/category/17-pravasi.html' ? 'active' : ''}`}>PRAVASI</Link></li>
      <li><Link href="/category/98-sunday-mangalam.html" className={`link ${pathname === '/category/98-sunday-mangalam.html' ? 'active' : ''}`}>SUNDAY MANGALAM</Link></li>
      <li><Link href="/category/937-mangalam-special.html" className={`link ${pathname === '/category/937-mangalam-special.html' ? 'active' : ''}`}>MANGALAM PREMIUM</Link></li>
    </ul>
  </div>
  )
}
