/*
    조해성
    설명 : 소셜 로그인 성공 후 플랫폼이 전달해준 인가코드를 수령하고( const code 부분)
    이를 authAPI.js의 getkakaotoken에 전달. -> 이후 백엔드에서 토큰 수령
    후일 개선 사항 : 1) 카카오를 제외한 타 플랫폼이 카카오와 다른경우 추가 예정. 만약 동일한 경우 함수명 변경
                    2) 일반 로그인에서 인증 관련 내용이 필요한 경우, 이곳에서 진행 예정(미정).
    */

import { useEffect } from "react";
import { getsocialtoken } from "../feature/auth/authAPI.js";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

export function Auth(){

    const navigate=useNavigate()
    const dispatch=useDispatch();
    let code = new URL(window.location.href).searchParams.get("code");
    const social = sessionStorage.getItem('social');
    if(code != null)//카카오나 네이버는 이거로 코드 수집 가능
    {
        console.log("authcode:123 ",code);
    }
    else{
        code = window.location.hash;
        code = code.substring(code.indexOf('=')+1,code.indexOf('&'))
        console.log("authcode:123123123 ",code);
    }
    console.log("authcode: ",code);
    
    useEffect(()=>{
        const handleSocialtoken = async () =>{
            const authtoken = await getsocialtoken(code,social);
            console.log("authtoken_auth",authtoken.uid,authtoken.pass)
            if(authtoken.socialDupl)//중복값이 있다 = 이미 등록된 아이디이다.
            {
                navigate('/login',{
                                      state: {
                                          // 전달하려는 데이터를 객체 형태로 지정합니다.
                                          // authtoken 객체 전체를 전달하거나, uid만 전달할 수 있습니다.
                                          authjwToken: authtoken.jwToken,
                                      }
                                  });
            }
            else
            {
                navigate('/socialsignUp',{
                                             state: {
                                                 // 전달하려는 데이터를 객체 형태로 지정합니다.
                                                 // authtoken 객체 전체를 전달하거나, uid만 전달할 수 있습니다.
                                                 authjwToken: authtoken.jwToken,
                                                 authsocialDupl:authtoken.socialDupl
                                             }
                                         });
            }
        };
        handleSocialtoken();
    },[])

    return(<></>);
}