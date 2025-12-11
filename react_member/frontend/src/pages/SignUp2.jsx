
import Swal from 'sweetalert2';
import '../styles/signup.css';
import React, {useState,useMemo, useRef} from 'react'
import { usePostCode, idDuplCheck, sendSignUpData, randomString8to16} from '../feature/auth/authAPI';
import { useLocation,useNavigate } from 'react-router-dom';
import { SignUp_InputBox } from '../components/auth/SignUp/InputBox/SignUp_InputBox';
import { SignUp_GenderSelect } from '../components/auth/SignUp/Gender/SignUp_GenderSelect';
import {SignUp_PostCodeBox} from '../components/auth/SignUp/Postcode/SignUp_PostCodeBox'
import { SignUp_EmailSelect } from '../components/auth/SignUp/Email/SignUp_EmailSelect';
import { SignUp_EmailSection } from '../components/auth/SignUp/Email/SignUp_EmailSection';
import {SignUp_Label} from '../components/auth/SignUp/InputBox/SignUp_Lable'

export const SignUp2 = ({excludeItems=[]}) => {
    // 소셜로그인인 경우 아이디 비번 제거를 위해 선언
    // showIdPass==true 인 경우 : 소셜 로그인 아님 ||| showIdPass==false 인 경우 : 소셜 로그인임
    const showIdPass = !excludeItems.includes('social');

    const location = useLocation();
    const { authjwToken,authsocialDupl } = location.state || {};
    const randompassword = randomString8to16();
    const navigate=useNavigate();

    const initialArray = showIdPass?
                        {id : "", pass : "", passcheck:"", name : "", age:"",
                            gender:"",mainAddress:"",postcode:"", detailAddress:"", emailAddress:"",
                            emailList:"default", phone:"", jwToken:true, socialDupl : true} :
                        {id : "", pass : "", passcheck:"", name : "", age:"",
                            gender:"",mainAddress:"",postcode:"", detailAddress:"", emailAddress:"",
                            emailList:"default", phone:"", jwToken: authjwToken, socialDupl : authsocialDupl};



  //초기값 세팅을 위한 initialArray선언 및 초기값 선언
    const [formData, setFormData]=useState(initialArray);
    const [placeholderJudge, setPlaceholderJudge] = useState(initialArray);
    const [passLook,setPassLook] = useState(false);
    const passInputType = passLook ? "text" : "password"; // 패스워드 보이기 안보이기 설정용
    const [idDupl,setIdDupl] = useState(false)

    const inputRefs = useMemo(() => {// reduce를 사용하여 각 키값에 대응하는 Ref 객체 생성.
        const keys = Object.keys(initialArray);         
        return keys.reduce((acc, currentKey) => {
            // 필드이름+Ref : ref값 생성
            acc[`${currentKey}Ref`] = React.createRef();
            return acc;
        }, {});
    }, []);

    // 주소값을 가져오기 위한 선언 - authAPI
    const {handleClick} = usePostCode(formData, setFormData);


//입력, 마우스 클릭, 마우스 떼기 등 진행 시 변화 감지 코드
    const handleChange = (e) =>{
        const {name,value} = e.target;
        setFormData({...formData,  [name] : value})
        if(name === "id")
        {
        setIdDupl(false);//아이디 값이 새로 입력될 경우 중복확인 다시 하게 만듬.
        }
        else if(name === "age")//나이는 숫자만 입력받음
        {
            const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
            setFormData({...formData,  [name] : onlyNumbers})
        }
        else if(name ==="phone")
        {
        // 1. 입력된 값에서 숫자만 추출
            const onlyNumbers = value.replace(/[^0-9]/g, '');
            let formattedValue = onlyNumbers;

            // 2. 최대 11자리까지만 처리 (ex: 01012345678)
            const maxLength = 11;
            const slicedNumbers = onlyNumbers.slice(0, maxLength);

            // 3. 추출된 숫자의 길이에 따라 하이픈 자동 삽입 (3-4-4 패턴)
            if (slicedNumbers.length > 3 && slicedNumbers.length <= 7) {
                // 4자리 ~ 7자리: 000-0000 패턴
                formattedValue = `${slicedNumbers.slice(0, 3)}-${slicedNumbers.slice(3)}`;
            } else if (slicedNumbers.length > 7) {
                // 8자리 ~ 11자리: 000-0000-0000 패턴
                formattedValue = `${slicedNumbers.slice(0, 3)}-${slicedNumbers.slice(3, 7)}-${slicedNumbers.slice(7)}`;
            }
            
            // 폼 데이터에 하이픈이 삽입된 값으로 설정
            setFormData({...formData,  [name] : formattedValue});
        }
    // console.log(formData)
    }

    const focusIn = (e) =>{
        const {name} = e.target;
        setPlaceholderJudge({...placeholderJudge,  [name] : "true"})
    }

    const focusOut= (e) =>{
        const {name} = e.target;
        setPlaceholderJudge({...placeholderJudge,  [name] : "aftertrue"})
    }

  //아이디 중복확인 버튼
    const IdDupleCheck = async() => {
        const duplResult = await idDuplCheck(formData.id);
        
        if(!duplResult){//duplResult=true면 중복있음, false면 중복없음
            //!duplResult은 중복이 없을때 true가 됨
            setIdDupl(true);
        }
        else{
            formData.id="";
            Swal.fire({icon: 'error', text:"아이디 중복! 다시 입력해주세요"});
            inputRefs.idRef.current.focus();
        }
    }


    // 제출버튼을 누를 경우 빈값 확인 후 필수 요소에 빈값이 있는 경우 경보 발동
    // 비밀번호가 다를 경우 경보 발동
     // 이후 입력받은 정보들을 백으로 전달 예정-현재(11.03) 미구현
    const signupOnSubmit = (e) =>{
        e.preventDefault();
        // console.log(formData);
        const keys = Object.keys(initialArray)

        //필수 입력 항목을 key값으로, 해당 항목이 비었을 때의 출력 값을 value로 갖는 배열 생성
        const mainKey=showIdPass?
            {"id":"아이디","pass":"비밀번호",
            "passcheck":"비밀번호 확인","name":"이름",
            "age":"나이","gender":"성별",
            "mainAddress":"도로명 주소","detailAddress":"상세 주소"}
            :
            {"name":"이름",
            "age":"나이","gender":"성별",
            "mainAddress":"도로명 주소","detailAddress":"상세 주소"};
        let mainAlertMessage = "";
        for (const key of keys){
            const value = formData[key];
            if(value===""){
                if(Object.keys(mainKey).includes(key)){
                mainAlertMessage=mainAlertMessage+mainKey[key]+" 값이 비었습니다.\n";
                }
            }
        }
        //비밀번호와 비밀번호 확인란 차이 확인
        if(showIdPass && (formData.pass !== formData.passcheck))
        {
            mainAlertMessage = mainAlertMessage+"\n비밀번호가 다릅니다. 확인해주세요."
        }
        if(!idDupl && showIdPass){//중복확인 통과시 문제없음. 안했거나 통과 못하면 경고 메시지
            mainAlertMessage = mainAlertMessage+"\n아이디 중복확인을 해주세요."
        }

        // console.log("newEmptyCheck : ",newEmptyCheck);
        //경보 메세지가 비어있지 않을 경우(필수 입력 항목이 비었거나 비밀번호가 다른 경우) 경보 메세지 출력
        if(mainAlertMessage!=""){
            Swal.fire({icon: 'error', html:mainAlertMessage.replace(/\n/g,'<br/>')});
        }
        else{
            sendSignUpData(formData);
            Swal.fire({icon: 'info', text:"가입 완료. 홈페이지로 돌아갑니다"})
            navigate('/')
        }
    }

  //리셋 버튼. 누르면 전부 초기화
    const resetButton =(e)=>{
        setFormData(initialArray);
        setPlaceholderJudge(initialArray);
    }

    const stringPlacer = {
        id : ["ID를 입력해주세요","ID를 입력하셨습니다"], 
        pass : ["비밀번호를 입력해주세요","비밀번호를 입력하셨습니다"], 
        passcheck:["비밀번호를 똑같이 입력해주세요","비밀번호가 다릅니다","비밀번호를 똑같이 입력하셨습니다","비밀번호가 비었습니다"], 
        name : ["이름을 입력해주세요","이름을 입력하셨습니다"], 
        age:["나이를 입력해주세요","나이를 입력하셨습니다"], 
        gender:"", 
        detailAddress:["상세 주소를 입력해주세요","상세 주소를 입력하셨습니다"], 
        emailAddress:["이메일 주소를 입력해주세요","이메일 주소를 입력하셨습니다"], 
        phone:["전화번호를 입력해주세요","전화번호를 입력하셨습니다"]
    }



    const sharedData = {
        "formData":formData,
        "focusIn":focusIn,
        "focusOut":focusOut,
        "handleChange":handleChange,
        "placeholderJudge" :  placeholderJudge,
        "inputRefs" : inputRefs,
        "stringPlacer" : stringPlacer
    }



    return (
    <>
    <form onSubmit={signupOnSubmit}>
      <div className="SignUpPage">
        <h1 className="SignTitle">회원가입 페이지입니다.</h1>
        { showIdPass &&
        <>
            <div className = "IdPassSection">
            <h3>반드시 입력해주세요</h3>
            <h1 className="IdPassTitle">접속 정보란입니다</h1>
            <div className="IdBox">
              <div className='ConsoleBoxWrapper'>
                <SignUp_InputBox id="id" type="text" name="id" {...sharedData}/>
                <SignUp_Label id="id" {...sharedData}/>
              </div>
                {idDupl?
                <button type='button' className = 'IdDuplCheck'>중복확인 성공</button>:
                <button type='button' className = 'IdDuplCheck' onClick={IdDupleCheck}>중복확인</button>}
            </div>
            <div className="PassBox">
                {/* passLook의 값에따라 비밀번호 형식 또는 문자열 형식 표시 */}
                <div className='ConsoleBoxWrapper'>
                  <SignUp_InputBox id="pass" type={passInputType} name="pass" {...sharedData}/>
                  <SignUp_Label id="pass" {...sharedData}/>
                </div>
                <div className='ConsoleBoxWrapper'>
                  <SignUp_InputBox id="passcheck" type={passInputType} name="passcheck" {...sharedData}/>
                  <SignUp_Label id="passcheck" {...sharedData}/>
                </div>
                {passLook?
                <button 
                type='button'
                className = 'passlook' onClick={()=>setPassLook(!passLook)}>비밀번호 가리기</button>:
                <button 
                type='button'
                className = 'passlook' onClick={()=>setPassLook(!passLook)}>비밀번호 확인</button>}
                
            </div>
            </div>
        </>
        }
        <div className= "PrivateInfoSection">
          <h3>반드시 입력 및 선택해주세요</h3>
          <h1>개인 정보란 입니다</h1>
          <div className = "PrivateInfoBox">
            <div className='ConsoleBoxWrapper'>
              <SignUp_InputBox id="name" type="text" name="name" {...sharedData}/>
              <SignUp_Label id="name" {...sharedData}/>
            </div>
            <div className='ConsoleBoxWrapper'>
              <SignUp_InputBox id="age" type="text" name="age" {...sharedData}/>
              <SignUp_Label id="age" {...sharedData}/>
            </div>
            <SignUp_GenderSelect formData={formData} handleChange={handleChange}/>
            <SignUp_PostCodeBox formData={formData} setFormData={setFormData}/>
            <div className='ConsoleBoxWrapper'>
              <SignUp_InputBox id="detailAddress" type="text" name="detailAddress" {...sharedData}/>
              <SignUp_Label id="detailAddress" {...sharedData}/>
            </div>
          </div>
        </div>
        <div className = "PrivateConnInfoSection">
          <h1>연락처를 작성해주세요</h1>
          <div className = "PrivateConnInfoBox">
            <SignUp_EmailSection formData ={formData} handleChange={handleChange} sharedData={sharedData}/>
            <div className='ConsoleBoxWrapper'>
              <SignUp_InputBox id="phone" type="text" name="phone" {...sharedData}/>
              <SignUp_Label id="phone" {...sharedData}/>
            </div>
          </div>
        </div>
      </div>
      <div className="lastButtoBox">
        <div className="lastButton">
          <button type='reset' onClick={resetButton}>리셋</button>
          <button type='submit'>제출</button>
        </div>
      </div>
    </form>
    </>
  );
}