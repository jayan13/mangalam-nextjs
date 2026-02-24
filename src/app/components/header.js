'use client';
import Link from 'next/link';
import Image from "next/image";
import District from "./district";
import NavLinks from "./navlinks";
import NavLinksg from "./navlinksg";
import EnNavLinks from "./EnNavLinks";
import Weather from "./weather";
import { usePathname } from 'next/navigation';

function Header() {
  const pathname = usePathname();
  const isEn = pathname.startsWith('/en');

  return (
    <header className="main-header no-printme">
      <div className="logo-header">
        <div className="logo-left">
          <div className="logo-left-top">
            <Link href="#" className="icon-link"><Image src="/img/menu-burger-1.svg" width={17} height={17} alt="Explore" /><span>Explore</span></Link>
            <Link href="#" className="icon-link"><Image src="/img/search.svg" width={17} height={17} alt="Search" /><span>Search</span></Link>
          </div>
          <div className="weather">
            <Weather />
          </div>
        </div>
        <div className="mangalam-logo">
          <Link href={`/`} alt='mangalam'>
            <Image src="/img/mangalam-logo.svg" width={427} height={59} alt="Mangalam" />
          </Link>
        </div>

        <div className="logo-right">
          <div className="logo-right-top-links">
            {isEn ? (
              <Link href="/" className="icon-link"><span>Malayalam Edition</span></Link>
            ) : (
              <Link href="/en" className="icon-link"><span>English Edition</span></Link>
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