import { login, logout,socialLogin } from './authSlice.js';
import { validateFormCheck,axiosPost } from "../../utils/validate.js";
import { useDaumPostcodePopup } from 'react-daum-postcode'; // 주소 찾기 관련 import
import { refreshCsrfToken} from '../csrf/manageCsrfToken.js';
import { useNavigate } from "react-router-dom";
// export const getLogin = (formData, param) => async(dispatch) => {
//     if(validateFormCheck(param)) {
//         if("test" === formData.id && "1234" === formData.pass) {
//             dispatch(login({"userId": formData.id}));
//             return true;
//         }
//     }
//     return false;
// }

//Login.jsx에서 사용
export const getLogin = (formData,param) => async(dispatch) => {
    if(param==null)//소셜로그인을 이용한 자동 로그인인 경우
    {
        const url = "/auth/login";
        console.log("formData : >> :",formData);
        const result = await axiosPost(url,formData); //axios라 await 안걸면 promise pending이 뜰 수 있다.
        if(result.login)
        {
            //"로그인 성공"
            dispatch(login({"userId":result.userId,"isSocial":true,"role":result.role}));
            await refreshCsrfToken();

            //장바구니 갯수를 카운트하는 함수 호출
//            const count = await getCartCount(formData.id);
            // dispatch(getCartCount(formData.id)) -해제 예정
            return true;
        }
    }
    else{
        if(validateFormCheck(param))
        {
            const url = "/auth/login";
            const result = await axiosPost(url,formData); //axios라 await 안걸면 promise pending이 뜰 수 있다.
            if(result.login)
            {
                await refreshCsrfToken();
                //"로그인 성공"
                dispatch(login({"userId":result.userId,"isSocial":false,"role":result.role}));

                //장바구니 갯수를 카운트하는 함수 호출
    //            const count = await getCartCount(formData.id);
                // dispatch(getCartCount(formData.id)) -해제 예정
                return true;
            }
        }
    }
    return false;
}


export const getLogout = () => async(dispatch) => {
    const url = "/auth/logout";
    const result = await axiosPost(url, {});
    if(result) {
        await refreshCsrfToken();
        dispatch(logout());
    }

    return result;
}

export const getInfo = async (JsonData) => {
    const url = "/auth/info";
    console.log("JsonData :  ", JsonData);
    const result = await axiosPost(url,JsonData);
    console.log("comingData :  ", result);
    return result;
}


//Auth.jsx 사용
/*
조해성
함수 설명 : 프론트에서 받은 인가 코드와 해당 플랫폼 이름을
            백엔드로 전달하여 토큰을 받아오는 함수입니다.*/
export const getsocialtoken = async(token_json,social) =>{
    const hostName = new URL(window.location.href).hostname;
    const json_code = {"authCode": token_json,"social":social, "hostName" : hostName};
    const url = "/auth/token";
    const authtoken = await axiosPost(url,json_code);//authtoken이 dto객체 받음.
    console.log("authtoken : ", authtoken );
    return authtoken;
    // dispatch(socialLogin({"token":authtoken,"social":social}));테스트를 위해 임시 차단
}

//SignUp.jsx 사용
//현재 회원가입 페이지에서 사용중. 이후 개인정보 페이지의 수정항목에 재차 사용 예정
/* 주소찾기 관련 코드 모음  ---------------------------------------------> */
export const usePostCode= (formData,setFormData)=>{
    const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    const open = useDaumPostcodePopup(postcodeScriptUrl);

    const handleComplete = (data) => {
    let fullAddress = data.address;
    let placezonecode = data.zonecode;
    let extraAddress = '';
    let localAddress = data.sido + ' ' + data.sigungu;

    if (data.addressType === 'R') {
        if (data.bname !== '') {
            extraAddress += data.bname;
        }
        if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
        }
        // fullAddress = fullAddress.replace(localAddress, '');
        fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    setFormData({...formData,  mainAddress : fullAddress, postcode: placezonecode})
    };
    const handleClick = () => {
    open({ onComplete: handleComplete });
    };

    return {handleClick}
}
/*--------------------------------------------->주소찾기 관련 코드 모음  끝 */

//SignUp.jsx 사용
export const idDuplCheck = async(incomeId) => {
    const url = "/auth/idDuplCheck";
    const json_id = {"uid":incomeId}
    const dupleTorF = await axiosPost(url,json_id)
    return dupleTorF;
}

//SignUp.jsx 사용
export const sendSignUpData = async(formData) =>
{
    console.log(formData)
    let emailAddress_full = "";
    if(formData.emailList==="default"){
        emailAddress_full = formData.emailAddress;
    }
    else{
        emailAddress_full = formData.emailAddress + "@" + formData.emailList;
    }
    const signUpData = {
        uid : formData.id,
        upass : formData.pass,
        uname : formData.name,
        uage : formData.age,
        ugender : formData.gender,
        uaddress : formData.mainAddress+ " " +formData.detailAddress,
        postcode : formData.postcode,
        uemail : emailAddress_full,
        uphone : formData.phone,
        jwToken : formData.jwToken,
        socialDupl : formData.socialDupl
    }
    
    const url = "/auth/signup";
    console.log("signUpData:>>>>>",signUpData);
    if(signUpData.socialDupl){console.log("signUpData.socialDupl:>>>>>true");}
    else{console.log("signUpData.socialDupl:>>>>>false");}
    const signUpResult = await axiosPost(url,signUpData)
}

export const randomString8to16 = () =>{

  // 사용 가능한 문자 집합: 대문자, 소문자, 숫자
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // 최소 길이 8, 최대 길이 16
  const minLength = 8;
  const maxLength = 16;

  // 8~16 사이의 무작위 길이 결정
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  let result = '';
  const charactersLength = characters.length;

  // 결정된 길이만큼 무작위 문자열 생성
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const updateUser = async (newUserData) =>{
    
    const url = "/auth/updateUser";
    console.log(newUserData)
    if(newUserData["uaddress_main"]!="" && newUserData["uaddress_main"]!=null)
    {
        newUserData["postcode"]=newUserData["uaddress_main"].split(" *** ")[1]
        newUserData["uaddress_main"]=newUserData["uaddress_main"].split(" *** ")[0]
        newUserData["uaddress"] = newUserData.uaddress_main + " " + newUserData.uaddress_sub;
    }
    console.log("update newUserData:>>>>>",newUserData);    
    for( const [key, value] of Object.entries(newUserData))
        {
            if(newUserData[key]==="")
            {
                newUserData[key]=null;
            }
        }
    console.log("newUserDatanewUserDatanewUserDatanewUserData")
    
    console.log(newUserData)
    const signUpResult = await axiosPost(url,newUserData)
    if(signUpResult){
        console.log("newUserData.includedId >>>>",newUserData.uid)
        const loginInfo = { "userId":newUserData.uid, "isLogin":true};
        localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
    }

    return 1;//어차피 1 반환함
}

export const IdDrop = async(dropUserData)=>{
    const url = "/auth/iddrop";
    const idDropResult = await axiosPost(url,dropUserData)
    console.log("ID delete end");

    return null;
}

export const SearchingUserInfo = async(searchUserInfo) =>{
    console.log("SearchingUserInfo : >>", searchUserInfo);
    const url = "/auth/searchuserinfo";
    const result = await axiosPost(url,searchUserInfo);
    
    // return true;
    return result;   
}

export const sendingAuthCode = async(searchUserInfo)=>{
    console.log("SearchingUserInfo : >>", searchUserInfo);
    const url = "/auth/compareauthcode";
    const result = await axiosPost(url,searchUserInfo);
    console.log(result)
    return result;
}