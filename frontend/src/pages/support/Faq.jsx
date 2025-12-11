/**
 * FAQ 컴포넌트
 *
 * 역할:
 * - /data/qna.json에서 FAQ 데이터 로드
 * - 아코디언 형태로 질문/답변 펼치기
 * - 위험한 HTML 포함 답변(dangerouslySetInnerHTML) 지원
 * - Pagination.jsx 활용하여 페이지네이션 처리
 *
 * 주요 기능:
 * - fetch로 JSON 데이터 불러오기
 * - openIndex로 선택된 질문 하나만 열기
 * - 페이지마다 일정 개수(itemsPerPage)만 보여줌
 */

import React, { useState, useEffect } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Pagination } from "./Pagination.jsx";

export function FAQ() {
  /* 상태 정의 */
  const [faqs, setFaqs] = useState([]);               // 전체 FAQ 데이터
  const [openIndex, setOpenIndex] = useState(null);   // 현재 열려있는 FAQ 인덱스
  const [currentPage, setCurrentPage] = useState(1);  // 페이지네이션 현재 페이지

  const itemsPerPage = 7; // 한 페이지에 보여줄 FAQ 수

  /**
   * qna.json 로드
   * - public/data/qna.json 에 있어야 함
   */
  useEffect(() => {
    fetch("/data/qna.json")
      .then((res) => res.json())
      .then(setFaqs)
      .catch((err) =>
        console.error("❌ QNA 데이터를 불러오지 못했습니다:", err)
      );
  }, []);

  // 페이지네이션 계산
  const totalPages = Math.ceil(faqs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFaqs = faqs.slice(startIndex, startIndex + itemsPerPage);

  // 렌더링
  return (
    <div className="faq-section">

      {/* FAQ 목록 */}
      {currentFaqs.map((item, i) => (
        <div
          key={item.qid}
          className={`faq-item ${openIndex === i ? "open" : ""}`}
          onClick={() => setOpenIndex(openIndex === i ? null : i)}
        >
          {/* 질문 영역 */}
          <div className="faq-question">
            <FaQuestionCircle />

            <div className="faq-text">
              <span className="faq-q">{item.q}</span>

              {/* 분류 코드(있을 경우만 출력) */}
              {item.qcode && (
                <small className="faq-category">{item.qcode}</small>
              )}
            </div>
          </div>

          {/* 답변 영역 - 아코디언 펼침 */}
          {openIndex === i && (
            <div
              className="faq-answer"
              dangerouslySetInnerHTML={{
                __html: item.a.replace(/\n/g, "<br />"), // 줄바꿈 → <br>
              }}
            />
          )}
        </div>
      ))}

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
