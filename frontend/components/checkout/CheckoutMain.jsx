"use client"

import { useEffect } from "react";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader.jsx";
import { CheckoutForm } from "@/components/checkout/CheckoutForm.jsx";
import { CheckoutOrder } from "@/components/checkout/CheckoutOrder.jsx";
import { CheckoutPayment } from "@/components/checkout/CheckoutPayment.jsx";
import '@/styles/checkout.css';
import { axiosPost } from "@/utils/dataFetch";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/useCartStore";

export function CheckoutMain() {
    const {
        cartList,
        totalPrice,
        showCartItem,
        updateTotalPrice
    } = useCartStore();

    const router = useRouter();

    useEffect(() => {
        const fetchCheckoutList = async () => {
            if (typeof window === 'undefined') return;

            const storedInfo = localStorage.getItem("loginInfo");
            if (!storedInfo) {
                await Swal.fire({
                    icon: "warning",
                    title: "로그인 필요",
                    text: "주문을 위해 로그인이 필요합니다.",
                });
                router.replace("/login");
                return;
            }

            const { userId } = JSON.parse(storedInfo);

            try {
                const url = '/cart/list';
                const data = await axiosPost(url, { "uid": userId });

                if (data) {
                    showCartItem(data);
                    updateTotalPrice();
                }
            } catch (error) {
                console.error("주문 정보 로딩 실패:", error);
            }
        };

        fetchCheckoutList();
    }, [router, showCartItem, updateTotalPrice]);

    return (
        <>
            <CheckoutHeader />
            <CheckoutForm cartList={cartList} />
            <CheckoutOrder cartList={cartList} totalPrice={totalPrice} />
            <CheckoutPayment totalPrice={totalPrice} cartList={cartList} />
        </>
    );
}