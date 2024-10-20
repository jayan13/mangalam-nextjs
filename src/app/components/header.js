import Link from 'next/link';
import Image from "next/image";
import District from "./district";
//import ShowDate from "./showdate";
import NavLinks from "./navlinks";
import NavLinksg from "./navlinksg";
import Weather from "./weather";
//import GoogleAd from "../adds/GoogleAd";

function Header() {

      
return <header className="main-header no-printme">
<div className="header-advertisement">
  <div className="advertisement-text">Advertisement</div>
  {/*<GoogleAd adSlot="8131115980" adStyle={{ width: '100%', height: '200px' }} />*/}
</div>
<div className="logo-header">
  <div className="logo-left">
    <div className="logo-left-top">
      <Link href="#" className="icon-link"><Image src="/img/menu-burger-1.svg" width={17} height={17} alt="Explore"/><span>Explore</span></Link>
      <Link href="#" className="icon-link"><Image src="/img/search.svg" width={17} height={17} alt="Search" /><span>Search</span></Link>
    </div>
    <div className="weather">
      <Weather />
    </div>
  </div>
  <div className="mangalam-logo"><Link href={`/`} alt='mangalam'><Image src="/img/mangalam-logo.svg" width={427} height={59} alt="Mangalam" /></Link></div>

  <div className="logo-right">
    <Link href="https://epaper.mangalam.com" className="icon-link"><Image src="/img/newspaper.svg" width={17} height={17} alt="E-Paper" /><span>E-Paper</span></Link>
    <District />
  </div>
</div>
<NavLinks />
<NavLinksg />
</header>
}

export default Header;