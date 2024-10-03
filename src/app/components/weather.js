import Script from 'next/script';

export default function Weather() {
    return (
      <>
        <div id="ww_bb1780b1dce34" v='1.3' loc='auto'
              a='{"t":"horizontal","lang":"en","sl_lpl":1,"ids":[],"font":"Arial","sl_ics":"one_a","sl_sot":"celsius","cl_bkg":"#FFFFFF00","cl_font":"#000000","cl_cloud":"#d4d4d4","cl_persp":"#2196F3","cl_sun":"#FFC107","cl_moon":"#FFC107","cl_thund":"#FF5722","el_whr":3,"el_nme":3,"el_phw":3}'>
              More forecasts: <a href="https://oneweather.org/fuerteventura/august/" id="ww_bb1780b1dce34_u"
                target="_blank">Fuerteventura August weather</a></div>
        <Script
          src="https://app2.weatherwidget.org/js/?id=ww_bb1780b1dce34"
          strategy="lazyOnload"         />
       
      </>
    );
  }