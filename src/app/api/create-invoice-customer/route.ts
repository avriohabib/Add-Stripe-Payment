import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(key, {
    apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
    try {
        const { amount, currency, customer, description }: any = await req.json() as {
            amount: number;
            currency: string;
            customer: any;
            description: string; 
        };
        // Create an invoice item
        const invoiceItem = await stripe.invoiceItems.create({
            customer: customer.id,
            amount,
            currency,
            description,
        });

        // Create the invoice
        const invoice = await stripe.invoices.create({
            customer: customer.id,
            collection_method: 'charge_automatically',
        });

        // Finalize the invoice
        await stripe.invoices.finalizeInvoice(invoice.id);

        return NextResponse.json({ success: true, invoice });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
