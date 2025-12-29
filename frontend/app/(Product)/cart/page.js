
import '@/styles/cart/cart.css';
import {axiosDataPost} from "@/utils/dataFetch";
import CartMain from "@/components/cart/CartMain";
import {cookies} from "next/headers";

const showCartList = async() => {
    const url = '/cart/list';
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
    const data = await axiosDataPost(url, {}, { "Cookie": allCookies });
    return data;
    }

export default async function CartPage(){

    const list = await showCartList();

    return(
        <div className="cart-page-container">
            <CartMain initialCartList={list}/>
        </div>
    );
}