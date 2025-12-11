/**
 * getApiBase()
 *
 * 목적:
 *  - React 프론트엔드가 접속된 환경(도메인/내부 IP/로컬)에 따라
 *    자동으로 백엔드(Spring Boot) API 주소를 선택한다.
 *
 * 사용 예:
 *  - 팀 프로젝트에서 여러 개발자가 서로 다른 로컬 서버를 열 때
 *  - 반응형으로 API 주소가 바뀌지 않도록 통일된 접근 방식을 제공
 *
 * 필요 조건:
 *  - .env 파일에 JSON 배열 형식으로 API 주소가 들어 있어야 함
 *    예: REACT_APP_API_BASES='["http://localhost:8080","http://192.168.0.10:8080"]'
 */
export function getApiBase() {
  let API_BASE = null;

  try {
    /**
     * .env 의 REACT_APP_API_BASES 값을 JSON으로 파싱
     * 예: ["http://localhost:8080", "http://192.168.0.10:8080"]
     */
    const API_BASES = JSON.parse(process.env.REACT_APP_API_BASES);

    // 현재 페이지가 실행되는 호스트 이름 (예: localhost, 192.168.0.12, mysite.com)
    const hostname = window.location.hostname;

    /**
     * 1) 현재 hostname이 포함된 주소 자동 매칭
     *
     * 예:
     * hostname: 192.168.0.12
     * API_BASES: ["http://192.168.0.12:8080"]
     *
     * → EXACT MATCH (IP 자동 매칭)
     */
    API_BASE = API_BASES.find((url) => url.includes(hostname));

    /**
     * 2) 로컬 개발 환경 강제 localhost 지정
     *
     * - localhost 접속
     * - 127.0.0.1 접속
     * - ::1 (IPv6 localhost)
     * - 사설 내부망 IP (192.168.* or 10.*)
     */
    const isLocal =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.");

    if (isLocal) {
      // 팀원들이 각자 개발할 때 항상 localhost 백엔드로 연결되도록 강제
      API_BASE = "http://localhost:8080";
    }

    /**
     * 3) 매칭 실패 대비 fallback
     * - 환경이 맞지 않거나 API_BASES 파싱에 실패한 경우
     * - 마지막 안전망으로 localhost 사용
     */
    if (!API_BASE) {
      API_BASE = "http://localhost:8080";
    }

  } catch (e) {
    console.error("API_BASE 파싱 실패:", e);
    API_BASE = "http://localhost:8080";
  }

  return API_BASE;
}
