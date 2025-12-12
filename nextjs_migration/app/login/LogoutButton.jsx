"use client"

import Link from "next/link";
import Swal from "sweetalert2";
import {useAuthStore} from "@/store/authStore";
import {refreshCsrfToken} from "@/utils/csrf/manageCsrfToken";

export function LogoutButton(){


    const userId = useAuthStore((s) => s.userId);
    const isLogin = useAuthStore((s) => s.isLogin);
    console.log("userId :: >>" +userId)
    const handleLogOut= async () =>{
        if(sessionStorage.getItem("social")){
            await Swal.fire({icon: 'info',text :"소셜상태에서 로그아웃 하셨습니다."});
        }
        else{

        }
        // dispatch(getLogout());->
        localStorage.removeItem("loginInfo");
        sessionStorage.removeItem("social");
        await refreshCsrfToken();
        await Swal.fire({icon: 'info',text :"로그아웃 하셨습니다."});
        // await logout(); -- 기종씨가 입력하신 함수
        // navigate('/');
    }

    return(
        <>
            {isLogin?
                <>
                    <h1>로그인 상태</h1>
                    <Link href="/">홈</Link>
                    <button onClick={handleLogOut}>로그아웃</button>
                </>:
                <h1>비 로그인 상태</h1>}
        </>
    )
}