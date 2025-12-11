import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from './pages/Layout.jsx';
import { Home } from './pages/Home.jsx';
import { Travel } from './pages/travel/Travel.jsx';
import Rental from './pages/Rental.jsx';
import { Support } from './pages/Support.jsx';
import { Login } from './pages/Login.jsx';
import { Auth } from './pages/Auth.jsx';
import { SignUp2 } from './pages/SignUp2.jsx';
import { MyPage2 } from './pages/MyPage2.jsx';
import { IdPwSearch } from './pages/IdPwSearch.jsx';
import { Terms } from './pages/policies/Terms.jsx';
import { Privacy } from './pages/policies/Privacy.jsx';
import { InternalPolicy } from './pages/policies/InternalPolicy.jsx';
import { ScrollToTop } from "./components/commons/ScrollToTop.jsx";
import { Products } from "./pages/Products.jsx";
import { ProductDetail } from "./pages/ProductDetail.jsx";
import { Board } from "./pages/Board.jsx";
import { BoardDetail } from "./pages/board/BoardDetail.jsx";
import { BoardWrite } from "./pages/board/BoardWrite.jsx";
import { AuthProvider } from "./feature/auth/authContext.js";

import './styles/commons.css';
import './styles/travel.css';
import './styles/rental.css';

import { StoreLocation } from "./pages/StoreLocation.jsx";
import { Cart } from "./pages/Cart.jsx";
import { ComparedProduct } from "./pages/ComparedProduct.jsx";
import { CheckoutInfo } from "./pages/CheckoutInfo.jsx";

import { useEffect } from 'react';
import { createCsrfToken } from './feature/csrf/manageCsrfToken.js';
import { SuccessPage } from "./pages/SuccessPage.jsx";
import { FailPage } from "./pages/FailPage.jsx";
import {RentalPaymentResults} from "./components/rental/RentalPaymentResult.jsx";
import {OrderList} from "./pages/OrderList.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.js";

export default function App() {

    useEffect(() => {
        createCsrfToken();
    }, []);

    return (
        <AuthProvider>
            <BrowserRouter>
                <ScrollToTop />
                <Routes>

                    {/* 레이아웃 공통 */}
                    <Route path="/" element={<Layout />}>

                        {/* 홈 */}
                        <Route index element={<Home />} />

                        {/* 주요 메뉴 */}
                        <Route path="rental" element={<Rental />} />
                        <Route path="travel" element={<Travel />} />

                        {/* 대여(rental)결제 결과 */}
                        <Route path="/payment/complete" element={<RentalPaymentResults />} />

                        {/* Support (고객센터) */}
                        <Route path="support">
                            <Route index element={<Navigate to="faq" />} />
                            <Route path=":tab" element={<Support />} />     {/* faq | asinfo | resources */}
                        </Route>

                        {/* Auth */}
                        <Route path="login" element={<Login />} />
                        <Route path="auth" element={<Auth />} />
                        <Route path="signUp" element={<SignUp2 />} />
                        <Route path="socialsignUp" element={<SignUp2 excludeItems={['social']} />} />
                        <Route path="mypage" element={
                            <ProtectedRoute>
                                <MyPage2 />
                            </ProtectedRoute>} />
                        <Route path="IdPwSearch" element={<IdPwSearch />} />

                        {/* Policy */}
                        <Route path="policies/terms" element={<Terms />} />
                        <Route path="policies/privacy" element={<Privacy />} />
                        <Route path="policies/internalpolicy" element={<InternalPolicy />} />

                        {/* Product */}
                        <Route path="products/:category" element={<Products />} />
                        <Route path="products/:category/:pid" element={<ProductDetail />} />
                        <Route path="location" element={<StoreLocation/>}/>
                        <Route path="cart" element={
                            <ProtectedRoute>
                                <Cart/>
                            </ProtectedRoute>}/>
                        <Route path="compare" element={<ComparedProduct/>}/>
                        <Route path="checkout" element={
                            <ProtectedRoute>
                                <CheckoutInfo/>
                            </ProtectedRoute>}/>
                        <Route path="checkout/success" element={
                            <ProtectedRoute>
                                <SuccessPage/>
                            </ProtectedRoute>}/>
                        <Route path="checkout/fail" element={
                            <ProtectedRoute>
                                <FailPage/>
                            </ProtectedRoute>}/>
                        <Route path="payment/order" element={
                            <ProtectedRoute>
                                <OrderList/>
                            </ProtectedRoute>}/>

                        {/* Board (게시판) */}
                        <Route path="board">
                            <Route index element={<Navigate to="news" />} />
                            <Route path=":category" element={<Board />} />        {/* news | event | review */}
                            <Route path="detail/:pid" element={<BoardDetail />} />
                            <Route path="write/:category" element={<BoardWrite />} />
                            <Route path="edit/:pid" element={<BoardWrite />} />
                        </Route>

                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}