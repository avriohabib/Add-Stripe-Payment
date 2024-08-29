import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(key, {
    apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
    try {
        const { name, email, paymentMethodId } = await req.json() as {
            name: string;
            email: string;
            paymentMethodId: string;
        };

        const customer = await stripe.customers.create({
            name,
            email,
            payment_method: paymentMethodId,
        });

        return NextResponse.json({ customer });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
