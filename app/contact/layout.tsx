import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | MishGa',
    description: 'Start a conversation with MishGa. Get in touch to discuss your next digital product, website build, or custom platform.'
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
