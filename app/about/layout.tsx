import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About | MishGa',
    description: 'Learn about MishGa, the premier digital agency accelerating brands through purposeful design and flawless engineering.'
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
