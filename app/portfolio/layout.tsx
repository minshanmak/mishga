import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Selected Work | MishGa',
    description: 'Explore the MishGa project portfolio. See how we transform strategic challenges into beautiful, high-performance web solutions.'
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
    return children;
}
