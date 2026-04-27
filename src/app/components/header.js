'use client';
import Link from 'next/link';
import Image from "next/image";
import District from "./district";
import NavLinks from "./navlinks";
import NavLinksg from "./navlinksg";
import EnNavLinks from "./EnNavLinks";
import Weather from "./weather";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';


function Header() {
  const pathname = usePathname();
  const isEn = pathname.startsWith('/en-news');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  return (
    <header className="main-header no-printme">
      <div className="logo-header">
        <div className="logo-left">
          <div className="logo-left-top">

          </div>
          <div className="weather">
            <Weather />
          </div>
        </div>
        <div className="mangalam-logo">
          <Link href={`/`} alt='mangalam'>
            <Image src="/img/mangalam-logo.svg" width={427} height={59} alt="Mangalam" />
          </Link>
          <div className="current-date" style={{ textAlign: 'center', fontSize: '13px', marginTop: '5px', fontWeight: '500' }}>
            {currentDate}
          </div>
        </div>

        <div className="logo-right">
          <div className="logo-right-top-links">
            {isEn ? (
              <Link href="/" className="icon-link"><span>Malayalam Edition</span></Link>
            ) : (
              <Link href="/en-news" className="icon-link"><span>English Edition</span></Link>
            )}
            <Link href="https://epaper.mangalam.com" className="icon-link"><Image src="/img/newspaper.svg" width={17} height={17} alt="E-Paper" /><span>E-Paper</span></Link>
          </div>
          <District />
        </div>
      </div>
      {isEn ? (
        <EnNavLinks />
      ) : (
        <>
          <NavLinks />
          <NavLinksg />
        </>
      )}
    </header>
  );
}

export default Header;