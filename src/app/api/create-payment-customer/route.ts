import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import paymentVerification from '@/templates/paymentVerification';

const key = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(key, {
    apiVersion: "2024-06-20",
});

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

export async function POST(req: NextRequest) {
    try {
        const { name, email, paymentMethodId, customer } = await req.json() as {
            name: string;
            email: string;
            paymentMethodId: string;
            customer: any;
        };

        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customer.id,
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000,
            currency: 'usd',
            customer: customer.id,
            payment_method: paymentMethodId,
            payment_method_types: ['card'],
            off_session: true,
            confirm: true,
        });

        await stripe.invoiceItems.create({
            customer: customer.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            description: `Payment for ${name}`,
        });

        const invoice = await stripe.invoices.create({
            customer: customer.id,
            collection_method: 'charge_automatically',
            auto_advance: true,
        });

        const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

        const mailOptions = {
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: email,
            subject: 'Payment Verification',
            html: paymentVerification(name, paymentIntent.amount / 100),
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ paymentIntent, invoice: finalizedInvoice, name, email });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
