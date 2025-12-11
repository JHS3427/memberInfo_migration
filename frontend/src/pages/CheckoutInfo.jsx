import {useSelector} from "react-redux";
import {CheckoutHeader} from "../components/checkout/CheckoutHeader.jsx";
import {CheckoutForm} from "../components/checkout/CheckoutForm.jsx";
import {CheckoutOrder} from "../components/checkout/CheckoutOrder.jsx";
import {CheckoutPayment} from "../components/checkout/CheckoutPayment.jsx";
import '../styles/checkout.css';

export function CheckoutInfo(){
    const cartList = useSelector((state)=>state.cart.cartList);
    const totalPrice = useSelector((state)=>state.cart.totalPrice);
    return(
        <div className="checkout-page-container">
            <CheckoutHeader/>
            <CheckoutForm/>
            <CheckoutOrder cartList={cartList}
                            totalPrice={totalPrice}/>
            <CheckoutPayment totalPrice={totalPrice}
                            cartList={cartList}/>
        </div>
    );
}