
import Swal from 'sweetalert2';
import { useLocation,useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import {IdPwSearch_selectTab } from "../components/auth/IdPwSearch/IdPwSearch_selectTab"
import '../styles/IdPwSearch.css';
import { SearchingUserInfo , sendingAuthCode, updateUser} from "../feature/auth/authAPI";
import { IdPwSearch_findId } from "../components/auth/IdPwSearch/IdPwSearch_findId";
import { IdPwSearch_AuthcodeInput } from "../components/auth/IdPwSearch/IdPwSearch_AuthcodeInput";
import { IdPwSearch_passChange } from "../components/auth/IdPwSearch/IdPwSearch_passChange";




export function IdPwSearch(){

  const location = useLocation();
  
  const searchUserinfoInit = {"uemail" : null, "uname":null,"uid":null,"selectedTap":null,"authCodeIdPw":null,"upass":null,"upassCheck":null}
  // location.state 객체에서 type 값을 구조 분해 할당으로 가져옴
  const { type } = location.state
  const [pageType, setPageType] = useState(type);
  const [searchUserinfo,setSearchUserinfo] = useState(searchUserinfoInit);
  const [inputLevel,setInputLevel] = useState({"searchingInfo":true,"authcodeInput":null,"showOrChange":null})
  const [finalData,setFinalData] = useState(null);
  const [startTime, setStartTime] = useState(null);//인가코드 발급받고 5분재서 넘으면 되돌려보낼 예정.
  const DURATION_LIMIT = 5 * 60 * 1000; // 5(분단위) * 60(초단위) * 1000(밀리초)
  const navigate = useNavigate();

  const pageTypeChange = (newPageType) => {
    setPageType(newPageType);
    setSearchUserinfo(searchUserinfoInit);//탭 변경시 인풋박스 초기화
    setInputLevel(prev=>({...prev,["searchingInfo"]:true}))
    setInputLevel(prev=>({...prev,["authcodeInput"]:null}))
    setInputLevel(prev=>({...prev,["showOrChange"]:null}))
  }

  const handleInfo = (name,value) => {
    setSearchUserinfo(prev=>({...prev,[name]:value}))
  }
  
  const handleselectedTap = (value) => {
    setSearchUserinfo(prev=>({...prev,["selectedTap"]:value}))//이거로 변경이 일어나서 useEffect 발동되고 저장된 정보를 백으로 이동시킴
  }

  const sendingUserInfo = async() =>{
    if(await SearchingUserInfo(searchUserinfo))
    {
        if(inputLevel.searchingInfo)
        {
            setInputLevel(prev=>({...prev,["searchingInfo"]:null}))
            setInputLevel(prev=>({...prev,["authcodeInput"]:true}))
            setInputLevel(prev=>({...prev,["showOrChange"]:null}))
            //여기에 백에서 메일 쏘는거 입력
            console.log("sendingUserInfo : ??");
            console.log(searchUserinfo)
            
            setStartTime(Date.now());//인증코드 유효시간 측정용
            
            Swal.fire({icon: 'info',text :"메일을 보냈습니다. 확인 후 입력해보세요."});
        }
    }
    else{
        Swal.fire({icon: 'error',text :"해당 정보와 일치하는 계정이 없습니다. 다시 한번 입력값을 확인 후 입력하세요."});
        setSearchUserinfo(prev=>({...prev,["selectedTap"]:null}))
    }
  }

  const sendingAuth = async() =>{
    const result = await sendingAuthCode(searchUserinfo);
    const current = Date.now();
    if(current-startTime<=DURATION_LIMIT)
    {
        if(result != "wrong or late")
        {
            setFinalData(result)
            console.log("finaldata : " + finalData )
            //시간초를 설정하고, 시간초 지나서 입력이 들어오거나 맞으면 아래 실행해서 틀렸는지 맞았는지 알려주기?
            setInputLevel(prev=>({...prev,["searchingInfo"]:null}))
            setInputLevel(prev=>({...prev,["authcodeInput"]:null}))
            setInputLevel(prev=>({...prev,["showOrChange"]:true}))
        }
        else
        {
            const lefttime = DURATION_LIMIT-(current-startTime);
            const totalleftsec = Math.floor(lefttime/1000);
            const leftmin = Math.floor(totalleftsec/60);
            const leftsec = totalleftsec - (60* Math.floor(totalleftsec/60));
            Swal.fire({icon:"warning",text:`인증코드가 틀렸습니다. 제한시간은 ${leftmin}분 ${leftsec}초 남았습니다.`})
        }
    }
    else
    {
        //바깥에 새로고침을 두니 비동기 문제가 생겨서 .then으로 작동시킴
        Swal.fire({icon:"error",text:`시간초과, 처음부터 다시 부탁드립니다.`}).then(()=>{window.location.reload();})        
    }
  }

  useEffect(()=>{
    if(searchUserinfo.selectedTap === "Id" || searchUserinfo.selectedTap === "Pw")
    {
        sendingUserInfo();
        setSearchUserinfo(prev=>({...prev,["selectedTap"]:null}))//여러번 누를수도 있으니까 초기화
    }
    else if(searchUserinfo.selectedTap === "Auth")
    {
        sendingAuth();
        setSearchUserinfo(prev=>({...prev,["selectedTap"]:null}))//여러번 누를수도 있으니까 초기화
    }
    else if(searchUserinfo.selectedTap === "passCheck")
    {
        if(searchUserinfo.upass!=searchUserinfo.upassCheck)
        {
            setSearchUserinfo(prev=>({...prev,["upass"]:null}))
            setSearchUserinfo(prev=>({...prev,["upassCheck"]:null}))
        }
        else
        {
            updateUser(searchUserinfo);
            Swal.fire({icon: 'info',text :"비밀번호가 변경되었습니다. 메인화면으로 돌아갑니다."});
            navigate("/");
        }
        setSearchUserinfo(prev=>({...prev,["selectedTap"]:null}))//여러번 누를수도 있으니까 초기화
    }
  },[searchUserinfo.selectedTap])

    // useEffect(() => {//startTime 잘 찍히나 확인용
    //     if (startTime) {
    //         const dateObject = new Date(startTime);

    //         // 시, 분, 초를 가져옵니다. (한국 시간대 기준)
    //         const hours = dateObject.getHours();       // 시
    //         const minutes = dateObject.getMinutes();   // 분
    //         const seconds = dateObject.getSeconds();   // 초

    //         console.log(`${hours}시 ${minutes}분 ${seconds}초`);
    //     }
    // }, [startTime]);
    return(
        <div className="IdPwSearchContainer"> 
            {/* <div>
                <ul className="IdPwSearchTabNav">
                    <li 
                        onClick={()=>{pageTypeChange("findId")}}
                        className={pageType === "findId" ? "active" : ""}
                    >
                        계정 아이디 찾기
                    </li>
                    <li 
                        onClick={()=>{pageTypeChange("changePass")}}
                        className={pageType === "changePass" ? "active" : ""}
                    >
                        계정 비밀번호 변경하기
                    </li>
                </ul>
            </div> */}
            <IdPwSearch_selectTab PTC={pageTypeChange} Ptype={pageType}/>
            {inputLevel.searchingInfo?
            <div className="IdPwSearchContent"> 
            {pageType==="findId"?
                <>
                {/* <div>
                    <h1>아이디 찾기를 위한 인증 칸</h1>
                    <ul className="IdPwSearchFormList">
                        <li>이메일 주소 :&nbsp;<AuthInputBox boxType="uemail" handleInfo = {handleInfo} value={searchUserinfo.uemail||''}/></li>
                        <li>본인 이름 :&nbsp;<AuthInputBox boxType="uname" handleInfo = {handleInfo} value={searchUserinfo.uname||''}/></li>
                    </ul>
                    <div className="IdPwSearchAuthButton">
                        <AuthInputButton buttonType = "Id" Clicker={handleselectedTap}/>
                    </div>
                </div> */}
                <div>
                    <IdPwSearch_findId buttonType={"Id"} handleInfo={handleInfo} searchUserinfo={searchUserinfo} Clicker={handleselectedTap}/>
                </div>
                </>
                :
                // <div>
                //     <h1>비밀번호 변경을 위한 인증 칸</h1>
                //     <ul className="IdPwSearchFormList">                            
                //         <li>이메일 주소 :&nbsp;<AuthInputBox boxType="uemail" handleInfo = {handleInfo} value={searchUserinfo.uemail||''}/></li>
                //         <li>본인 이름 :&nbsp;<AuthInputBox boxType="uname" handleInfo = {handleInfo} value={searchUserinfo.uname||''}/></li>
                //         <li>아이디 :&nbsp;<AuthInputBox boxType="uid" handleInfo = {handleInfo} value={searchUserinfo.uid||''}/></li>
                //     </ul>
                //     <div className="IdPwSearchAuthButton">
                //         <AuthInputButton buttonType = "Pw" Clicker={handleselectedTap}/>
                //     </div>
                // </div>
                <div>
                    <IdPwSearch_findId buttonType={"Pw"} handleInfo={handleInfo} searchUserinfo={searchUserinfo} Clicker={handleselectedTap}/>
                </div>
            }
            </div>
            :
            ""}
            
        {inputLevel.authcodeInput?
            // <div className="IdPwSearchContent">
            //     <h1>인증 코드 입력</h1>
            //     <ul className="IdPwSearchFormList">
            //         <li>인증 코드 :&nbsp;<AuthInputBox boxType="authCodeIdPw" handleInfo = {handleInfo}/></li>
            //     </ul>
            //     <div className="IdPwSearchAuthButton">
            //         <AuthInputButton buttonType = "Auth" Clicker={handleselectedTap}/>
            //     </div>
            // </div>
            <IdPwSearch_AuthcodeInput handleInfo={handleInfo} Clicker={handleselectedTap}/>
            :
            ""
        }
        {inputLevel.showOrChange?
            (finalData==="PW"?
                <>
                    {/* <ul className="IdPwSearchFormList">
                        <li>비밀번호 :&nbsp;<AuthInputBox boxType="upass" handleInfo = {handleInfo} value={searchUserinfo.upass||''}/></li>
                        <li>비밀번호 확인 :&nbsp;<AuthInputBox boxType="upassCheck" handleInfo = {handleInfo} value={searchUserinfo.upassCheck||''}/></li>
                    </ul>
                    <AuthInputButton buttonType = "passCheck" Clicker={handleselectedTap}/>
                    <button buttonType = "" onClick={oncl}>aaaaaa</button>
                    비밀번호 확인버튼 , 비밀번호 전송버튼 만들기 */}
                    <IdPwSearch_passChange handleInfo={handleInfo} searchUserinfo={searchUserinfo} Clicker={handleselectedTap}/>
                </>
                :
                finalData==="wrong or late"?
                <h1>인증코드가 틀렸거나 인증시간을 초과하였습니다. <br/> 처음부터 다시 시도해주세요.</h1>:
                <h1>아이디 : {finalData}</h1>)
            :<></>}
        </div>
    )
}