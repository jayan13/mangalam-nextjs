
'use client';

import { useState, useEffect } from 'react';

export default function AdsManager() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [adsContent, setAdsContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/ads');
            // If unauthorized, api returns 401
            if (res.status === 200) {
                setIsAuthenticated(true);
                const data = await res.json();
                setAdsContent(data.content);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth check failed', error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                setIsAuthenticated(true);
                checkAuth();
                setMessage('');
            } else {
                setMessage('Invalid credentials');
            }
        } catch (error) {
            setMessage('Login failed');
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setIsAuthenticated(false);
            setUsername('');
            setPassword('');
            setMessage('Logged out successfully');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch('/api/ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: adsContent }),
            });

            if (res.ok) {
                setMessage('Ads.txt updated successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Failed to update');
            }
        } catch (error) {
            setMessage('Update error');
        }
    };

    if (loading) return <div className="p-4 text-center">Loading...</div>;


    return (
        <div className="home-news-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>

            {!isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, width: '100%' }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', width: '24rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Login</h2>
                        {message && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.5rem', marginBottom: '1rem', borderRadius: '0.25rem', textAlign: 'center' }}>{message}</div>}
                        <form onSubmit={handleLogin}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Username</label>
                                <input
                                    type="text"
                                    style={{ width: '100%', border: '1px solid #e5e7eb', padding: '0.5rem', borderRadius: '0.25rem' }}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Password</label>
                                <input
                                    type="password"
                                    style={{ width: '100%', border: '1px solid #e5e7eb', padding: '0.5rem', borderRadius: '0.25rem' }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.5rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Ads.txt Manager</h1>
                        <button
                            onClick={handleLogout}
                            style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                        >
                            Log Out
                        </button>
                    </div>

                    {message && <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.25rem', width: '100%', textAlign: 'center' }}>{message}</div>}

                    <textarea
                        style={{
                            width: '900px',
                            height: '500px',
                            border: '1px solid #d1d5db',
                            padding: '1rem',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            borderRadius: '0.25rem',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }}
                        value={adsContent}
                        onChange={(e) => setAdsContent(e.target.value)}
                        placeholder="Paste your ads.txt content here..."
                    />

                    <button
                        onClick={handleUpdate}
                        style={{
                            marginTop: '1.5rem',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            padding: '0.75rem 2rem',
                            borderRadius: '0.25rem',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        Update ads.txt
                    </button>
                </div>
            )}
        </div>
    );
}
