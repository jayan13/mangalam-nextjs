'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function EnNavLinks() {
    const pathname = usePathname()
    return (
        <div className="blue-menu en-font">
            <ul>
                <li><Link href="/en" className={`link ${pathname === '/en' ? 'active' : ''}`}>HOME</Link></li>
                <li><Link href="/en/category/2458-kerala.html" className={`link ${pathname === '/en/category/2458-kerala.html' ? 'active' : ''}`}>KERALA</Link></li>
                <li><Link href="/en/category/2460-india.html" className={`link ${pathname === '/en/category/2460-india.html' ? 'active' : ''}`}>INDIA</Link></li>
                <li><Link href="/en/category/2461-world.html" className={`link ${pathname === '/en/category/2461-world.html' ? 'active' : ''}`}>WORLD</Link></li>
                <li><Link href="/en/category/2462-entertainment.html" className={`link ${pathname === '/en/category/2462-entertainment.html' ? 'active' : ''}`}>ENTERTAINMENT</Link></li>
                <li><Link href="/en/category/2463-sports.html" className={`link ${pathname === '/en/category/2463-sports.html' ? 'active' : ''}`}>SPORTS</Link></li>
                <li><Link href="/en/category/2466-business.html" className={`link ${pathname === '/en/category/2466-business.html' ? 'active' : ''}`}>BUSINESS</Link></li>
                <li><Link href="/en/category/7697-life-style.html" className={`link ${pathname === '/en/category/7697-life-style.html' ? 'active' : ''}`}>LIFE STYLE</Link></li>
            </ul>
        </div>
    )
}
