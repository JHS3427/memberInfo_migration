import axios from 'axios';

/*
    조해성 
    설명 : 빈칸으로 제출하는 경우 아이디 또는 로그인 창에 focus를 주며 에러를 띄움
*/
export const validateFormCheck = ({idRef,passRef,setErrors,errors}) => {
    if(idRef.current.value===""){
        setErrors({...errors,id:"아이디를 입력하세요"})
        idRef.current.focus();
        return false;
    }
    else if(passRef.current.value===""){
        setErrors({...errors,pass:"비밀번호를 입력하세요"})
        passRef.current.focus();
        return false;
    }
    return true;    
}

/* 
    조해성
    설명 : axios의 post 함수를 이용하여 post 방식으로 타 사이트에 접속하고,
    그 결과를 받아오는 함수입니다.
*/
export const axiosPost = async(url,formData) =>{
    const response = await axios.post(url,formData,{"Content-Type":"application/json"});
    return response.data;
} 