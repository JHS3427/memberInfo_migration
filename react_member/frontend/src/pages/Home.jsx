import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../styles/home.css";

/**
 * Home
 *
 * 기능:
 * - 메인 랜딩 페이지
 * - Hero 섹션 이미지 슬라이드 (Swiper)
 * - 스크롤 시 Hero 이미지 투명도 조절 효과
 * - 인기 자전거 / 대여 / 여행지 추천 / 게시판 / 고객센터 각 섹션 연결
 */
export function Home() {
  const [scrollY, setScrollY] = useState(0);

  /**
   * 스크롤 값 감지 → Hero 섹션 opacity 조절
   */
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const opacity = Math.max(1 - scrollY / 800, 0);

  return (
    <div className="home">
      
      {/* Hero 섹션 */}
      <section className="hero-section" style={{ opacity }}>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="hero-swiper"
        >
          {["hero1.jpg", "hero2.jpg", "hero3.jpg", "hero4.jpg", "hero5.jpg"].map((img, idx) => (
            <SwiperSlide key={idx}>
              <img src={`/images/${img}`} alt={`Hero ${idx + 1}`} className="hero-image" />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="hero-text">
          <h1>Explore the World on Two Wheels</h1>
          <p>당신의 라이딩 여정을 지금 시작하세요</p>
        </div>
      </section>

      {/* 자전거 판매 */}
      <section className="section sale">
        <span className="section-subtitle">Products</span>
        <h2>인기 자전거</h2>
        <div className="bike-grid">
          {[
            {
              img: "home_bicycle1.png",
              name: "산악",
              category: "mountain",
              desc: "험난한 지형도 두렵지 않은 강력한 서스펜션과 견고한 프레임으로 완벽한 산악 주행을 즐겨보세요.",
            },
            {
              img: "home_bicycle2.png",
              name: "로드",
              category: "road",
              desc: "속도와 퍼포먼스를 극대화한 초경량 프레임, 장거리 라이딩에 최적화된 로드 바이크입니다.",
            },
            {
              img: "home_bicycle3.png",
              name: "라이프스타일",
              category: "lifestyle",
              desc: "출퇴근부터 주말 나들이까지, 일상 속 라이딩을 스타일리시하게 완성하는 도심형 자전거입니다.",
            },
            {
              img: "home_bicycle4.png",
              name: "전기",
              category: "electric",
              desc: "페달링의 부담을 줄여주는 강력한 전동 모터 탑재, 어디서나 손쉽게 즐기는 스마트 라이딩 경험.",
            },
          ].map((bike, idx) => (
            <div className="bike-card" key={idx}>
              <img src={`/images/${bike.img}`} alt={bike.name} />
              <h3>{bike.name}</h3>
              <p>{bike.desc}</p>
              <Link to={`/products/${bike.category}`} className="btn-outline">
                구매하기
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 대여 */}
      <section className="section rental">
        <span className="section-subtitle">Rental</span>
        <h2>자전거 대여 서비스</h2>
        <p>가볍게 떠나고 싶을 때, 가까운 대여소에서 손쉽게 이용하세요.</p>
        <p>자전거 위치를 한눈에 확인하고, 원하는 장소에서 편리하게 대여할 수 있습니다.</p>
        <Link to="/rental" className="btn-primary">대여하러 가기</Link>
      </section>

      {/* 여행지 추천 */}
      <section className="section travel">
        <span className="section-subtitle">Travel</span>
        <h2>추천 라이딩 코스</h2>
        <div className="travel-cards">
          {[
            { 
              img: "home_travel1.jpg", 
              name: "한강 라이딩 코스", 
              desc: "서울의 중심을 따라 흐르는 한강을 따라 달리며 도시 속 여유를 만끽해보세요." 
            },
            { 
              img: "home_travel2.jpg", 
              name: "강원도 미시령 코스", 
              desc: "굽이진 산길을 오르내리며 짜릿한 업힐과 아름다운 산맥 경관을 즐길 수 있는 코스입니다." 
            },
            { 
              img: "home_travel3.jpg", 
              name: "남이섬 코스", 
              desc: "호수와 숲길을 함께 달리며 낭만적인 풍경 속 라이딩을 경험해보세요." 
            }
          ].map((course, idx) => (
            <div className="travel-card" key={idx}>
              <img src={`/images/${course.img}`} alt={course.name} />
              <h3>{course.name}</h3>
              <p>{course.desc}</p> {/* 설명 추가 */}
            </div>
          ))}
        </div>
        <Link to="/travel" className="btn-outline">더보기</Link>
      </section>

      {/* 게시판 */}
      <section className="section board">
        <span className="section-subtitle">Board</span>
        <h2>라이더 커뮤니티</h2>
        <div className="board-container">
          
          {/* News */}
          <div className="board-item">
            <img src="/images/home_board1.jpg" alt="News" />
            <div className="board-text">
              <h3>뉴스</h3>
              <p>브랜드의 최신 소식과 업데이트를 확인하세요.</p>
              <Link to="/board/news" className="btn-outline">바로가기</Link>
            </div>
          </div>

          {/* Event */}
          <div className="board-item">
            <img src="/images/home_board2.jpg" alt="Event" />
            <div className="board-text">
              <h3>이벤트</h3>
              <p>다양한 이벤트에 참여하고 특별한 혜택을 누려보세요.</p>
              <Link to="/board/event" className="btn-outline">바로가기</Link>
            </div>
          </div>

          {/* Review */}
          <div className="board-item">
            <img src="/images/home_board3.jpg" alt="Review" />
            <div className="board-text">
              <h3>리뷰</h3>
              <p>실제 라이더들의 생생한 사용 후기를 만나보세요.</p>
              <Link to="/board/review" className="btn-outline">바로가기</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 고객센터 */}
      <section className="section support">
        <span className="section-subtitle">Support</span>
        <h2>도움이 필요하신가요?</h2>
        <p>자주 묻는 질문에서 빠르게 답을 찾고,</p>
        <p>A/S 안내와 자료실로 필요한 정보를 확인하세요.</p>
        <p>궁금한 점은 챗봇이 실시간으로 도와드립니다.</p>
        <Link to="/support" className="btn-outline2">고객센터 바로가기</Link>
      </section>
    </div>
  );
}
