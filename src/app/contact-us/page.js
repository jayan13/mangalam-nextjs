import Link from 'next/link';

export default function ContactUs() {
    return (
        <div className="contact-us-page" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <h1 style={{ borderBottom: '2px solid #ed1c24', paddingBottom: '10px', marginBottom: '30px', color: '#333' }}>Contact Us</h1>

            <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '40px' }}>

                {/* Left Column: General Support */}
                <div className="contact-info-column">
                    <section style={{ marginBottom: '30px' }}>
                        <h3 style={{ color: '#ed1c24', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Postal Address</h3>
                        <p style={{ lineHeight: '1.6', color: '#444' }}>
                            <strong>Mangalam Online</strong><br />
                            Mangalam Publications (I) Pvt. Ltd.<br />
                            Mangalam Complex, S.H.Mount P.O., Kottayam,<br />
                            Kerala, India - 686 006<br />
                            <strong>Phone:</strong> <a href="tel:+919895090294">+91 9895090294</a><br />
                            <strong>Fax:</strong> 91-0481- 2563508
                        </p>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h3 style={{ color: '#ed1c24', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Customer Support</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                            Monday to Saturday (Except Public Holidays)<br />
                            09:00 AM to 06:00 PM IST
                        </p>
                        <p style={{ lineHeight: '1.6', color: '#444' }}>
                            <strong>Phone:</strong> <a href="tel:+919895010184">+91 98950 10184</a><br />
                            <strong>Fax:</strong> 91-0481- 2563508<br />
                            <strong>Email:</strong> <a href="mailto:mail@mangalam.com">mail@mangalam.com</a>
                        </p>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h3 style={{ color: '#ed1c24', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Content Support</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                            Monday to Saturday (Except Public Holidays)<br />
                            09:00 AM to 06:00 PM IST
                        </p>
                        <p style={{ lineHeight: '1.6', color: '#444' }}>
                            <strong>Head - mangalam.com:</strong> <a href="tel:+9104812563024">91-0481 2563024</a><br />
                            <strong>Email:</strong> <a href="mailto:ajith@mangalam.com">ajith@mangalam.com</a> / <a href="mailto:mangalam.com@gmail.com">mangalam.com@gmail.com</a>
                        </p>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h3 style={{ color: '#ed1c24', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Advertisements</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                            09:00 AM to 06:00 PM IST
                        </p>
                        <p style={{ lineHeight: '1.6', color: '#444' }}>
                            <strong>Sr. Manager - Web Sales:</strong> <a href="tel:+919895091056">+91 9895 091 056</a><br />
                            <strong>Email:</strong> <a href="mailto:mangalam.com@gmail.com">mangalam.com@gmail.com</a>
                        </p>
                    </section>
                </div>

                {/* Right Column: Regional Advertising Offices */}
                <div className="regional-offices-column">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333', textAlign: 'center', background: '#f5f5f5', padding: '10px' }}>REGIONAL ADVERTISING OFFICES</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <section>
                            <h4 style={{ margin: '10px 0 5px', color: '#ed1c24' }}>KOTTAYAM</h4>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>Mangalam Buildings, S.H. Mount P.O.<br />Ph: +91 9895090294</p>
                        </section>

                        <section>
                            <h4 style={{ margin: '10px 0 5px', color: '#ed1c24' }}>THIRUVANANTHAPURAM</h4>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>Opp. Keerthi Hotel, Thampanoor<br />Ph: 0471 2328417</p>
                        </section>

                        <section>
                            <h4 style={{ margin: '10px 0 5px', color: '#ed1c24' }}>ERNAKULAM</h4>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>Anjiparambil Complex, Ramankutty Achan Road<br />Ph: 0484 2352250</p>
                        </section>

                        <section>
                            <h4 style={{ margin: '10px 0 5px', color: '#ed1c24' }}>THRISSUR</h4>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>City Lodge Buildings, T.B Road<br />Ph: 0487 2445472</p>
                        </section>

                        <section>
                            <h4 style={{ margin: '10px 0 5px', color: '#ed1c24' }}>PALAKKAD</h4>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>Opp. Town Bus Stand<br />Ph: 0491 2500007</p>
                        </section>

                        <section>
                            <h4 style={{ margin: '10px 0 5px', color: '#ed1c24' }}>KOZHIKODE</h4>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>Kallai, Kozhikode - 673 003<br />Ph: +91 8129 310937</p>
                        </section>

                        <section>
                            <h4 style={{ margin: '10px 0 5px', color: '#ed1c24' }}>MANGALURU</h4>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>Saman Arcade, Old Kent Road<br />Ph: 09448 437654</p>
                        </section>

                        <section>
                            <h4 style={{ margin: '10px 0 5px', color: '#ed1c24' }}>DELHI</h4>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>2/1 2nd Floor, I.N.S. Building, Rafi Marg<br />Ph: 011 23716218</p>
                        </section>

                        <section>
                            <h4 style={{ margin: '10px 0 5px', color: '#ed1c24' }}>MUMBAI</h4>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>112 Hind Rajasthan Bldg, Dadar (E)<br />Ph: 9892644791</p>
                        </section>

                        <section>
                            <h4 style={{ margin: '10px 0 5px', color: '#ed1c24' }}>CHENNAI</h4>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>Parson Manor, 602 Mount Road<br />Ph: 044 28251432</p>
                        </section>

                        <section>
                            <h4 style={{ margin: '10px 0 5px', color: '#ed1c24' }}>BENGALURU</h4>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>No. 21, Shankarappa Garden, Magadi Road<br />Ph: 080 3359704</p>
                        </section>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
                <Link href="/" style={{ color: '#ed1c24', fontWeight: 'bold', textDecoration: 'none' }}>← Back to Home</Link>
            </div>
        </div>
    );
}
