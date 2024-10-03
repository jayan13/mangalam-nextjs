import Link from 'next/link';
import Image from "next/image";

function Footer() {

 return  <footer className="footer">  
 <div className="footer-top">
     <div className="footer-container">
           <div className="footer-logo">
             <a href="/"><Image className="container-26" src="/img/container.svg" alt="logo" width={353} height={73}  /></a>
           </div>

             <div className="footer-header-top">
               <div className="footer-social">
                 <ul>
                   <li><a href="#"><Image src="/img/icons/fb-logo.svg" width={33} height={33} alt="facebook" /></a></li>
                   <li><a href="#"><Image src="/img/icons/in-logo.svg" width={33} height={33} alt="linged"  /></a></li>
                   <li><a href="#"><Image src="/img/icons/instagram-logo.svg" width={33} height={33} alt="insta" /></a></li>
                   <li><a href="#"><Image src="/img/icons/x-logo.svg" width={33} height={33} alt="twitter" /></a></li>
                 </ul>
               </div>
               <div className="app-download">
                   <a href="#"><Image src="/img/icons/app-download.svg"  width={365} height={66} alt="mangalam app" /></a>
               </div>
             </div>
     </div>
 </div>
 
 
<div className="footer-bottom">
<div className="footer-link-list">
  <div className="footer-link-list-frame">
    <ul>
        <li><a className="fhead-link" href="/category/">LATEST NEWS</a></li>
        <li><a className="fhead-link" href="/category/">INDIA</a></li>
        <li><a className="fhead-link" href="/category/">INTERNATIONAL</a></li>
        <li><a className="fhead-link" href="/category/">LOCAL NEWS</a></li>
        <li><a href="/district/12-Thiruvananthapuram-India.html">Thiruvananthapuram</a></li>
  
    <li><a href="/district/1-Alappuzha-India.html">Alappuzha</a></li>
    <li><a href="/district/2-Ernakulam-India.html#">Ernakulam</a></li>
    <li><a href="/district/3-Idukki-India.html">Idukki</a></li>
    <li><a href="/district/4-Kannur-India.html">Kannur</a></li>
    <li><a href="/district/5-Kasaragod-India.html">Kasaragod</a></li>
    <li><a href="/district/6-Kollam-India.html">Kollam</a></li>
    <li><a href="/district/7-Kottayam-India.html">Kottayam</a></li>
    <li><a href="/district/8-Kozhikode-India.html">Kozhikode</a></li>
    <li><a href="/district/9-Malappuram-India.html">Malappuram</a></li>
    <li><a href="/district/10-Palakkad-India.html">Palakkad</a></li>
    <li><a href="/district/11-Pathanamthitta-India.html">Pathanamthitta</a></li>
    <li><a href="/district/13-Thrissur-India.html">Thrissur</a></li>
    <li><a href="/district/14-Wayanad-India.html">Wayanad</a></li>
  </ul>
  </div>

  <div className="footer-link-list-frame">
        <ul>
    <li><a className="fhead-link" href="/category/2462-ENTERTINMENT.html">ENTERTINMENT</a></li>
    <li><a href="/category/15-Movie-news.html">Movie news</a></li>
    <li><a href="/category/45-Chit-Chat.html">Chit Chat</a></li>
  <li><a href="/category/229-Reviews.html">Reviews</a></li>
    <li><a href="/category/47-Interview.html">Interview</a></li>
    <li><a href="/category/1336-Celebrity.html">Celebrity</a></li>
    <li><a href="/category/1-Music.html">Music</a></li>
    <li><a href="/category/48-Miniscreen.html">Miniscreen</a></li>
    <li><a href="/category/1-ott.html">OTT</a></li>
    <li><a href="/category/264-Features.html">Features</a></li>
        </ul>
       
    <ul>
     <li><a className="fhead-link" href="/category/2463-SPORTS.html">SPORTS</a></li>
     <li><a href="/category/2463-Sports-News.html">Sports News</a></li>
     <li><a href="/category/1-Sports-Specials.html">Sports Specials</a></li>
    </ul>
    
  <ul>
    <li><a className="fhead-link" href="/category/337-life.html">LIFE</a></li>
    <li><a href="/category/1326-Life-Style.html">Life Style</a></li>
    <li><a href="/category/108-Women.html">Women</a></li>
    <li><a href="/category/338-Fashion.html">Fashion</a></li>
    <li><a href="/category/113-Parenting.html">Parenting</a></li>
    <li><a href="/category/111-Beauty.html">Beauty</a></li>
   <li><a href="/category/1-Spirituality.html">Spirituality</a></li>
    <li><a href="/category/1-Home-style.html">Home style</a></li>
    <li><a href="/category/340-Travel.html">Travel</a></li>
  <li><a href="/category/8066-Environment.html">Environment</a></li>
    <li><a href="/category/1338-Relations.html">Relations</a></li>
        </ul>
      </div>
  
  <div className="footer-link-list-frame">
    <ul>
      <li><a className="fhead-link" href="/category/186-HEALTH.html"> HEALTH</a></li>
    <li><a href="/category/187-Health-News.html">Health News</a></li>
    <li><a href="/category/188-Fitness-Yoga.html">Fitness/ Yoga</a></li>
    <li><a href="/category/191-Ayurveda.html">Ayurveda</a></li>
    <li><a href="/category/193-Healthy-food-and-Nutrition.html">
        Healthy food and Nutrition</a></li>
    <li><a href="/category/443-Ask-Doctor.html">Ask Doctor</a></li>
    <li><a href="/category/1-Intimacy.html">Intimacy</a></li>
      </ul>
      <ul>
    <li><a className="fhead-link" href="/category/17-PRAVASI.html">PRAVASI</a></li>
    <li><a href="/category/101-Gulf.html">Gulf</a></li>
    <li><a href="/category/102-Europe.html">Europe</a></li>
  <li><a href="/category/103-America.html">America</a></li>
    <li><a href="/category/104-Australia.html">Australia</a></li>
    <li><a href="/category/105-Others.html">Others</a></li>
  <li><a href="/category/106-Pravasi-Special.html">Pravasi Special</a></li>
    <li><a href="/category/411-Pravasi-Rachana.html">Pravasi Rachana</a></li>
    </ul>
    <ul>
      <li><a className="fhead-link" href="/category/163-ASTROLOGY.html">ASTROLOGY</a></li>
    <li><a href="/category/1-Astrology-News.html">Astrology News</a></li>
    <li><a href="/category/166-Predictions.html">Predictions</a></li>
    <li><a href="/category/552-Daily-Predictions.html">
        Daily Predictions</a></li>
      <li><a href="/category/167-Vasthu.html">Vasthu</a></li>
    <li><a href="/category/169-Prayers.html">Prayers</a></li>
    <li><a href="/category/166-Ask-Astrologer.html">Ask Astrologer</a></li>
    <li><a href="/category/168-Gemology.html">Gemology</a></li>
    <li><a href="/category/170-others.html">others</a></li>
    </ul>
  </div>
  <div className="footer-link-list-frame">
    <ul>
      <li> <a className="fhead-link" href="/category/8061-SPECIAL-COVERAGE.html"> SPECIAL COVERAGE</a></li>
      <li> <a href="/category/8062-Investigation.html">Investigation</a></li>
  <li> <a href="/category/8063-Experience.html">Experience</a></li>
  <li> <a href="/category/8064-Voice.html">Voice</a></li>
  <li> <a href="/category/8065-Surprise.html">Surprise</a></li>
    <li> <a href="/category/1-Memoir.html">Memoir</a></li>
    <li> <a href="/category/1-Rosy-news.html">Rosy news</a></li>
  <li> <a href="/category/1-Art-and-Culture.html">Art and Culture</a></li>
    <li> <a href="/category/1-Social-Media.html">Social Media</a></li>
    <li> <a href="/category/339-Success.html">Success</a></li>
    <li> <a href="/category/1-Off-Beat.html">Off Beat</a></li>
    </ul>
  

    <ul>
      <li> <a className="fhead-link" href="/category/200-tech.html">TECH</a></li>
    <li> <a href="/category/226-Gadgets.html">Gadgets</a></li>
    <li> <a href="/category/227-Mobile.html">Mobile</a></li>
    <li> <a href="/category/228-Tech-News.html">Tech News</a></li>
  <li> <a href="/category/229-Review.html">Review</a></li>
    <li> <a href="/category/1-Science.html">Science</a></li>
    </ul>


    <ul>
    <li> <a className="fhead-link" href="/category/199-EDUCATION.html">EDUCATION</a></li>
    <li> <a href="/category/494-Educational-News.html"> Educational News</a></li>
    <li> <a href="/category/495-Career.html">Career</a></li>
    <li> <a href="/category/497-Jobs.html">Jobs</a></li>
    <li> <a href="/category/496-Announcements.html">Announcements</a></li>
    <li> <a href="/category/498-Campus-News.html">Campus News</a></li>
    </ul>
  </div>

<div className="footer-link-list-frame">
<ul>
  <li> <a className="fhead-link" href="/category/193-food.html">FOOD</a></li>
  <li> <a href="/category/1-Food-news.html">Food news</a></li>
  <li> <a href="/category/8030-Special recipe.html">Special recipe</a></li>
  </ul>
  <ul>
<li> <a className="fhead-link" href="/category/89-BUSINESS.html">BUSINESS</a></li>
  <li> <a href="/category/2466-Business-New.html">Business New</a></li>
  <li> <a href="/category/90-Stock.html">Stock</a></li>
  <li> <a href="/category/94-Banking.html">Banking</a></li>
  <li> <a href="/category/1-Focus.html">Focus</a></li>
  <li> <a href="/category/1-Money.html">Money</a></li>
</ul>
<ul>
  <li> <a className="fhead-link" href="/category/93-auto.html">AUTO</a></li>
  <li> <a className="fhead-link" href="/category/202-AGRICULTURE.html">AGRICULTURE</a></li>
  <li> <a className="fhead-link" href="/category/695-ODD-NEWS.html">ODD NEWS</a></li>
  <li> <a className="fhead-link" href="/category/5503-LITERATURE.html">LITERATURE</a></li>
<li> <a className="fhead-link" href="/category/198-RELIGION.html">RELIGION</a></li>
  <li> <a className="fhead-link" href="/category/1-MANGALAM-EXPLAINER.html">  MANGALAM EXPLAINER</a></li>
  <li> <a className="fhead-link" href="/category/99-CHARITY.html">CHARITY</a></li>
  <li> <a className="fhead-link" href="/category/627-CLASSIFIEDS.html">CLASSIFIEDS</a></li>
</ul>
</div>

<div className="footer-link-list-frame">
<ul>
  <li> <a className="fhead-link" href="/category/100-CRIME.html">CRIME</a></li>
  <li> <a className="fhead-link" href="/category/583-OPINION.html">OPINION</a></li>
  <li> <a className="fhead-link" href="/category/1-OBITUARIES.html">OBITUARIES</a></li>
  <li> <a className="fhead-link" href="/category/1-FACT-CHECK.html">FACT CHECK</a></li>
  <li> <a className="fhead-link" href="/category/98-SUNDAY-MANGALAM.html">SUNDAY MANGALAM</a></li>
  <li> <a className="fhead-link" href="/category/365-MANGALAM-ORIGNALS.html"> MANGALAM ORIGNALS</a></li>
    </ul>
    </div>

</div>
</div>

<div className="feet">
<p className="copyright">
  Mangalam Publications India Private Limited. All Rights Reserved
</p>
<div className="feet-links">
  <ul>
  <li> <a href="#">ABOUT MANGALAM</a></li>
  <li> <a href="#">TERMS &amp; CONDITIONS</a></li>
  <li> <a href="#">CONTACT US</a></li>
  <li> <a href="#">FEEDBACK &amp; COMPLAINTS</a></li>
  <li> <a href="#">DISCLAIMER</a></li>
  <li> <a href="#">RSS</a></li>
  </ul>
</div>
</div>

</footer>     

}

export default Footer;