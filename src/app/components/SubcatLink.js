'use client'
 
import { usePathname } from 'next/navigation'
import Link from 'next/link'


export default function SubcatLink(props) {
    const cats=props.subcat;
    const pathname = usePathname();
    return (
        <ul>
        {cats.map((cat,index) => (
            <li key={index}><Link href={`${cat.links}`} className={`link ${pathname === cat.links ? 'active' : ''}`}>{cat.name}</Link></li>
        ))}    
        </ul>
    )
  }