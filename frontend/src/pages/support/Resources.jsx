/**
 * Resources (자료실) 컴포넌트
 *
 * 기능 요약:
 *  - /data/resources.json 데이터를 불러와 자료 리스트 출력
 *  - 카테고리 필터 (전체 / 카탈로그 / 사용설명서 / 기타)
 *  - 페이지네이션 적용
 *  - 각 항목 클릭 → 파일 새 창 열기 (PDF 등)
 */

import React, { useState, useEffect } from "react";
import { Pagination } from "./Pagination.jsx";

export function Resources() {
  /* 상태 정의 */
  const [resources, setResources] = useState([]);     // 전체 자료 리스트
  const [filter, setFilter] = useState("전체");       // 선택된 필터 카테고리
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 번호
  const itemsPerPage = 10;                            // 한 페이지에 보여줄 자료 수

  /**
   * 1) 자료실 JSON 데이터 로드
   * 
   * public/data/resources.json 에 존재해야 함
   */
  useEffect(() => {
    fetch("/data/resources.json")
      .then((res) => res.json())
      .then((data) => {
        // 데이터를 id 기준 오름차순 정렬
        const sorted = [...data].sort((a, b) => a.id - b.id);
        setResources(sorted);
      })
      .catch((err) =>
        console.error("❌ 자료실 데이터를 불러오지 못했습니다:", err)
      );
  }, []);

  /**
   * 2) 필터링 처리
   * 
   * filter === "전체" → 전체 데이터 반환
   * 나머지 → category 일치하는 항목만 반환
   */
  const filtered =
    filter === "전체"
      ? resources
      : resources.filter((item) => item.category === filter);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  // 렌더링
  return (
    <div className="resources-section">

      {/* 필터 드롭다운 */}
      <div className="resources-header">
        <select
          className="resources-filter"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);  // 새 필터 적용
            setCurrentPage(1);          // 필터 변경 시 1페이지로 이동
          }}
        >
          <option value="전체">전체</option>
          <option value="카탈로그">카탈로그</option>
          <option value="사용설명서">사용설명서</option>
          <option value="기타">기타</option>
        </select>
      </div>

      {/* 자료 리스트 UI */}
      <ul className="resources-list">
        {currentItems.map((item) => (
          <li
            key={item.id}
            className="resources-item"
            onClick={() => window.open(item.url, "_blank")} // 새 창에서 파일 열기
          >
            <span className="file-icon">
              <i className="fa-solid fa-folder" />
            </span>

            <span className="file-title">{item.title}</span>

            <span className="file-type">
              <i className="fa-solid fa-download" /> PDF
            </span>
          </li>
        ))}

        {/* 항목 없음 */}
        {currentItems.length === 0 && (
          <li className="no-data">자료가 없습니다.</li>
        )}
      </ul>

      {/* 페이지네이션 */}
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
