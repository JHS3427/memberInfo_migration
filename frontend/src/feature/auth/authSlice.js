import { createSlice } from '@reduxjs/toolkit'

const saveAuth = JSON.parse(localStorage.getItem("loginInfo"));

const initialState = saveAuth || {
    isLogin: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.isLogin = !state.isLogin;
            const { userId,isSocial,role } = action.payload;
            const loginInfo = { "userId": userId, "isLogin":state.isLogin, "isSocial" :isSocial, "role": role || []};
            localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
        },
        logout(state, action) {
            state.isLogin = !state.isLogin;
            localStorage.removeItem("loginInfo");
        },

        /* 
        조해성
         설명 : 백엔드에서 토큰을 수령하여 이를 로컬 스토리지에 저장합니다.
         후일 개선 사항 : 토큰을 직접 주는것은 보안상 위험하므로 
                        로그인 테이블을 만들고, 이를 이용한 아이디를 생성하여
                        이를 전달할 예정입니다.
        */
        socialLogin(state,action){
            state.isLogin=!state.isLogin;
            const {token , social, role} = action.payload;
            const loginInfo = {"token":token,"userId":"kakao_or_naver","social": social,"isLogin":state.isLogin, "role": role || []}
            localStorage.setItem("loginInfo",JSON.stringify(loginInfo));
        }
    }
}) 

export const { login,logout,socialLogin }
    = authSlice.actions

export default authSlice.reducer

