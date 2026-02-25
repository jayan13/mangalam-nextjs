import Link from 'next/link';

export default function Disclaimer() {
    return (
        <div className="disclaimer-page" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <h1 style={{ borderBottom: '2px solid #ed1c24', paddingBottom: '10px', marginBottom: '30px', color: '#333' }}>Disclaimer</h1>

            <section className="disclaimer-content" style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#444', textAlign: 'center' }}>
                    Mangalam Publications India Private Limited is not responsible for the contents of external internet sites, links to which may be found on this webpage or website.
                </p>
            </section>

            <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
                <Link href="/" style={{ color: '#ed1c24', fontWeight: 'bold', textDecoration: 'none' }}>← Back to Home</Link>
            </div>
        </div>
    );
}
