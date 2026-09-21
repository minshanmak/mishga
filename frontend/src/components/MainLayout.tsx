import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
            <a className="back-top" href="#home" aria-label="Back to top">
                <i className="fa-solid fa-arrow-up"></i>
            </a>
        </>
    );
}
