import Script from 'next/script';

function Addheader() {

    return (<>
    <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"  crossOrigin="anonymous"  />
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: '${process.env.GOOGLE_ADSENSE_CLIENT_ID}',
                enable_page_level_ads: true
              });
            `,
          }}
        />
      <Script type="text/javascript" async="async" src="https://adunit.datawrkz.com/tms/data/placement/placement_150.min.js"></Script>
      <Script async="async" src="https://cdn.unibots.in/coronaWidget/coronaWidget38/script.js"></Script> 
      <Script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></Script>
    </>)
    }
    
    export default Addheader;