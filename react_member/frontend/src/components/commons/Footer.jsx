import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Footer 컴포넌트
 *
 * 구성:
 * - 왼쪽: 로고
 * - 중앙: 게시판/고객센터 네비게이션 버튼
 * - 오른쪽: 회사 정보 + SNS 링크
 * - 하단: 카피라이트 영역
 * - 화면 스크롤 시 표시되는 "Top 버튼"
 */
export function Footer() {
  const [showTop, setShowTop] = useState(false);
  const navigate = useNavigate();

  /**
   * 스크롤 위치에 따라 "Top 버튼"의 표시 여부 결정
   *
   * window.scrollY > 200:
   *   → 화면을 일정 이상 내렸을 때만 버튼이 나타남
   */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) setShowTop(true);
      else setShowTop(false);
    };

    window.addEventListener("scroll", handleScroll);

    // 컴포넌트 언마운트 시 스크롤 이벤트 제거
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * 화면 상단으로 부드럽게 이동하는 기능
   */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* 왼쪽: 로고 섹션 */}
        <div className="footer-logo">
          <img src="/logo.png" alt="Bicycle Logo" />
        </div>

        {/* 중앙: 네비게이션 링크 섹션 */}
        <div className="footer-links">
          
          {/* 게시판 관련 링크 */}
          <div>
            <h4>게시판</h4>
            <ul>
              <li><button onClick={() => navigate("/board/news")}>뉴스</button></li>
              <li><button onClick={() => navigate("/board/event")}>이벤트</button></li>
              <li><button onClick={() => navigate("/board/review")}>리뷰</button></li>
            </ul>
          </div>

          {/* 고객센터 링크 */}
          <div>
            <h4>고객센터</h4>
            <ul>
              <li><button onClick={() => navigate("/support/faq")}>자주 묻는 질문</button></li>
              <li><button onClick={() => navigate("/support/asinfo")}>A/S 안내</button></li>
              <li><button onClick={() => navigate("/support/resources")}>자료실</button></li>
            </ul>
          </div>

          {/* 필요 시 확장 가능 (회사 정보 등)
          <div>
            <h4>회사 소개</h4>
            <ul>
              <li><a href="#">회사 스토리</a></li>
              <li><a href="#">테크놀로지</a></li>
              <li><a href="#">선수 후원</a></li>
              <li><a href="#">오시는 길</a></li>
            </ul>
          </div>
          */}
        </div>

        {/* 오른쪽: 회사 정보 및 SNS */}
        <div className="footer-info">
          
          {/* SNS 아이콘 */}
          <div className="footer-social">
            <a href="https://www.instagram.com/cellobike_official/" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.youtube.com/channel/UCgb2432J7dUqZXaWe39FqQw" target="_blank" rel="noreferrer">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://blog.naver.com/celloblog" target="_blank" rel="noreferrer">
              <i className="fa-solid fa-blog"></i>
            </a>
          </div>

          {/* 회사 상세 정보 */}
          <p>
            대표 홍길동 | 사업자등록번호 123-45-67890 <br />
            대표번호 02-1234-5678 <br />
            서울특별시 강남구 테헤란로 123 (테스트빌딩 7층)
          </p>

          {/* 정책 페이지 링크 */}
          <div className="footer-policy">
            <a href="/policies/terms">이용약관</a>
            <a href="/policies/privacy">개인정보 취급방침</a>
            <a href="/policies/internalpolicy">내부정보 관리규정</a>
          </div>

        </div>
      </div>

      {/* 하단 카피라이트 */}
      <div className="footer-bottom">
        © 2025 Bicycle-App. All rights reserved.
      </div>

      {/* Top 버튼 (스크롤 시 표시됨) */}
      {showTop && (
        <button className="top-btn" onClick={scrollToTop}>
          <i className="fa-solid fa-angle-up"></i>
        </button>
      )}
    </footer>
  );
}
