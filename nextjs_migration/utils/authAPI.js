import { validateFormCheck,  validateSignupFormCheck } from '@/utils/validate.js';
import {axiosPost} from "@/utils/dataFetch";
import {refreshCsrfToken} from "@/utils/csrf/manageCsrfToken";

/** Login */
export const getLogin = async(formData, param) => {
    if(validateFormCheck(param)) {
        const url = "/auth/login";
        const result = await axiosPost(url, formData);
        await refreshCsrfToken();
        console.log(result);
        return result;
    }
    return false;
}

/** Logout */
export const getLogout = async()  => {
    const url = "/auth/logout";
    const result = await axiosPost(url, {});
    return result;
}

/** Signup */
export const getSignup = async (formData, param) =>  {
    console.log(formData, param);
    let result = null;
    if(validateSignupFormCheck(param)) {
        const url = "/member/signup";
        result = await axiosPost(url, formData);
    }
    return result;
}

/** Id 중복 체크 */
export const getIdCheck = async(id) =>  {
    const data = { "id": id };
    const url = "/member/idcheck";
    const result = await axiosPost(url, data);
    return result;
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
