
import Swal from 'sweetalert2';
import { useEffect,useState } from "react";
import { getInfo,idDuplCheck,updateUser,IdDrop,getLogout,usePostCode} from '../feature/auth/authAPI';
import { useNavigate,Link } from 'react-router-dom';
import '../styles/myPage.css'; // ✨ 새로운 CSS 파일 import
import { useDispatch} from 'react-redux';

export function InfoBox({info,name,handleDataChange,idDuplCheck,idChecker,updateResult}){

    
    const dataChangeButtonOnOffInit = {uid:false,upass:false,
                                    uname:false,uage:false,
                                    ugender:false,uaddress:false,
                                    uemail:false,uphone:false
    }
    const nameString = {uid:"아이디",upass:"패스워드",
                        uname:"이름",uage:"나이",
                        ugender:"성별",uaddress:"주소",
                        uemail:"이메일",uphone:"전화번호"}

    const [dataChangeButtonOnOff,setDataChangeButtonOnOff] = useState(dataChangeButtonOnOffInit)
    const [postCodeChanger,setPostCodeChanger]=useState(0);//uaddress_main 초기화용 변수

    const [mainAddressVar,setMainAddressVar] = useState({"mainAddress":"","postcode":""});//
    const {handleClick} = usePostCode(mainAddressVar,setMainAddressVar); // 리턴이 handleclick임
    
    const DataChangeOpen = (e) =>{
        setDataChangeButtonOnOff({...dataChangeButtonOnOff,[name] : true})
    }
    const DataChangeClose = (e) =>{
        setDataChangeButtonOnOff({...dataChangeButtonOnOff,[name] : false})
        if(name==="uaddress")
        {
            handleDataChange({target:{name:"uaddress_sub",value:""}})
            setPostCodeChanger(1);//uaddress_main 초기화 작업을 위해 세팅
            setMainAddressVar({"mainAddress":"","postcode":""})
        }
        else
        {
            handleDataChange({target:{name:name,value:""}})
        }
    }

    /*dataChangeButtonOnOff의 uaddress가 true가 되면 작동 > uaddress_main을 mainAddressVar.mainAddress값으로 변경
        > 그러다 mainAddressVar.mainAddress값이 바뀌면 다시 세팅 >이후 받아온 handleDataChange에서 name따져서 uaddress가 main이면 console로 출력

     postCodeChanger를 만든 이유 : 바깥에서 uaddress_main 초기화 하려고 시도했는데 안됨. 그래서 useEffect에 넣고 초기화
    */
    useEffect(() => {
        if (mainAddressVar.mainAddress && dataChangeButtonOnOff['uaddress']) {
            handleDataChange({
                target: {
                    name: 'uaddress_main',
                    value: mainAddressVar.mainAddress + " *** " + mainAddressVar.postcode
                }
            });
        }
        if(postCodeChanger===1)
        {
            handleDataChange({
                target: {
                    name: 'uaddress_main',
                    value: ""
                }
            });
            setPostCodeChanger(0);
        }
    }, [mainAddressVar.mainAddress, postCodeChanger]);

    useEffect(()=>{
        setDataChangeButtonOnOff({...dataChangeButtonOnOff,[name] : false})
        if(name === "uaddress")
        {
            setMainAddressVar({"mainAddress":"","postcode":""});
        }
    },[updateResult])
    if (!info) {
        // null을 반환하여 아무것도 렌더링하지 않거나, 로딩 메시지를 반환합니다.
        // MyPage에서 <li>로 감싸고 있으므로, <li> 안의 내용만 반환해야 합니다.
        return <>정보를 불러오는 중...</>; 
    }
    return(
        <>
            <li>{dataChangeButtonOnOff[name]?
                name==="uaddress"?
                    <>
                        {nameString[name]} 변경 -- 
                        <button name = {name+"_main"} type='button' onClick={handleClick} >주소 찾기</button>
                        <input
                            name = {name+"_main"} 
                            value = {mainAddressVar.mainAddress}
                            readOnly />
                        <input
                            name = {"postcode"} 
                            value = {mainAddressVar.postcode}
                            readOnly />
                        <input
                            name = {name+"_sub"}
                            onChange={handleDataChange}/>
                        <button onClick={DataChangeClose}> 취소</button>
                    </>
                    :
                    <>
                        {nameString[name]} 변경 -- 
                        <input
                            name = {name}
                            onChange={handleDataChange}/>{name==="uid"?
                                                            idChecker?
                                                                <button>중복 체크 OK </button>:
                                                                <button onClick={idDuplCheck}>중복 체크</button>
                                                            :""}
                        <button onClick={DataChangeClose}> 취소</button>
                    </>
                :
                <>
                    {info[name]} <button onClick={DataChangeOpen}> {nameString[name]} 수정</button>
                </>
                }
            </li>
        </>);
}

//useEffect로 데이터 가져오기 - islogin값 확인해서 백에 아이디 보고 요청하기
//정보가지고 authapi로 > authapi에서 백으로 > 백 컨트롤러 > 서비스 > 레포지토리 > 정보 취합 > 서비스 > 컨트롤러 > 프론트 api > 여기로
export function MyPage(){

    const handleDatainit = {uid:"",upass:"",
                            uname:"",uage:"",
                            ugender:"",uaddress_main:"",uaddress_sub:"",postcode:"",
                            uemail:"",uphone:""
    }
    const editDatainit = {uid:0,upass:0,
                            uname:0,uage:0,
                            ugender:0,uaddress_main:0,uaddress_sub:0,postcode:"",
                            uemail:0,uphone:0
    }

    const navigate=useNavigate();   
    const dispatch = useDispatch();
    const [info, setInfo] = useState(null);//DB에서 가져온 데이터 저장
    const [handleData,setHandleData] = useState(handleDatainit)//변경 데이터 저장용 변수
    
    const [editer,setEditer] = useState(editDatainit);//각 정보 중 어디가 바뀌었는지 저장. 이걸로 밑의 editerOnOff변수값 수정
    const [editerOnOff,setEditerOnOff] = useState(0);//회원정보중 어느거라도 수정 버튼 누르면 이 값이 바뀌어서 수정 저장 버튼 나오게 만드는 변수
    const [idChecker,setIdChecker] = useState(false);//아이디 변경 시 중복 방지를 위한 변수

    const[updateResult,setUpdateResult] = useState(0);//회원정보 수정 후 데이터 새로고침을 위한 변수

    const handleChange=(e)=>{
        const {name,value} = e.target
        setHandleData({...handleData,[name]:value})
        if(name ==="uid")
        {
            setIdChecker(false);
        }
        if(value==="")
        {
            setEditer({...editer,[name]:0})
        }
        else
        {
            setEditer({...editer,[name]:1})
        }
    }
    const loginInfoString = localStorage.getItem("loginInfo");
    let socialLogin = false;
    let Json_loginInfo = null;

    if (loginInfoString) {
        Json_loginInfo = JSON.parse(loginInfoString);
        socialLogin = Json_loginInfo.isSocial;
    }

    useEffect(()=>{
        let result;
        const loginInfo = localStorage.getItem("loginInfo");
        if (!loginInfoString) // null인 경우
        {
            navigate('/');
            return; // 리다이렉션 후 이후 코드가 불필요하게 실행되는 것을 방지
        }
        const Json_loginInfo = JSON.parse(loginInfo);
        //isLogin하면 스프링이 데이터를 제대로 못받아서 loggedIn으로 변경.
        const loginInfo_goingback={ uid : Json_loginInfo.userId, loggedIn : Json_loginInfo.isLogin, socialDupl : Json_loginInfo.isSocial}
        const getUserInfo = async() =>{
            result = await getInfo(loginInfo_goingback);
            result["upass"] = "패스워드는 비밀입니다"
            setInfo(result)
        }
        getUserInfo();
    },[updateResult])
    
    useEffect(()=>{
        let editerOnOff_changer = 0
        for( const [key, value] of Object.entries(editer))
        {
            editerOnOff_changer=editerOnOff_changer+value
            setEditerOnOff(editerOnOff_changer);
        }
    },[editer])

    const dataFixer = async() =>{//원본데이터, 변경데이터 넘겨서 해당 내용 바꾸기
        //아이디 중복확인 후 중복 없으면 전달하기
        if(editer["uid"]===1 && !idChecker){
            Swal.fire({icon:"error", text:"아이디 중복체크 하세요"})
        }
        else
        {
            const idIncludehandleData = {...handleData,["includedId"]:info.uid}
            const result = await updateUser(idIncludehandleData)
            setHandleData(handleDatainit);
            setEditerOnOff(0);
            if(result===1)
            {
                console.log("aaaaaaaaa")
                setUpdateResult(prev => prev+1);//updateUser를 넣으면 1값 유지되고, useEffect 작동 안해서 이렇게 변경
            }
        }
    }

    const idDrop = async() =>{
        const idIncludehandleData = {...info}
        const userResponse = window.confirm("회원 탈퇴 하시겠습니까?");
        if(userResponse)
        {
            console.log(idIncludehandleData);
            const result = await IdDrop(idIncludehandleData)
            dispatch(getLogout());
            navigate('/');
        }
        else
        {
            Swal.fire({icon : "info", text:"회원 탈퇴를 취소하였습니다."})
        }
    }

    const IdDupleCheck = async() => {
        const duplResult = await idDuplCheck(handleData.uid);
        
        if(!duplResult){//duplResult=true면 중복있음, false면 중복없음
        //!duplResult은 중복이 없을때 true가 됨
            // setIdDupl(true);
            setIdChecker(true);
        }
        else{
            handleData.uid="";
            Swal.fire({icon : "error", text:"아이디 중복! 다시 입력해주세요"});
            // inputRefs.idRef.current.focus();
        }
    }
    return(
        <>
            <div className="myPageContainer">
                <div className="sideBar">
                    <h1 className="sideBarTitle">사이드 탭</h1>
                    <ul className="sideBarList">
                        <Link to={`/cart`}>
                            <li>
                                자전거 장바구니
                            </li>
                        </Link>
                        <Link to={`/payment/order`}>
                            <li>
                                자전거 구매내역
                            </li>
                        </Link>
                        <li>여행지 찜목록</li>
                    </ul>
                </div>
                <div className="infoSection">
                    <h1 className="infoSectionTitle">개인정보 기록 및 수정</h1>
                    <ul className="infoList">
                        {socialLogin?
                        <>
                            <li>소셜 로그인은 아이디를 공개하지 않습니다</li>
                            <li>소셜 로그인은 패스워드를 공개하지 않습니다</li>
                        </>:
                        <>
                            <InfoBox info={info} name = "uid" handleDataChange={handleChange} idDuplCheck = {IdDupleCheck} idChecker={idChecker} updateResult={updateResult}/>
                            <InfoBox info={info} name = "upass" handleDataChange={handleChange} updateResult={updateResult}/>
                        </>}                       
                        
                        <InfoBox info={info} name = "uname" handleDataChange={handleChange} updateResult={updateResult}/>
                        <InfoBox info={info} name = "uage" handleDataChange={handleChange} updateResult={updateResult}/>
                        <InfoBox info={info} name = "ugender" handleDataChange={handleChange} updateResult={updateResult}/>
                        <InfoBox info={info} name = "uaddress" handleDataChange={handleChange} updateResult={updateResult}/>
                        <InfoBox info={info} name = "uemail" handleDataChange={handleChange} updateResult={updateResult}/>
                        <InfoBox info={info} name = "uphone" handleDataChange={handleChange} updateResult={updateResult}/>
                    </ul>
                    {editerOnOff>0?<button className="withdrawButton" onClick={dataFixer}>수정 내용 저장</button>:""}
                    
                    <button className="withdrawButton" onClick={idDrop}>회원 탈퇴</button>
                </div>
            </div>
        </>
    );
}