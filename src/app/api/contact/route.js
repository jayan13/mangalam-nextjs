import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const { name, email, phone, location, query } = await request.json();

        // Basic validation
        if (!name || !email || !query) {
            return NextResponse.json(
                { message: 'Name, Email, and Query are required fields.' },
                { status: 400 }
            );
        }

        // Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER,
            port: parseInt(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New Feedback/Complaint from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Phone: ${phone || 'N/A'}
                Location: ${location || 'N/A'}
                
                Query:
                ${query}
            `,
            html: `
                <h2>New Feedback/Complaint Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                <p><strong>Location:</strong> ${location || 'N/A'}</p>
                <br>
                <p><strong>Query:</strong></p>
                <p>${query.replace(/\n/g, '<br>')}</p>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: 'Your message has been sent successfully!' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json(
            { message: 'Failed to send message. Please try again later.' },
            { status: 500 }
        );
    }
}
