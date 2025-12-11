import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "./session.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 페이지 최초 로드 시 로그인 정보 조회
  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  // 로그인 성공 시 호출할 함수
  const login = async () => {
    const data = await getCurrentUser();
    setUser(data); // 즉시 user 상태 업데이트
  };

  // 로그아웃 함수
  const logout = async () => {
    await axios.post("http://localhost:8080/auth/logout", {}, { withCredentials: true });

    // 새 CSRF 토큰 발급
    await axios.get("http://localhost:8080/csrf/create", { withCredentials: true });

    setUser({ isLogin: false });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
