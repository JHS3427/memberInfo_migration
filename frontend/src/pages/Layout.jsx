import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/commons/Header.jsx';
import { Footer } from '../components/commons/Footer.jsx';

export function Layout() {
    const location = useLocation();
    
    // Footer를 숨길 페이지 경로 목록
    const hideFooterPaths = ["/rental", "/travel","/signUp"];

    // 현재 경로가 hideFooterPaths 중 하나인지 확인
    const hideFooter = hideFooterPaths.some(path => location.pathname.startsWith(path));

    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>

            {/* ✅ rental, travel 페이지에서는 Footer 숨김 */}
            {!hideFooter && <Footer />}
        </>
    );
}