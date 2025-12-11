import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentUser, isAdmin, isOwner, getCsrfToken } from "../../feature/auth/session";
import { getApiBase } from "../../feature/auth/getApiBase.js";
import "../../styles/board.css";
import "../../styles/board/board_detail.css";
import Swal from 'sweetalert2'

/**
 * BoardDetail
 *
 * 기능:
 * - 게시글 상세 조회
 * - 본문 이미지 + 텍스트 출력
 * - 관리자 / 작성자 본인일 경우 수정 & 삭제 버튼 활성화
 * - 삭제 시 CSRF 토큰 포함하여 DELETE 요청
 *
 * 경로: /board/detail/:pid
 */
export function BoardDetail() {
  const { pid } = useParams();            // URL에서 글 번호(pid) 추출
  const navigate = useNavigate();         // 페이지 이동
  const [post, setPost] = useState(null); // 게시글 상세 데이터
  const [user, setUser] = useState(null); // 로그인 사용자 정보
  const API_BASE = getApiBase();

  /**
   * 로그인 사용자 정보 불러오기
   * 세션 기반이므로 새로고침해도 로그인 상태 유지 가능
   */
  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  /**
   * 게시글 상세 요청
   * GET /api/board/detail/:pid
   */
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/board/detail/${pid}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error("게시글 상세 조회 실패:", err));
  }, [pid]);

  /**
   * 관리자 또는 작성자 본인 여부 확인
   */
  const canManage = isAdmin(user) || isOwner(user, post);

  /**
   * 게시글 삭제 처리
   *
   * 1. CSRF 토큰 읽기
   * 2. DELETE /api/board/delete/:pid 요청
   * 3. 삭제 후 해당 게시판 목록으로 이동
   */
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제할까요?")) return;

    try {
      const csrf = getCsrfToken();

      await axios.delete(`${API_BASE}/api/board/delete/${pid}`, {
        headers: { "X-XSRF-TOKEN": csrf },
        withCredentials: true, // 세션 쿠키 포함
      });

      Swal.fire({
                icon: "success",
                title: "게시글 삭제",
                text: "삭제되었습니다.",
      });

      // 원래 게시판 탭으로 이동
      const backTab = post?.categoryTag || "news";
      navigate(`/board/${backTab}`);
    } catch (e) {
      console.error(e);
      Swal.fire({
                icon: "error",
                title: "오류!",
                text: "삭제 중 오류가 발생했습니다.",
      });
    }
  };

  /**
   * 수정 버튼 클릭 → /board/edit 페이지로 이동
   * 반드시 state: { fromBoard: true } 를 넣어
   * URL 직접 접근을 막는 용도로 사용
   */
  const handleEdit = () => {
    navigate(`/board/edit/${pid}`, {
      state: { fromBoard: true },
    });
  };

  /**
   * 게시글 로딩 중 표시
   */
  if (!post) {
    return (
      <p style={{ textAlign: "center", marginTop: "100px" }}>
        게시글을 불러오는 중입니다...
      </p>
    );
  }

  return (
    <div className="board-detail">
      {/* 제목 */}
      <h1 className="detail-title">{post.title}</h1>

      {/* 작성자 / 날짜 / 조회수 */}
      <div className="detail-meta">
        <span>작성자: {post.writer || "관리자"}</span>
        <span>{post.createdAt?.slice(0, 10)}</span>
        <span>조회수: {post.viewCount}</span>
      </div>

      <hr className="detail-divider" />

      {/* 본문 영역 */}
      <div className="detail-content">

        {/* 본문 이미지 */}
        {post.imageUrl && (
          <div className="detail-image-box">
            <img src={post.imageUrl} alt="본문 이미지" className="detail-image" />
          </div>
        )}

        {/* 본문 텍스트 */}
        <p className="detail-text">{post.content}</p>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="detail-footer">
        <button
          className="btn-back"
          onClick={() => navigate(`/board/${post.categoryTag}`)}
        >
          목록으로
        </button>

        {canManage && (
          <>
            <button className="btn-back" onClick={handleEdit}>
              수정
            </button>
            <button className="btn-back" onClick={handleDelete}>
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  );
}
