/**
 * Pagination 컴포넌트
 *
 * Props:
 * - totalPages: 전체 페이지 수
 * - currentPage: 현재 선택된 페이지 번호
 * - setCurrentPage: 부모 컴포넌트에서 전달받은 페이지 변경 함수
 *
 * 기능:
 * - 이전/다음 버튼 제공
 * - 페이지 번호 버튼 자동 생성
 * - 페이지 이동 시 화면 최상단으로 스크롤 이동
 *
 * 사용 예:
 * <Pagination
 *    totalPages={totalPages}
 *    currentPage={currentPage}
 *    setCurrentPage={setCurrentPage}
 * />
 */

import React from "react";

export function Pagination({ totalPages, currentPage, setCurrentPage }) {
  /**
   *  스크롤을 최상단으로 부드럽게 이동
   */
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  /**
   *  페이지 번호 클릭 시 동작
   *  - 페이지 업데이트
   *  - 화면을 위로 올려 리스트의 시작 지점으로 이동
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    scrollToTop();
  };

  return (
    <div className="pagination">
      
      {/* 이전 버튼 */}
      <button
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        이전
      </button>

      {/* 페이지 번호들 */}
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={currentPage === i + 1 ? "active" : ""}
          onClick={() => handlePageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </div>
  );
}
