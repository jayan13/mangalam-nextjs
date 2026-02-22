import Script from 'next/script';

function Addheader() {

  return (<>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS}`} strategy="afterInteractive" crossOrigin="anonymous" />
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

    <Script src="https://cdn.unibots.in/coronaWidget/coronaWidget38/script.js" strategy="lazyOnload" />
    <Script src="https://securepubads.g.doubleclick.net/tag/js/gpt.js" strategy="afterInteractive" crossOrigin="anonymous" />
    <Script src="https://cdn.unibotscdn.com/player/mvp/player.js" strategy="lazyOnload" />
  </>)
}

export default Addheader;