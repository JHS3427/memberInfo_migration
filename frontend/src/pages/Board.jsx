import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BoardList } from "./board/BoardList.jsx";
import { getCurrentUser } from "../feature/auth/session";
import "../styles/board.css";

/**
 * Board
 *
 * 기능:
 * - 게시판 목록 페이지 (뉴스 / 이벤트 / 리뷰)
 * - URL 카테고리 검증 후 유효하지 않으면 자동 리다이렉트
 * - 로그인 여부 및 권한(관리자) 확인
 * - 뉴스/이벤트 → 관리자만 작성 가능
 * - 리뷰 → 로그인 사용자 모두 작성 가능
 */
export function Board() {
  const { category } = useParams(); // URL에서 카테고리(news/event/review) 추출
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  /**
   * 탭 목록 정의
   */
  const tabs = [
    { key: "news", label: "뉴스" },
    { key: "event", label: "이벤트" },
    { key: "review", label: "리뷰" },
  ];

  const tabKeys = tabs.map((t) => t.key);

  /**
   * URL 검증
   * - 잘못된 카테고리 접근 시 /board/news 로 강제 이동
   */
  useEffect(() => {
    if (!tabKeys.includes(category)) {
      navigate("/board/news", { replace: true });
    }
  }, [category, navigate]);

  /**
   * 로그인 사용자 정보 로드
   * - 세션 기반이므로 새로고침하거나 페이지 이동해도 유지
   * - user.role 에 관리자 여부 포함
   */
  useEffect(() => {
    async function load() {
      const session = await getCurrentUser();
      if (session.isLogin) {
        setUser(session);  // 여기에는 role 포함됨!
      }
    }
    load();
  }, []);

  /**
   * 관리자 여부
   * - role: [{ authority: "ROLE_ADMIN" }]
   */
  const isAdmin = user?.role?.some((r) => r.authority === "ROLE_ADMIN");

  /**
   * 글 작성 가능 조건
   *
   * - 리뷰(review) → 모든 로그인 유저 가능
   * - 뉴스/이벤트 → 관리자만 가능
   */
  const canWrite =
    (category === "review" && user) ||
    ((category === "news" || category === "event") && isAdmin);

  return (
    <div className="board-page">
      <h1 className="board-title">게시판</h1>

      {/* 탭 메뉴 */}
      <div className="board-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={category === tab.key ? "active" : ""}
            onClick={() => navigate(`/board/${tab.key}`)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 게시글 목록 출력 컴포넌트 */}
      <BoardList category={category} />

      {/**
       * 글 작성 버튼 영역
       * - 로그인 O + 권한을 만족해야 노출
       */}
      {user ? (
        canWrite ? (
          <div className="detail-footer">
            <button
              className="btn-back"
              onClick={() =>
                navigate(`/board/write/${category}`, {
                  state: { fromBoard: true },
                })
              }
            >
              글 작성하기
            </button>
          </div>
        ) : (
          // 로그인했지만 작성 권한이 없는 경우
          <p style={{ textAlign: "center", marginTop: "20px", color: "#777" }}>
            ※ 이 게시판은 관리자만 글을 작성할 수 있습니다.
          </p>
        )
      ) : (
        // 비로그인 유저
        <p style={{ textAlign: "center", marginTop: "20px", color: "#777" }}>
          ※ 로그인 후 글 작성이 가능합니다.
        </p>
      )}
    </div>
  );
}
