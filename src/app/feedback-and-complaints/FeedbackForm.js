'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FeedbackForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        query: ''
    });

    const [status, setStatus] = useState({
        submitting: false,
        success: false,
        error: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ submitting: true, success: false, error: null });

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus({ submitting: false, success: true, error: null });
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    location: '',
                    query: ''
                });
            } else {
                throw new Error(result.message || 'Something went wrong');
            }
        } catch (error) {
            setStatus({ submitting: false, success: false, error: error.message });
        }
    };

    return (
        <>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #eee' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                            placeholder="Your Full Name"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                placeholder="Your Phone Number"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="location" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                            placeholder="City, State"
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label htmlFor="query" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>Query / Message *</label>
                        <textarea
                            id="query"
                            name="query"
                            value={formData.query}
                            onChange={handleChange}
                            required
                            rows="5"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', resize: 'vertical' }}
                            placeholder="How can we help you?"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={status.submitting}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: status.submitting ? '#ccc' : 'black',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: status.submitting ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.3s ease'
                        }}
                    >
                        {status.submitting ? 'Sending...' : 'Submit Feedback'}
                    </button>

                    {status.success && (
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', textAlign: 'center', border: '1px solid #c3e6cb' }}>
                            Thank you! Your feedback has been sent successfully.
                        </div>
                    )}

                    {status.error && (
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '8px', textAlign: 'center', border: '1px solid #f5c6cb' }}>
                            {status.error}
                        </div>
                    )}
                </form>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <Link href="/" style={{ color: 'black', fontWeight: 'bold', textDecoration: 'none' }}>
                    ← Back to Home
                </Link>
            </div>

            <style jsx>{`
                button:hover:not(:disabled) {
                    background-color: #333 !important;
                }
                @media (max-width: 600px) {
                    div[style*="display: grid"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </>
    );
}
