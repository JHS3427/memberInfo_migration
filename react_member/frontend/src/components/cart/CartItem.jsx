import {useDispatch, useSelector} from "react-redux";
import {checkItem, removeCart, updateCart} from "../../feature/cart/cartAPI.js";
import {RiDeleteBin6Line} from "react-icons/ri";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {clearCart} from "../../feature/cart/cartSlice.js";

export function CartItem(){
    const cartList = useSelector((state) => state.cart.cartList);
    const totalPrice = useSelector((state) => state.cart.totalPrice);
    const dispatch= useDispatch();
    const navigate = useNavigate();
    console.log(cartList);

    const goToProduct = () => {
        navigate("/products/mountain");
    }
    // useEffect(() => {
    //     if (totalPrice === 0 && cartList.length > 0 && cartList[0].price !== undefined) {
    //         dispatch(clearCart());
    //     }
    // }, [totalPrice, cartList.length, dispatch]);
    return(
        <div className="cart-item-list">

            {cartList && cartList.length > 0 ? (
                <>
                    {cartList
                        .filter(item => item.price !== undefined)
                        .map((item)=> (
                            <div key={item.cid} className="cart-item-row">
                                <input
                                    type="checkbox"
                                    className="cart-item-checkbox"
                                    checked={item.checked || false}
                                    onChange={() => dispatch(checkItem(item.cid))}
                                />
                                {item.image && (
                                    <img src={`${item.image}`} alt={item.name} />
                                )}

                                <span className="item-name">{item.name && item.name}</span>
                                <span className="item-price">
                                {item.price && item.price.toLocaleString() + '원'}
                                </span>
                                <div className='cart-quantity'>
                                    <button type='button'
                                            onClick={()=>{item.qty > 1 && dispatch(updateCart(item.cid, "-"))}}>-</button>
                                    <input type='text' value={item.qty} readOnly/>
                                    <button type='button'
                                            onClick={()=>{dispatch(updateCart(item.cid, "+"))}}>+</button>
                                    <button className='cart-remove' onClick={()=>{dispatch(removeCart(item.cid))}}>
                                        <RiDeleteBin6Line />
                                    </button>
                                </div>
                            </div>
                        ))}

                    <div className="cart-total-summary">
                        <span className="total-label">총 금액 :</span>
                        <span className="total-value">{totalPrice.toLocaleString()}원</span>
                    </div>
                </>
            ) : (
                <div className="cart-empty-message">
                    <p>장바구니에 상품이 없습니다.</p>
                    <button onClick={goToProduct}>자전거 구매</button>
                </div>
            )}
        </div>
    );
}