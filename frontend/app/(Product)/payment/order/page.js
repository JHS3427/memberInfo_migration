import {OrderListMain} from "@/components/checkout/OrderListMain";
import {axiosDataPost, axiosPost} from "@/utils/dataFetch";
import {cookies} from "next/headers";

const getOrderList = async () => {
    const url = '/payment/order';
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
    const data = await axiosDataPost(url, {}, { "Cookie": allCookies });
    return data;
}

export default async function OrderListPage() {

    const orderList = await getOrderList();

    return (
        <>
            <OrderListMain orderList={orderList}/>
        </>
    );
}