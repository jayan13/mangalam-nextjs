import Link from 'next/link';
import Image from "next/image";

function Footer() {

  return <footer className="footer no-printme">
    <div className="footer-top">
      <div className="footer-container">
        <div className="footer-logo">
          <a href="/"><Image className="container-26" src="/img/container.svg" alt="logo" width={353} height={73} /></a>
        </div>

        <div className="footer-header-top">
          <div className="footer-social">
            <ul>
              <li><a href="#"><Image src="/img/icons/fb-logo.svg" width={33} height={33} alt="facebook" /></a></li>
              <li><a href="#"><Image src="/img/icons/in-logo.svg" width={33} height={33} alt="linged" /></a></li>
              <li><a href="#"><Image src="/img/icons/instagram-logo.svg" width={33} height={33} alt="insta" /></a></li>
              <li><a href="#"><Image src="/img/icons/x-logo.svg" width={33} height={33} alt="twitter" /></a></li>
            </ul>
          </div>
          <div className="app-download">
            <a href="#"><Image src="/img/icons/app-download.svg" width={365} height={66} alt="mangalam app" /></a>
          </div>
        </div>
      </div>
    </div>


    <div className="footer-bottom">
      <div className="footer-link-list">
        <div className="footer-link-list-frame">
          <ul>
            <li><a className="fhead-link" href="/category/16-latest-news.html">LATEST NEWS</a></li>
            <li><a className="fhead-link" href="/category/20-india.html">INDIA</a></li>
            <li><a className="fhead-link" href="/category/21-international.html">INTERNATIONAL</a></li>
            <li><a className="fhead-link" href="/district">LOCAL NEWS</a></li>
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
            <li><a className="fhead-link" href="/category/15-cinema.html">ENTERTINMENT</a></li>
            <li><a href="/category/39-latest-news.html">Movie news</a></li>
            <li><a href="/category/45-chit-chat.html">Chit Chat</a></li>
            <li><a href="/category/40-movie-reviews.html">Reviews</a></li>
            <li><a href="/category/47-interviews.html">Interview</a></li>
            <li><a href="/category/1336-celebrity.html">Celebrity</a></li>
            <li><a href="/category/8123-music.html">Music</a></li>
            <li><a href="/category/48-mini-screen.html">Miniscreen</a></li>
            <li><a href="/category/8167-ott.html">OTT</a></li>
            <li><a href="/category/264-local-features.html">Features</a></li>
          </ul>

          <ul>
            <li><a className="fhead-link" href="/category/23-sports.html">SPORTS</a></li>
            <li><a href="/category/67-sports-news.html">Sports News</a></li>
            <li><a href="/category/69-specials.html">Sports Specials</a></li>
          </ul>

          <ul>
            <li><a className="fhead-link" href="/category/201-life-style.html">LIFE</a></li>
            <li><a href="/category/337-life-style.html">Life Style</a></li>
            <li><a href="/category/108-women.html">Women</a></li>
            <li><a href="/category/338-fashion.html">Fashion</a></li>
            <li><a href="/category/113-parenting.html">Parenting</a></li>
            <li><a href="/category/111-beauty.html">Beauty</a></li>
            <li><a href="/category/8168-spirituality.html">Spirituality</a></li>
            <li><a href="/category/8169-home-style.html">Home style</a></li>
            <li><a href="/category/340-travel.html">Travel</a></li>
            <li><a href="/category/8066-environment.html">Environment</a></li>
            <li><a href="/category/1338-Relations.html">Relations</a></li>
          </ul>
        </div>

        <div className="footer-link-list-frame">
          <ul>
            <li><a className="fhead-link" href="/category/186-health.html"> HEALTH</a></li>
            <li><a href="/category/187-health-news.html">Health News</a></li>
            <li><a href="/category/188-fitness-yoga.html">Fitness/ Yoga</a></li>
            <li><a href="/category/191-ayurveda.html">Ayurveda</a></li>
            <li><a href="/category/193-food-habits.html">
              Healthy food and Nutrition</a></li>
            <li><a href="/category/443-ask-doctor.html">Ask Doctor</a></li>
            <li><a href="/category/190-intimacy.html">Intimacy</a></li>
          </ul>
          <ul>
            <li><a className="fhead-link" href="/category/17-pravasi.html">PRAVASI</a></li>
            <li><a href="/category/101-gulf.html">Gulf</a></li>
            <li><a href="/category/102-europe.html">Europe</a></li>
            <li><a href="/category/103-america.html">America</a></li>
            <li><a href="/category/104-australia.html">Australia</a></li>
            <li><a href="/category/105-others.html">Others</a></li>
            <li><a href="/category/106-pravasi-special.html">Pravasi Special</a></li>
            <li><a href="/category/411-pravasi-rachana.html">Pravasi Rachana</a></li>
          </ul>
          <ul>
            <li><a className="fhead-link" href="/category/163-astrology.html">ASTROLOGY</a></li>
            <li><a href="/category/164-news.html">Astrology News</a></li>
            <li><a href="/category/165-predictions.html">Predictions</a></li>
            <li><a href="/category/552-daily-prediction.html">
              Daily Predictions</a></li>
            <li><a href="/category/167-vasthu.html">Vasthu</a></li>
            <li><a href="/category/169-prayers.html">Prayers</a></li>
            <li><a href="/category/166-ask-astrologer.html">Ask Astrologer</a></li>
            <li><a href="/category/168-gemology.html">Gemology</a></li>
            <li><a href="/category/170-others.html">others</a></li>
          </ul>
        </div>
        <div className="footer-link-list-frame">
          <ul>
            <li> <a className="fhead-link" href="/category/8061-special-coverage.html"> SPECIAL COVERAGE</a></li>
            <li> <a href="/category/8062-investigation.html">Investigation</a></li>
            <li> <a href="/category/8063-experience.html">Experience</a></li>
            <li> <a href="/category/8064-voices.html">Voice</a></li>
            <li> <a href="/category/8065-surprise.html">Surprise</a></li>
            <li> <a href="/category/8069-memoir.html">Memoir</a></li>
            <li> <a href="/category/8071-rosy-news.html">Rosy news</a></li>
            <li> <a href="/category/8127-art--culture.html">Art and Culture</a></li>
            <li> <a href="/category/8158-social-media.html">Social Media</a></li>
            <li> <a href="/category/339-success.html">Success</a></li>
            <li> <a href="/category/8171-off-beat.html">Off Beat</a></li>
          </ul>


          <ul>
            <li> <a className="fhead-link" href="/category/200-tech.html">TECH</a></li>
            <li> <a href="/category/226-gadgets.html">Gadgets</a></li>
            <li> <a href="/category/227-mobile.html">Mobile</a></li>
            <li> <a href="/category/228-tech-news.html">Tech News</a></li>
            <li> <a href="/category/229-review.html">Review</a></li>
            <li> <a href="/category/8170-science.html">Science</a></li>
          </ul>


          <ul>
            <li> <a className="fhead-link" href="/category/199-education.html">EDUCATION</a></li>
            <li> <a href="/category/494-educational-news.html"> Educational News</a></li>
            <li> <a href="/category/495-career-planner.html">Career</a></li>
            <li> <a href="/category/497-jobs-and-career.html">Jobs</a></li>
            <li> <a href="/category/496-announcements.html">Announcements</a></li>
            <li> <a href="/category/498-campus-news.html">Campus News</a></li>
          </ul>
        </div>

        <div className="footer-link-list-frame">
          <ul>
            <li> <a className="fhead-link" href="/category/193-food-habits.html">FOOD</a></li>
            <li> <a href="/category/193-food-habits.html">Food news</a></li>
            <li> <a href="/category/8030-special-recipes.html">Special recipe</a></li>
          </ul>
          <ul>
            <li> <a className="fhead-link" href="/category/89-business.html">BUSINESS</a></li>
            <li> <a href="/category/91-business-news.html">Business New</a></li>
            <li> <a href="/category/90-stock.html">Stock</a></li>
            <li> <a href="/category/94-banking.html">Banking</a></li>
            <li> <a href="/category/8076-focus.html">Focus</a></li>
            <li> <a href="/category/8172-money.html">Money</a></li>
          </ul>
          <ul>
            <li> <a className="fhead-link" href="/category/93-auto.html">AUTO</a></li>
            <li> <a className="fhead-link" href="/category/202-agriculture.html">AGRICULTURE</a></li>
            <li> <a className="fhead-link" href="/category/695-odd-news.html">ODD NEWS</a></li>
            <li> <a className="fhead-link" href="/category/8078-literature.html">LITERATURE</a></li>
            <li> <a className="fhead-link" href="/category/198-religion.html">RELIGION</a></li>
            <li> <a className="fhead-link" href="/category/8166-explainer.html">  MANGALAM EXPLAINER</a></li>
            <li> <a className="fhead-link" href="/category/99-charity.html">CHARITY</a></li>
            <li> <a className="fhead-link" href="/category/627-classifieds.html">CLASSIFIEDS</a></li>
          </ul>
        </div>

        <div className="footer-link-list-frame">
          <ul>
            <li> <a className="fhead-link" href="/category/100-crime.html">CRIME</a></li>
            <li> <a className="fhead-link" href="/category/583-opinion.html">OPINION</a></li>
            <li> <a className="fhead-link" href="/category/8165-obituaries.html">OBITUARIES</a></li>
            <li> <a className="fhead-link" href="/category/8145-fact-check.html">FACT CHECK</a></li>
            <li> <a className="fhead-link" href="/category/98-sunday-mangalam.html">SUNDAY MANGALAM</a></li>
            <li> <a className="fhead-link" href="/category/365-mangalam-varika.html"> MANGALAM ORIGNALS</a></li>
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
          <li> <a href="/about-mangalam">ABOUT MANGALAM</a></li>
          <li> <a href="/terms-and-conditions">TERMS &amp; CONDITIONS</a></li>
          <li> <a href="/contact-us">CONTACT US</a></li>
          <li> <a href="/feedback-and-complaints">FEEDBACK & COMPLAINTS</a></li>
          <li> <a href="/disclaimer">DISCLAIMER</a></li>
          <li> <a href="/api/rss">RSS</a></li>
        </ul>
      </div>
    </div>

  </footer>

}

export default Footer; 
