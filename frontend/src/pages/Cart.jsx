import {CartHeader} from "../components/cart/CartHeader.jsx";
import CartShippingInfo from "../components/cart/CartShippingInfo.jsx"
import {CartItem} from "../components/cart/CartItem.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {showCart} from "../feature/cart/cartAPI.js";
import {useNavigate} from "react-router-dom";
import '../styles/cart/cart.css';
import Swal from "sweetalert2";

export function Cart(){
    const {totalPrice,orderInfo, receiverInfo} = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const goToCheckout = () => {
        if(totalPrice <= 0){
            Swal.fire({
                icon: "warning",
                text: "주문 상품이 없습니다!",
            });
            return;
        }
        const validateForm = () => {
            if (!orderInfo.name || !orderInfo.mobile || !orderInfo.email) {
                return "주문자 정보를 모두 입력해주세요.";
            }
            if (!receiverInfo.name || !receiverInfo.mobile || !receiverInfo.postcode || !receiverInfo.address) {
                return "배송지(수령인) 정보를 모두 입력해주세요.";
            }

            return null;
        };

        const errorMessage = validateForm();

        if (errorMessage) {
            Swal.fire({
                icon: "warning",
                title: "필수정보누락",
                text: errorMessage,
            });
            return;
        }

        navigate("/checkout");
    }
    useEffect(() => {
        const userInfo = localStorage.getItem('loginInfo');
        if(!userInfo){
            Swal.fire({
                icon: "warning",
                title: "로그인 필요",
                text: "로그인이 필요합니다.",
            });
            navigate("/login");
            return;
        }
        dispatch(showCart());
    }, [dispatch]);
    return(
        <div className="cart-page-container">
            <CartHeader/>
            <CartItem/>
            <CartShippingInfo/>
            <div className="cart-footer-buttons">
                <button className="btn-primary" onClick={goToCheckout}>제품 주문하기</button>
            </div>
        </div>
    );
}