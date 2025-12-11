import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaHeadset, FaUser, FaBars, FaTimes, FaCartArrowDown, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { Chatbot } from "../../pages/support/Chatbot.jsx";
import { getLogout } from "../../feature/auth/authAPI";
import "../../styles/purchaseheader.css";
import { useDispatch , useSelector } from 'react-redux';
import Swal from "sweetalert2";

/**
 * Header 컴포넌트
 *
 * 주요 기능:
 * - PC / 모바일 반응형 헤더 메뉴
 * - '자전거 구매' 카테고리의 서브메뉴 (PC hover, 모바일 toggle)
 * - 로그인 상태에 따른 UI 렌더링
 * - 챗봇 버튼 토글
 * - 스크롤 영역 DIM 처리 (모바일)
 */
export function Header() {
    const [menuOpen, setMenuOpen] = useState(false); // 모바일 전체 메뉴 오픈 여부
    const [purchaseMenuOpen, setPurchaseMenuOpen] = useState(false); // 구매 서브 메뉴 열림 여부
    const [purchaseActive, setPurchaseActive] = useState(false); // 현재 URL이 구매 메뉴 관련인지 표시
    const [showChatbot, setShowChatbot] = useState(false); // 챗봇 토글
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767); // 반응형 기준
    const [closing, setClosing] = useState(false); // 모바일 메뉴 닫힘 애니메이션 제어

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // store에서 로그인 상태 가져옴
    const isLogin = useSelector((state) => state.auth.isLogin);

    /**
     * 화면 크기 변경 감지
     * 모바일 여부가 변경 되면 UI가 즉시 반응
     */
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

        /**
         * 현재 URL이 '자전거 구매' 관련 페이지인지 체크하여 active 표시
         */
        useEffect(() => {
            const path = location.pathname;
            if (path.startsWith("/products/") || path.startsWith("/compare")) {
                setPurchaseActive(true);
            } else {
                setPurchaseActive(false);
            }
        }, [location.pathname]);

        /**
         * [PC 전용] 자전거 구매 hover → 서브메뉴 열림
         */
        const handleMouseEnterPurchase = () => {
            if (!isMobile) setPurchaseMenuOpen(true);
        };

        /**
         * [PC 전용] 헤더 영역에서 마우스 떠나면 서브메뉴 닫기
         */
        const handleMouseLeaveHeader = () => {
            if (!isMobile) setPurchaseMenuOpen(false);
        };

        /**
         * [PC 전용] 다른 메뉴 hover 시 구매 메뉴 닫기
         */
        const handleMouseEnterOther = () => {
            if (!isMobile) setPurchaseMenuOpen(false);
        };

        /**
         * [모바일 전용] 구매 메뉴 클릭 → Toggle
         */
        const handleMobilePurchaseClick = () => {
            if (isMobile) setPurchaseMenuOpen((prev) => !prev);
        };

        /**
         * 모바일 전체 메뉴 닫기 (+ fade-out 애니메이션)
         */
        const closeMobileMenu = () => {
            if (!isMobile) return;

            setClosing(true);
            setTimeout(() => {
                setMenuOpen(false);
                setPurchaseMenuOpen(false);
                setClosing(false);
            }, 300);
        };

        /**
         * 장바구니 접근 시 로그인 필요
         */
        const handleCartClick = (e) => {
            if (!isLogin) {
                e.preventDefault();
                Swal.fire({
                    icon: "warning",
                    title: "로그인 필요",
                    text: "로그인이 필요합니다.",
                });
                navigate("/login");
            }
        };

        return (
            <>
                <header className="header" onMouseLeave={handleMouseLeaveHeader}>

                    {/* 로고 */}
                    <div className="header-left">
                        <Link to="/" className="logo">Bicycle-App</Link>
                    </div>

                    {/* 중앙 메뉴 (PC + 모바일 공통) */}
                    <nav
                        className={`header-center ${menuOpen ? (closing ? "closing" : "open") : ""}`}
                    >
                        <ul>

                            {/* 자전거 구매 메뉴 */}
                            <li onMouseEnter={handleMouseEnterPurchase}
                                onClick={handleMobilePurchaseClick}>
              
              <span className={`menu-item ${purchaseActive ? "active" : ""}`}>
                자전거 구매
                  {isMobile && (
                      <span className="toggle-arrow">
                    {purchaseMenuOpen ? " ▲" : " ▼"}
                  </span>
                  )}
              </span>

                                {/* 모바일 서브 메뉴 */}
                                {isMobile && purchaseMenuOpen && (
                                    <ul className="mobile-submenu">
                                        <li><Link to="/products/mountain" onClick={closeMobileMenu}>산악</Link></li>
                                        <li><Link to="/products/road" onClick={closeMobileMenu}>로드</Link></li>
                                        <li><Link to="/products/lifestyle" onClick={closeMobileMenu}>라이프스타일</Link></li>
                                        <li><Link to="/products/electric" onClick={closeMobileMenu}>전기</Link></li>
                                        <li><Link to="/compare" onClick={closeMobileMenu}>비교하기</Link></li>
                                    </ul>
                                )}
                            </li>

                            {/* 자전거 대여 */}
                            <li onMouseEnter={handleMouseEnterOther}>
                                <NavLink to="/rental" onClick={closeMobileMenu}>
                                    자전거 대여
                                </NavLink>
                            </li>

                            {/* 여행지 추천 */}
                            <li onMouseEnter={handleMouseEnterOther}>
                                <NavLink to="/travel" onClick={closeMobileMenu}>
                                    여행지 추천
                                </NavLink>
                            </li>
                        </ul>
                    </nav>

                    {/* 우측 아이콘 메뉴 */}
                    <div className="header-right">

                        {/* 장바구니 */}
                        <NavLink to="/cart" className="icon-link" onClick={handleCartClick}>
                            <FaCartArrowDown className="icon"/>
                        </NavLink>

                        {/* 고객센터 */}
                        <NavLink to="/support" className="icon-link">
                            <FaHeadset className="icon"/>
                        </NavLink>

                        {/* 챗봇 Toggle */}
                        <Link
                            to="#"
                            className={`icon-link ${showChatbot ? "active" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setShowChatbot(!showChatbot);
                            }}
                        >
                            <i className="fa-solid fa-comments"></i>
                        </Link>

                        {/* 로그인 상태일 때만 마이페이지 노출 */}
                        {isLogin && (
                            <NavLink to="/mypage" className="icon-link">
                                <FaUser className="icon"/>
                            </NavLink>
                        )}

                        {/* 로그인 / 로그아웃 토글 */}
                        {isLogin ? (
                            <button
                                className="icon-link logout"
                                onClick={async () => {
                                    await dispatch(getLogout());
                                    window.location.reload();
                                }}
                            >
                                <FaSignOutAlt className="icon"/>
                            </button>
                        ) : (
                            <NavLink to="/login" className="icon-link">
                                <FaSignInAlt className="icon"/>
                            </NavLink>
                        )}

                        {/* 모바일 메뉴 버튼 */}
                        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <FaTimes/> : <FaBars/>}
                        </button>
                    </div>

                    {/* PC 전용 구매 서브 메뉴 */}
                    {!isMobile && purchaseMenuOpen && (
                        <div className="submenu-container">
                            <div className="submenu-content">
                                <Link to="/products/mountain">산악</Link>
                                <Link to="/products/road">로드</Link>
                                <Link to="/products/lifestyle">라이프스타일</Link>
                                <Link to="/products/electric">전기</Link>
                                <Link to="/compare">비교하기</Link>
                            </div>
                        </div>
                    )}
                </header>

                {/* 챗봇 UI */}
                {showChatbot && <Chatbot onClose={() => setShowChatbot(false)}/>}

                {/* 모바일 DIM Layer */}
                {menuOpen && isMobile && (
                    <div className="dim" onClick={closeMobileMenu}></div>
                )}
            </>
        );
}
