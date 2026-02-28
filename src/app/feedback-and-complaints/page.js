import FeedbackForm from './FeedbackForm';

export const revalidate = false;

export default function FeedbackAndComplaints() {
    return (
        <div className="feedback-page" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'var(--font-noto-sans-malayalam), sans-serif' }}>
            <h1 style={{ borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '30px', color: 'black', textAlign: 'center' }}>Feedback and Complaints</h1>

            <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
                We value your feedback. Please use the form below to reach out to us with your comments, suggestions, or complaints.
            </p>

            <FeedbackForm />
        </div>
    );
}
