'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function EnNavLinks() {
    const pathname = usePathname()
    return (
        <div className="blue-menu en-font">
            <ul>
                <li><Link href="/en-news" className={`link ${pathname === '/en-news' ? 'active' : ''}`}>HOME</Link></li>
                <li><Link href="/en-news/category/2458-kerala.html" className={`link ${pathname === '/en-news/category/2458-kerala.html' ? 'active' : ''}`}>KERALA</Link></li>
                <li><Link href="/en-news/category/2460-india.html" className={`link ${pathname === '/en-news/category/2460-india.html' ? 'active' : ''}`}>INDIA</Link></li>
                <li><Link href="/en-news/category/2461-world.html" className={`link ${pathname === '/en-news/category/2461-world.html' ? 'active' : ''}`}>WORLD</Link></li>
                <li><Link href="/en-news/category/2462-entertainment.html" className={`link ${pathname === '/en-news/category/2462-entertainment.html' ? 'active' : ''}`}>ENTERTAINMENT</Link></li>
                <li><Link href="/en-news/category/2463-sports.html" className={`link ${pathname === '/en-news/category/2463-sports.html' ? 'active' : ''}`}>SPORTS</Link></li>
                <li><Link href="/en-news/category/2466-business.html" className={`link ${pathname === '/en-news/category/2466-business.html' ? 'active' : ''}`}>BUSINESS</Link></li>
                <li><Link href="/en-news/category/7697-life-style.html" className={`link ${pathname === '/en-news/category/7697-life-style.html' ? 'active' : ''}`}>LIFE STYLE</Link></li>
            </ul>
        </div>
    )
}
