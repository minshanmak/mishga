import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Services | MishGa',
    description: 'We offer robust business websites, custom booking platforms, and high-conversion e-commerce systems tailored perfectly to your audience.'
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
