"use client";
import Image from "next/image";
import Link from 'next/link';

export default function Printpage() {
    
    const handleClick = (e) => {
        e.preventDefault();
        //news-content-print
        window.print();
        //console.log("I clicked on the About Page");
       };

    return (
      <Link href="" onClick={(e) => handleClick(e)} title="Print News"><Image src="/img/icons/printer.svg" width={32} height={32} alt="Print" /></Link>
    )
  }