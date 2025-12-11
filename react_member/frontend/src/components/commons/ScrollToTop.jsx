import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop 컴포넌트
 *
 * React Router 기반 SPA에서는 페이지 이동 시
 * 이전 페이지의 스크롤 위치가 그대로 유지되는 문제가 있다.
 *
 * 이 컴포넌트는 pathname(현재 URL 경로)이 변경될 때마다
 * 화면 스크롤을 자동으로 최상단(top: 0)으로 이동시키는 역할을 한다.
 *
 * 사용 방식:
 * - App.js에서 <BrowserRouter> 내부 최상단에 배치하면
 *   모든 라우팅 변화에 반응한다.
 *
 * 예)
 * <BrowserRouter>
 *    <ScrollToTop />
 *    <App />
 * </BrowserRouter>
 */
export function ScrollToTop() {
  // 현재 경로(pathname) 값 가져오기
  const { pathname } = useLocation();

  // 경로가 바뀔 때마다 실행
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  // UI를 렌더링할 필요가 없으므로 null 반환
  return null;
}
