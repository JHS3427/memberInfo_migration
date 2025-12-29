"use client"

import CartShippingInfo from "@/components/cart/CartShippingInfo";
import {CartHeader} from "@/components/cart/CartHeader";
import {CartItem} from "@/components/cart/CartItem";
import {useEffect} from "react";
import useCartStore from "@/store/useCartStore";
import {axiosPost} from "@/utils/dataFetch";

export default function CartMain() {
    const {showCartItem, updateTotalPrice} = useCartStore();

    useEffect(() => {

        const getCartList = async () => {
            const storedInfo = localStorage.getItem("loginInfo");
            if (!storedInfo) return;

            const { userId } = JSON.parse(storedInfo);

            try {
                const url = `/cart/list`;
                const data = await axiosPost(url, { "uid": userId });

                if (data) {
                    showCartItem(data);
                    updateTotalPrice();
                }
            } catch (error) {
            }
        };

        getCartList();
    }, [showCartItem, updateTotalPrice]);

    return(
        <>
            <CartHeader />
            <CartItem />
            <CartShippingInfo />
        </>
    );
}