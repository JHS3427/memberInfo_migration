"use client"
/*
설명 : 로그인을 위한 페이지입니다
    소셜 로그인의 경우 현재 백엔드로 가는 길을 막기 위해 무력화시켜둔 상태입니다.
    일반 로그인의 경우 아이디(test), 비밀번호(1234)를 입력하면 islogin=true로 바뀌고, 이에따라 페이지 하단이 변경됩니다.
*/

/*
 나중에 반드시 인터셉터쪽 다시 보고, 문제가 될만한게 있는지 확인해보기
 */

import Swal from 'sweetalert2';
// import '../styles/loginpage.css';
import {useState,useRef,useEffect} from 'react';
import { getLogin,randomString8to16,getLogout} from "@/utils/authAPI";
import Link from 'next/link';
import {useAuthStore} from "@/store/authStore";
// import { useDispatch,useSelector } from 'react-redux';
// import { Link,useLocation,useNavigate } from 'react-router-dom';
// import { useAuth } from "../feature/auth/authContext";
export default function Login() {
    // const navigate=useNavigate();
    // const location = useLocation();
    // const state = location.state;
    // const initialized = useRef(false);
    // const { login, logout } = useAuth();

    //구버전에서는 소셜 로그인 후 세션 아이디를 발급 받았음
    //마이그레이션 버젼에선 JWT로 진행 + 전역변수 저장 및 페이지 이동을 auth.jsx에서 진행
    // useEffect(() => {//소셜 로그인 시 자동 로그인을 통해 세션 아이디 발급받기.
    //     if(!initialized.current)
    //     {
    //         initialized.current = true;
    //         console.log("attemptAutoLogin");
    //         if(state)
    //         {
    //             const autoauthjwToken = state.authjwToken; // state에서 authjwToken 추출.
    //             const param = null;
    //             const autoFormData = {uid : autoauthjwToken , socialDupl: true}
    //
    //             const attemptAutoLogin = async () => {
    //                 console.log("attemptAutoLogin123123123");
    //                 const success = await dispatch(getLogin(autoFormData, param));
    //                 if (success) {
    //                     console.log("lego");
    //                     navigate('/');
    //                 }
    //                 else {
    //                     console.log("attemptfail");
    //                     Swal.fire({icon: 'error',text :"소셜로그인 실패. 재시도 부탁드립니다."})
    //                     navigate('/login');
    //                 }
    //             }
    //             attemptAutoLogin();
    //         }
    //     }
    // },[location.state]);

    //플랫폼에 oauth 요청을 위한 필요 정보 값.
    const Rest_api_key='ef9794cb2ff6a12a26f6432f5ec9a04b';//카카오 EST API KEY
    const NAVER_CLIENT_ID = "qxdiERkzD3t06kqHGYdp"; // 네이버 발급받은 Client ID
    const GOOGLE_CLIENT_ID = "308480962204-8kq5mtbgf2o8fk1stqa7tdv72kmrm5rq.apps.googleusercontent.com"; // 네이버 발급받은 Client ID
    const STATE = randomString8to16();
    const [redirect_uri,setRedirect_uri] = useState("");
    const isLogin= useAuthStore((s)=>s.isLogin);
    const [kakaoURL,setKakaoURL]=useState("");
    const [NAVER_AUTH_URL,setNaverURL]=useState("");
    const [GOOGLE_AUTH_URL,setGoogleURL]=useState("");

    useEffect(() => {
        const hostName = new URL(window.location.href).hostname;
        let urldata=""
        if(hostName==="localhost")
        {
            urldata='http://localhost:3000/auth';
        }
        else{
            urldata='http://'+hostName+':3000/auth';
        }
        //Redirect URI
        //변수 할당 하는 이유 : useState가 비동기라서 변수 할당 안하고 쓰면 조건문 무시하고
        //밑에서 아무것도 없는 빈값을 url로 쓸수 있음. 하지만 이렇게 하면 한번 거쳐가야해서 데이터 잘 들어감.
        setRedirect_uri(urldata);

        setKakaoURL(`https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`);
        setNaverURL(`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${redirect_uri}`);
        setGoogleURL(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=token&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`);
    }, []);


    // 플랫폼별 oauth 요청 URL
    //로그인 여부 확인
    // const isLogin = useSelector((state)=>state.auth.isLogin)

    //소셜로그인이 아닌 일반 로그인을 위한 값 세팅.
    const initialsetting = {uid:"",upass : ""};//이쪽은 param이 null이 아니라 socialDupl 넣을 필요 없다
    const [formData,setFormData] = useState(initialsetting);
    const [errors,setErrors] = useState(initialsetting);
    const idRef = useRef(null);
    const passRef = useRef(null);
    // const dispatch = useDispatch();

    const handleSocialLogin = (e)=>{
        const flatformName = e.target.id;
        if(flatformName === "kakao")
        {
            sessionStorage.setItem("social","kakao");
            window.location.href = kakaoURL;
        }
        else if (flatformName === "naver")
        {
            sessionStorage.setItem("social","naver");
            window.location.href = NAVER_AUTH_URL;
        }
        else if (flatformName === "google")
        {
            sessionStorage.setItem("social","google");
            window.location.href = GOOGLE_AUTH_URL;
        }
    }

    //로그인 페이지에 직접 입력하는 경우 칸에 값이 입력됨에 따라 변화함을 감지
    const handleformchange=(e)=>{
        const{name,value} = e.target;
        setFormData({...formData,[name]:value});
        setErrors(initialsetting)
        // console.log(formData.id);
        // console.log(formData.pass);
    }

    //제출버튼을 누르면 변화 발생.
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const param = {
            idRef : idRef,
            passRef : passRef,
            setErrors : setErrors,
            errors : errors
        }
        const succ = await getLogin(formData,param);
        console.log(succ)
        if(succ)
        {
            // await login(); -- 기종씨가 입력하신 함수
            // navigate('/');
        }
        else{
            await Swal.fire({icon: 'error',text : "로그인에 실패. 확인후 다시 진행해주세요."});
            setFormData({uid:"", upass:""});
            idRef.current.focus();
        }

    }
    const handleLogOut= async () =>{
        if(sessionStorage.getItem("social")){
            await Swal.fire({icon: 'info',text :"소셜상태에서 로그아웃 하셨습니다."});
        }
        else{

        }
        // dispatch(getLogout());
        await Swal.fire({icon: 'info',text :"로그아웃 하셨습니다."});
        // await logout(); -- 기종씨가 입력하신 함수
        sessionStorage.removeItem("social");
        // navigate('/');
    }
    return (
        <>
            <div className='loginCenter'>
                <div className='loginAllBox'>
                    <ul>
                        <h1 className = "LoginPage">로그인 페이지</h1>
                        <form onSubmit={handleLoginSubmit}>
                            <li>
                                <div className='loginDataBox'>아이디 : <input type="text"
                                                                           name="uid"
                                                                           onChange={handleformchange}
                                                                           ref = {idRef}
                                                                           placeholder='아이디'/>
                                </div>
                            </li>
                            <li>
                                <div className='loginDataBox'>비밀번호 : <input type="password"
                                                                            name="upass"
                                                                            onChange={handleformchange}
                                                                            ref= {passRef}
                                                                            placeholder='비밀번호'/>
                                </div>
                            </li>
                            <ul>
                                <li><button type = "submit">로그인</button></li>
                                <li><button type = "reset">비우기</button></li>
                            </ul>
                        </form>
                    </ul>
                    <div>
                        <h2 className = "OuterLoginPage">외부 로그인</h2>
                        <div className='socialButtonWrapper'>
                            <button onClick={handleSocialLogin} id = "kakao">카카오 로그인</button>
                            <button onClick={handleSocialLogin} id = "naver">네이버 로그인</button>
                            <button onClick={handleSocialLogin} id = "google">구글 로그인</button>
                        </div>
                    </div>
                    <>
                        {isLogin?
                            <>
                                <h1>로그인 상태</h1>
                                <Link href="/">홈</Link>
                                <button onClick={handleLogOut}>로그아웃</button>
                            </>:
                            <h1>비 로그인 상태</h1>}
                    </>
                </div>
                {/*<div className='loginBottomLinks'>*/}
                {/*    <Link href="/signUp" className='loginLinkBtn'>회원가입</Link>*/}
                {/*    <Link href="/IdPwSearch"*/}
                {/*          className='loginLinkBtn'*/}
                {/*          state={{ type: 'findId' }}>아이디 찾기</Link>*/}
                {/*    <Link href="/IdPwSearch"*/}
                {/*          className='loginLinkBtn'*/}
                {/*          state={{ type: 'changePass'}}>비밀번호 찾기</Link>*/}
                {/*</div>*/}
            </div>
        </>
    );
}