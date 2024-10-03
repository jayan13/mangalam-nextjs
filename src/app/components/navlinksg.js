'use client'
 
import { usePathname } from 'next/navigation'
import Link from 'next/link'
 
export default function NavLinksg() {
  const pathname = usePathname()
  return (
  <div className="gray-menu">
    <ul>
      <li><Link href="/category/8061-special-coverage.html" className={`link ${pathname === '/category/8061-special-coverage.html' ? 'active' : ''}`}>Special Coverage</Link></li>
      <li><Link href="/category/100-crime.html" className={`link ${pathname === '/category/100-crime.html' ? 'active' : ''}`}>Crime</Link></li>
      <li><Link href="/category/193-health-food-habits.html" className={`link ${pathname === '/category/193-health-food-habits.html' ? 'active' : ''}`}>Food</Link></li>
      <li><Link href="/category/583-opinion.html" className={`link ${pathname === '/category/583-opinion.html' ? 'active' : ''}`}>Opinion</Link></li>
      <li><Link href="/category" className={`link ${pathname === '/category' ? 'active' : ''}`}>Fact Check</Link></li>
      <li><Link href="/category" className={`link ${pathname === '/category' ? 'active' : ''}`}>New in Pics</Link></li>
      <li><Link href="/category" className={`link ${pathname === '/category' ? 'active' : ''}`}>Videos</Link></li>
      <li><Link href="/category/225-web-stories.html" className={`link ${pathname === '/category' ? 'active' : ''}`}>Web stories</Link></li>
      <li><Link href="/category" className={`link ${pathname === '/category' ? 'active' : ''}`}>Shorts</Link></li>
      <li><Link href="/category" className={`link ${pathname === '/category' ? 'active' : ''}`}>Podcasts</Link></li>
      <li><Link href="/category/199-education.html" className={`link ${pathname === '/category/199-education.html' ? 'active' : ''}`}>Education</Link></li>
      <li><Link href="/category/200-tech.html" className={`link ${pathname === '/category/200-tech.html' ? 'active' : ''}`}>Tech</Link></li>
    </ul>
  </div>
  )
}