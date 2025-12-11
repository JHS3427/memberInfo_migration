import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getApiBase } from "../../feature/auth/getApiBase.js";
import "../../styles/board.css";
import "../../styles/board/board_list.css";
import { Pagination } from "../../pages/support/Pagination.jsx";

/**
 * BoardList 컴포넌트
 *
 * 역할:
 * - 카테고리별 게시글 목록 조회
 * - 카드 형태 UI 렌더링(썸네일 + 제목 + 작성일)
 * - 페이지네이션 처리
 * - 게시글 클릭 시 상세보기로 이동
 *
 * props:
 * - category: "news" | "event" | "review"
 *
 * API 요청:
 * GET /api/board/{category}
 */
export function BoardList({ category }) {
  const [posts, setPosts] = useState([]);             // 전체 게시글 목록
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
  const itemsPerPage = 8;                             // 페이지당 8개 게시글
  const navigate = useNavigate();
  const API_BASE = getApiBase();

  /**
   * 카테고리가 변경될 때 게시글 목록 불러오기
   */
  useEffect(() => {
    if (!category) return;

    axios
      .get(`${API_BASE}/api/board/${category}`)
      .then((res) => {
        setPosts(res.data);
        setCurrentPage(1); // 탭 변경 시 첫 페이지로 초기화
      })
      .catch((err) => console.error("게시글 목록 불러오기 실패:", err));
  }, [category]);

  /**
   * 페이지네이션 계산
   *
   * totalPages: 총 페이지 수
   * startIndex: 현재 페이지 첫 게시글 index
   * currentPosts: 현재 페이지에서 보여줄 게시글 목록
   */
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="board-list">

      {/* 게시글 카드 영역 */}
      <div className="board-cards">
        {currentPosts.length === 0 ? (
          <p>등록된 게시글이 없습니다.</p>
        ) : (
          currentPosts.map((post) => (
            <div
              key={post.pid}
              className="board-card"
              onClick={() =>
                navigate(`/board/detail/${post.pid}`, { state: { post } })
              }
            >
              {/* 썸네일 이미지 */}
              <img
                src={post.thumbnailUrl || "/images/noimage.png"}
                alt={post.title}
                className="board-thumb"
              />

              {/* 제목 + 날짜 */}
              <div className="board-info">
                <h3>{post.title}</h3>
                <p className="board-date">
                  {post.createdAt?.slice(0, 10)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션: 페이지가 2개 이상일 때만 표시 */}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
