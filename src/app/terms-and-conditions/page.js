import Link from 'next/link';

export const revalidate = false;

export default function TermsAndConditions() {
    return (
        <div className="terms-conditions-page" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <h1 style={{ borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '30px', color: 'black' }}>Terms and Conditions</h1>

            <section className="agreement-header" style={{ marginBottom: '40px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'black', marginBottom: '15px' }}>User Agreement</h2>
                <div style={{ lineHeight: '1.6', color: '#444' }}>
                    <p style={{ marginBottom: '15px' }}>
                        WHEREAS <a href="https://www.mangalam.com" style={{ color: '#0070f3' }}>www.mangalam.com</a> is a website owned and maintained by Mangalam Publications India Private Limited, a company registered in India under the Companies Act, 1956 (Act 1 of 1956) having its registered office at S.H. Mount P.O. Kottayam 686006, Kerala State, India;
                    </p>
                    <p style={{ marginBottom: '15px' }}>
                        AND WHEREAS the website <a href="https://www.mangalam.com" style={{ color: '#0070f3' }}>www.mangalam.com</a> (hereinafter referred to as ‘the Mangalam Website’) is open for access on the internet to the general public;
                    </p>
                    <p style={{ marginBottom: '15px' }}>
                        AND WHEREAS it is necessary to specify and declare the terms and conditions by which the members of the general public may use or access the Mangalam Website;
                    </p>
                    <p>
                        <strong>NOW IT IS HEREBY PUBLICALLY DECLARED AND MADE KNOWN</strong> to all users, viewers and readers of the Mangalam Website that they shall access or use the Mangalam website, its content and all services offered through it, subject to the terms and conditions hereinafter stated. All users, viewers and readers of the Mangalam Website are deemed to have duly read and understood the same at the time of use or access of the website and are deemed to have agreed to access, use or view the Mangalam Website, strictly in accordance with the ‘terms and conditions of use’ hereinafter contained.
                    </p>
                </div>
            </section>

            <section className="terms-content">
                <h2 style={{ fontSize: '1.5rem', color: 'black', marginBottom: '20px', borderBottom: '1px solid #eee' }}>TERMS AND CONDITIONS</h2>

                <ol style={{ paddingLeft: '20px', color: '#222' }}>
                    <li style={{ marginBottom: '30px' }}>
                        <h4 style={{ fontSize: '1.1rem' }}>Copyright, Trademarks and Intellectual Property Rights</h4>
                        <ul style={{ listStyleType: 'circle', paddingLeft: '25px', marginTop: '10px', color: '#444', lineHeight: '1.6' }}>
                            <li style={{ marginBottom: '10px' }}>Unless otherwise stated, copyright and all intellectual property rights in all material presented on the site (including but not limited to text, audio, video or graphical images), trademarks and logos appearing on the Mangalam Website are the property of Mangalam Publications India Private Limited, its affiliates and associates and are protected under applicable Indian and other laws.</li>
                            <li style={{ marginBottom: '10px' }}>No person is permitted to copy, broadcast, download, store (in any medium), transmit, show or play in public, adapt or change in any way the contents of the Mangalam Website and pages for any other purpose whatsoever without the prior written permission of the Mangalam Publications India Private Limited.</li>
                            <li style={{ marginBottom: '10px' }}>Users, viewers and readers of the Mangalam Website agree not to use any framing techniques to enclose any trademark or logo or other proprietary information belonging to Mangalam Publications India Private Limited or to its affiliates and associates; or remove, conceal or obliterate any copyright or other proprietary notice or any credit-line or date-line or other mark or source identifier included on the Mangalam Website.</li>
                            <li style={{ marginBottom: '10px' }}>Unauthorised use of any material or content in the Mangalam Website shall be deemed to be a serious copyright infringement and appropriate legal proceedings both civil and criminal shall be initiated against all persons who violate the copyright and trademark rights.</li>
                        </ul>
                    </li>

                    <li style={{ marginBottom: '30px' }}>
                        <h4 style={{ fontSize: '1.1rem' }}>Permissions and Restrictions</h4>
                        <ul style={{ listStyleType: 'circle', paddingLeft: '25px', marginTop: '10px', color: '#444', lineHeight: '1.6' }}>
                            <li style={{ marginBottom: '10px' }}>Mangalam Publications India Private Limited grants the users of the Mangalam Website permission to access or use the website for personal use alone.</li>
                            <li style={{ marginBottom: '10px' }}>Users should not directly or indirectly download or print any content for copying, publishing, distributing or otherwise disseminating such content or portions thereof.</li>
                            <li style={{ marginBottom: '10px' }}>Users are not permitted to resell or put to commercial use any part of the Mangalam Website or content therein.</li>
                            <li style={{ marginBottom: '10px' }}>No part of the Mangalam Website may be reproduced, transmitted or stored in any other web site, nor may any of its pages or part thereof be disseminated in any electronic or non-electronic form without prior written permission.</li>
                            <li style={{ marginBottom: '10px' }}>No user shall use the services provided in any manner that could damage, disable, overburden, or impair any server of the Mangalam Website or network connected to such servers.</li>
                        </ul>
                    </li>

                    <li style={{ marginBottom: '30px' }}>
                        <h4 style={{ fontSize: '1.1rem' }}>Personal Information and Data Disclosure</h4>
                        <ul style={{ listStyleType: 'circle', paddingLeft: '25px', marginTop: '10px', color: '#444', lineHeight: '1.6' }}>
                            <li style={{ marginBottom: '10px' }}>Some services such as subscriptions and blogs may require registration. Registered users are entirely responsible for maintaining the confidentiality of their passwords.</li>
                            <li style={{ marginBottom: '10px' }}>Mangalam Publications India Private Limited will make every effort to keep all personal details strictly confidential and will not disclose or share information without due direction from a competent court or statutory authority.</li>
                        </ul>
                    </li>

                    <li style={{ marginBottom: '30px' }}>
                        <h4 style={{ fontSize: '1.1rem' }}>Content Posted by Users</h4>
                        <ul style={{ listStyleType: 'circle', paddingLeft: '25px', marginTop: '10px', color: '#444', lineHeight: '1.6' }}>
                            <li style={{ marginBottom: '10px' }}>Users posting material warrant that they are the copyright owner or have permission to use such material. Mangalam accepts no responsibility for content posted by users but reserves the right to remove objectionable matter.</li>
                        </ul>
                    </li>

                    <li style={{ marginBottom: '30px' }}>
                        <h4 style={{ fontSize: '1.1rem' }}>Jurisdiction</h4>
                        <ul style={{ listStyleType: 'circle', paddingLeft: '25px', marginTop: '10px', color: '#444', lineHeight: '1.6' }}>
                            <li style={{ marginBottom: '10px' }}>This Agreement shall be governed by the laws of India. The Courts of law at Kottayam District in Kerala State shall have exclusive jurisdiction to adjudicate any dispute arising relating to the use of the Mangalam Website.</li>
                        </ul>
                    </li>
                </ol>
            </section>

            <div style={{ marginTop: '40px', padding: '20px', background: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
                <Link href="/" style={{ color: 'black', fontWeight: 'bold', textDecoration: 'none' }}>← Back to Home</Link>
            </div>
        </div>
    );
}
