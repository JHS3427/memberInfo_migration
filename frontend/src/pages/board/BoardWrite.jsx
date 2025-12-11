import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getCurrentUser, getLoginUser } from "../../feature/auth/session";
import { getApiBase } from "../../feature/auth/getApiBase.js";
import "../../styles/board.css";
import "../../styles/board/board_write.css";
import Swal from 'sweetalert2'

/**
 * BoardWrite 컴포넌트
 *
 * 역할:
 * - 게시글 작성 & 수정 기능 제공
 * - 로그인하지 않은 사용자는 접근 차단
 * - URL 직접 접근 차단 (fromBoard 여부 체크)
 * - 이미지 업로드(썸네일/본문) → 서버 저장 → URL 반환
 * - POST / PUT 방식으로 글 등록 또는 수정
 *
 * 라우트:
 *   작성: /board/write/:category
 *   수정: /board/edit/:pid
 */
export function BoardWrite() {
  const { category, pid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = !!pid;   // 수정 여부 판단
  const [user, setUser] = useState(null);
  const API_BASE = getApiBase();

  /**
   * 단계를 분리해 로그인/세션/권한 관련 문제를 사전에 차단한다.
   * 
   * 1) LocalStorage 로그인 정보 확인
   * 2) URL 직접 접근 차단
   * 3) 백엔드 세션 검증(getCurrentUser)
   */
  useEffect(() => {
    const local = getLoginUser();

    // 1) 로그인된 사용자 없음 → 로그인 페이지로 이동
    if (!local) {
      Swal.fire({
                icon: "info",
                title: "로그인 해주세요.",
                text: "로그인이 필요한 서비스입니다.",
            });
      navigate("/login");
      return;
    }

    // 2) URL 직접 접근 차단
    if (!location.state?.fromBoard) {
      Swal.fire({
                icon: "warning",
                title: "접근 제한!",
                text: "잘못된 접근입니다.",
      });
      navigate("/board/news");
      return;
    }

    // 3) 백엔드 세션 상태 확인
    getCurrentUser().then((sessionUser) => {
      if (!sessionUser?.isLogin) {
        Swal.fire({
                icon: "warning",
                title: "세션 만료",
                text: "세션이 만료되었습니다. 다시 로그인해주세요.",
        });
        navigate("/login");
        return;
      }
      setUser(sessionUser);
    });
  }, []);

  /**
   * user가 세팅되면 form에 uid / writer 적용
   */
  useEffect(() => {
    if (user) {
      setForm((s) => ({
        ...s,
        uid: user.uid,
        writer: user.uid,
      }));
    }
  }, [user]);

  /** CSRF 토큰 가져오기 */
  const getCsrfToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];
  };

  /**
   * 게시글 form state
   */
  const [form, setForm] = useState({
    title: "",
    content: "",
    uid: "",
    writer: "",
    imageUrl: "",
    thumbnailUrl: "",
    categoryTag: category || "review",
    status: "PUBLIC",
  });

  /**
   * 이미지 업로드 공통 함수
   *
   * 업로드 과정:
   * 1) FormData 생성
   * 2) axios로 /api/upload POST 요청
   * 3) 서버에서 저장된 이미지 URL 반환
   * 4) form state에 이미지 URL 저장
   */
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-XSRF-TOKEN": getCsrfToken(),
        },
        withCredentials: true,
      });

      const fileUrl = res.data.url;

      setForm((s) => ({
        ...s,
        [type]: fileUrl,
      }));
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      Swal.fire({
                icon: "error",
                title: "오류!",
                text: "이미지 업로드 중 오류가 발생했습니다.",
      });
    }
  };

  /**
   * 수정 모드일 경우 기존 글 정보를 불러온다.
   */
  useEffect(() => {
    if (!isEdit) return;

    axios
      .get(`${API_BASE}/api/board/detail/${pid}`, {
        withCredentials: true,
      })
      .then((res) => {
        const p = res.data;

        setForm({
          title: p.title,
          content: p.content,
          uid: p.uid,
          writer: p.writer || user?.uid,
          imageUrl: p.imageUrl,
          thumbnailUrl: p.thumbnailUrl,
          categoryTag: p.categoryTag,
          status: p.status,
        });
      })
      .catch(console.error);
  }, [isEdit, pid, user]);

  /** 입력 폼 변경 이벤트 */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  /**
   * 게시글 등록 / 수정 처리
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const csrf = getCsrfToken();

    try {
      if (isEdit) {
        /** 수정 PUT */
        await axios.put(
          `${API_BASE}/api/board/update/${pid}`,
          { ...form, uid: user.uid }, // 보안 보강
          {
            headers: { "X-XSRF-TOKEN": csrf },
            withCredentials: true,
          }
        );
        
        Swal.fire({
                icon: "success",
                title: "게시글 수정",
                text: "수정되었습니다.",
        });
        navigate(`/board/detail/${pid}`);

      } else {
        /** 작성 POST */
        await axios.post(
          `${API_BASE}/api/board/write`,
          {
            ...form,
            uid: user.uid,
            writer: user.uid,
            boardCategory: { bname: form.categoryTag },
          },
          {
            headers: { "X-XSRF-TOKEN": csrf },
            withCredentials: true,
          }
        );

        Swal.fire({
                icon: "success",
                title: "게시글 등록",
                text: "게시글이 등록되었습니다.",
        });
        navigate(`/board/${form.categoryTag}`);
      }

    } catch (err) {
      console.error(err);
      Swal.fire({
                icon: "error",
                title: "오류!",
                text: "처리 중 오류가 발생했습니다.",
      });
    }
  };

  return (
    <div className="board-page">
      <h1 className="board-title">{isEdit ? "게시글 수정" : "게시글 작성"}</h1>

      <form className="board-write-form" onSubmit={handleSubmit}>
        
        {/* 제목 */}
        <input
          name="title"
          placeholder="제목을 입력하세요"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* 본문 텍스트 */}
        <textarea
          name="content"
          placeholder="내용을 입력하세요"
          value={form.content}
          onChange={handleChange}
          required
        />

        {/* 썸네일 업로드 */}
        <label className="upload-label">썸네일 이미지 첨부</label>
        <label className="upload-box">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "thumbnailUrl")}
          />
          <span>클릭하여 이미지 선택</span>
        </label>

        {/* 썸네일 미리보기 */}
        {form.thumbnailUrl && (
          <div className="preview-container">
            <img src={form.thumbnailUrl} alt="thumbnail preview" className="preview-img" />
            <button
              type="button"
              className="delete-image-btn"
              onClick={() => setForm((s) => ({ ...s, thumbnailUrl: "" }))}
            >
              ✕
            </button>
          </div>
        )}

        {/* 본문 이미지 업로드 */}
        <label className="upload-label">본문 이미지 첨부</label>
        <label className="upload-box">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "imageUrl")}
          />
          <span>클릭하여 이미지 선택</span>
        </label>

        {/* 본문 이미지 미리보기 */}
        {form.imageUrl && (
          <div className="preview-container">
            <img src={form.imageUrl} alt="content preview" className="preview-img" />
            <button
              type="button"
              className="delete-image-btn"
              onClick={() => setForm((s) => ({ ...s, imageUrl: "" }))}
            >
              ✕
            </button>
          </div>
        )}

        {/* 카테고리 선택 */}
        <select name="categoryTag" value={form.categoryTag} onChange={handleChange}>
          <option value="news">뉴스</option>
          <option value="event">이벤트</option>
          <option value="review">리뷰</option>
        </select>

        {/* 버튼 */}
        <button type="submit" className="btn-back">
          {isEdit ? "수정하기" : "등록"}
        </button>
      </form>
    </div>
  );
}
