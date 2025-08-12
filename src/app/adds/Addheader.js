import Script from 'next/script';

function Addheader() {

    return (<>
      <Script async  src={`https://www.googletagmanager.com/gtag/js?${process.env.GOOGLE_ANALYTICS}`} strategy="afterInteractive" crossOrigin="anonymous"/>
      <Script id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      
      <Script async="async"  src="https://cdn.unibots.in/coronaWidget/coronaWidget38/script.js" ></Script> 
      <Script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js" strategy="afterInteractive" crossOrigin="anonymous"></Script>
      <Script async  src="https://cdn.unibotscdn.com/player/mvp/player.js" ></Script>
    </>)
    }
    
    export default Addheader;