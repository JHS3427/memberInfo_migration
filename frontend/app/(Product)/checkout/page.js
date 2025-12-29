
import {CheckoutHeader} from "@/components/checkout/CheckoutHeader.jsx";
import {CheckoutForm} from "@/components/checkout/CheckoutForm.jsx";
import {CheckoutOrder} from "@/components/checkout/CheckoutOrder.jsx";
import {CheckoutPayment} from "@/components/checkout/CheckoutPayment.jsx";
import '@/styles/product/checkout.css';
import {axiosDataPost} from "@/utils/dataFetch";
import {cookies} from "next/headers";

const getCheckoutList = async () => {
    const url = '/cart/list';

    // 1. 쿠키 가져오기
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

    // 2. 헤더에 쿠키 실어 보내기 (이게 없으면 백엔드는 로그인 안 한 걸로 취급함)
    const data = await axiosDataPost(url, {}, { "Cookie": allCookies });
    return data;
}

export default async function CheckoutPage(){

    const checkoutData = await getCheckoutList();

    const cartList = Array.isArray(checkoutData) ? checkoutData : [];

    const totalPrice = cartList.length > 0 ? cartList[0].totalPrice : 0;

    return(
        <div className="checkout-page-container">
            <CheckoutHeader/>
            <CheckoutForm cartList={cartList}/>
            <CheckoutOrder cartList={cartList}
                           totalPrice={totalPrice}/>
            <CheckoutPayment totalPrice={totalPrice}
                             cartList={cartList}/>
        </div>
    );
}