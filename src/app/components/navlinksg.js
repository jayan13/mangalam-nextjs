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
        <li><Link href="/category/193-food-habits.html" className={`link ${pathname === '/category/193-food-habits.html' ? 'active' : ''}`}>Food</Link></li>
        <li><Link href="/category/583-opinion.html" className={`link ${pathname === '/category/583-opinion.html' ? 'active' : ''}`}>Opinion</Link></li>
        <li><Link href="/category/8145-fact-check.html" className={`link ${pathname === '/category/8145-fact-check.html' ? 'active' : ''}`}>Fact Check</Link></li>
        <li><Link href="/video" className={`link ${pathname === '/video' ? 'active' : ''}`}>Videos</Link></li>
        <li><Link href="/web-stories" className={`link ${pathname === '/web-stories' ? 'active' : ''}`}>Web stories</Link></li>
        <li><Link href="/photo-gallery" className={`link ${pathname === '/photo-gallery' ? 'active' : ''}`}>Photo Gallery</Link></li>
        <li><Link href="/shorts" className={`link ${pathname === '/shorts' ? 'active' : ''}`}>Shorts</Link></li>
        <li><Link href="/podcasts" className={`link ${pathname === '/podcasts' ? 'active' : ''}`}>Podcasts</Link></li>
        <li><Link href="/category/199-education.html" className={`link ${pathname === '/category/199-education.html' ? 'active' : ''}`}>Education</Link></li>
        <li><Link href="/category/200-tech.html" className={`link ${pathname === '/category/200-tech.html' ? 'active' : ''}`}>Tech</Link></li>
      </ul>
    </div>
  )
}
