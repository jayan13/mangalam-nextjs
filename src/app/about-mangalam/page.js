import Link from 'next/link';

export const revalidate = false;

export default function AboutMangalam() {
    return (
        <div className="about-mangalam-page" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <h1 style={{ borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '30px', color: 'black' }}>About Mangalam</h1>

            <section className="content-section" style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'black', marginBottom: '15px' }}>OWNERSHIP</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#444' }}>
                    <a href="https://www.mangalam.com" style={{ color: '#0070f3' }}>https://www.mangalam.com</a> and <a href="http://mangalam.com" style={{ color: '#0070f3' }}>http://mangalam.com</a> are owned and maintained by Mangalam Publications India Private Limited, a company registered in India under the Companies Act, 1956 (Act 1 of 1956) having its registered office at S.H. Mount P.O. Kottayam 686006, Kerala State, India
                </p>
            </section>

            <section className="content-section" style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'black', marginBottom: '15px' }}>GROUP PROFILE</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#444', marginBottom: '15px' }}>
                    Established in April 1969 by <strong style={{ color: 'black' }}>Mr. M. C. Varghese</strong>, an extraordinary visionary with social commitment and dedication. The Mangalam Group initiated the project of publishing a weekly magazine that would quench the thirst of an average Malayalee reader. The success of Malayalam Weekly marked the dawn of an era in the publishing sector of Kerala, rewriting the publishing history in Asia (circulation of 1.5 million in 1984) and established a well-reputed household name Mangalam in India.
                </p>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#444', marginBottom: '15px' }}>
                    Mangalam group of publications at present brings out Mangalam morning daily with Seven editions from Kottayam, Kochi, Calicut, Trivandurm, Idukki, Kannur and Trissur, Manglam Weekly, Kanyaka a women’s fortnightly, Arogya Manglam a health magazine, Balamangalam, Chithrakatha and Kalicheppu children’s magazines, Cinema Managlam a film weekly, Jyothisha Bhooshanam, an astrological fortnightly in Malayalam and Mangala, Balamangala, Gulivindu, Jyothisha Mangala in Kannada language.
                </p>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#444', marginBottom: '15px' }}>
                    Mangalam Weekly which took Malayalam language and literature to the door steps of common people in Kerala with its popular writings has played the main role in achieving 100 percent literacy in the state.
                </p>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#444', marginBottom: '15px' }}>
                    Today the Mangalam Group of Companies enjoys a comfortable spacing in one of the India’s largest media houses. The pioneering vision and academic activities of Mangalam led to the emergence of a number of educational institutions in the higher education sector of Kerala, giving more options for higher studies and research in Engineering, Management Studies, teaching and international studies.
                </p>
            </section>

            <section className="content-section" style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'black', marginBottom: '15px' }}>FOUNDER CHAIRMAN</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#444' }}>
                    The Mangalam Group was founded by late <strong style={{ color: 'black' }}>Mr. M.C Varghese</strong>, a prodigious person with divine vision of the future and keen sense of understanding, very compassionate and more concerned about his fellow beings.
                </p>
            </section>

            <section className="content-section" style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'black', marginBottom: '15px' }}>LOCATION</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#444', marginBottom: '15px' }}>
                    The registered office of the Mangalam Group of Concerns is located at Mangalam building, S.H.Mount, Kottayam , Kerala, India -686 006
                </p>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#444', marginBottom: '10px' }}>
                    The Mangalam Group of Concerns consists of four major establishments incorporated under the Indian Companies Act. They are as follows:
                </p>
                <ul style={{ paddingLeft: '20px', color: '#444', lineHeight: '1.8' }}>
                    <li>Mangalam Publications (India) Pvt.Ltd</li>
                    <li>Mangalam Web media Pvt. Ltd.</li>
                    <li>Mangalam Homes & Resorts Pvt.Ltd</li>
                    <li>Mangalam Hospitals Pvt. Ltd and</li>
                    <li>Mangalam Confectionery Pvt. Ltd.</li>
                </ul>
            </section>

            <div style={{ marginTop: '40px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
                <Link href="/" style={{ color: 'black', fontWeight: 'bold' }}>← Back to Home</Link>
            </div>
        </div>
    );
}
