

import { Link } from 'react-router-dom';
export function MyPage_SideBar(){
    return(
    <>
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
    </>)
}