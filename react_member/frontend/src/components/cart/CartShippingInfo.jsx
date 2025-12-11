import React, {useEffect, useState} from 'react';
import '../../styles/cart/cartshipping.css'
import {useDispatch, useSelector} from "react-redux";
import {setOrderInfo, setReceiverInfo, toggleSameOrderer, userOrderInfo} from "../../feature/cart/cartSlice.js";
import DaumPost from "../commons/DaumPost.jsx";

export default function CartShippingInfo() {
    const dispatch = useDispatch();
    const cartList = useSelector((state) => state.cart.cartList);
    const {orderInfo, receiverInfo} = useSelector(state => state.cart);
    useEffect(() => {
        if (cartList && cartList.length > 0) {
            dispatch(userOrderInfo(cartList[0]));
            dispatch(toggleSameOrderer(true));
        }
    }, [cartList, dispatch]);

    const handleOrderChange = (e) => {
        const { name, value } = e.target;
        dispatch(setOrderInfo({name,value}));
    };

    const handleReceiverChange = (e) => {
        const { name,value} = e.target;
        dispatch(setReceiverInfo({name,value}));
    }

    const handleSameCheck = (isSame) => {
        dispatch(toggleSameOrderer(isSame));
    }
    const handleAddressComplete = (data) => {
        dispatch(setReceiverInfo({ name: 'postcode', value: data.postcode }));
        dispatch(setReceiverInfo({ name: 'address', value: data.address }));
    }

    return (
        <div className="checkout-info-container">
            <div className="form-section">
                <h2 className="form-section-title">주문자 정보</h2>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="orderer-name">주문자명 <span className="required">*</span></label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="orderer-name"
                                name="name"
                                value={orderInfo.name}
                                onChange={handleOrderChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="orderer-mobile" style={{marginLeft:'10px'}}>휴대폰번호 <span className="required">*</span></label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="orderer-mobile"
                                name="mobile"
                                value={orderInfo.mobile}
                                onChange={handleOrderChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="orderer-email">이메일 <span className="required">*</span></label>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                id="orderer-email"
                                name="email"
                                value={orderInfo.email}
                                onChange={handleOrderChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. 수령인 정보 섹션 */}
            <div className="form-section">
                <div className="form-section-header">
                    <h2 className="form-section-title">수령인 정보</h2>
                    <div className="recipient-actions">
                        <div className="radio-group">
                            <input
                                type="radio"
                                id="same-as-orderer"
                                name="recipient-type"
                                checked={receiverInfo.isSame}
                                onChange={() => handleSameCheck(true)}
                            />
                            <label htmlFor="same-as-orderer">주문자와 동일</label>
                            <input
                                type="radio"
                                id="new-address"
                                name="recipient-type"
                                checked={!receiverInfo.isSame}
                                onChange={() => handleSameCheck(false)}
                            />
                            <label htmlFor="new-address">새로운주소</label>
                        </div>
                    </div>
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="recipient-name">수령자명 <span className="required">*</span></label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="recipient-name"
                                name="name"
                                value={receiverInfo.name}
                                onChange={handleReceiverChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipient-contact">연락처</label>
                        <div className="input-wrapper">
                            <input type="text" id="recipient-contact" placeholder="-없이 숫자만 입력" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipient-mobile" style={{marginLeft:'10px'}}>휴대폰번호 <span className="required">*</span></label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="recipient-mobile"
                                name="mobile"
                                value={receiverInfo.mobile}
                                onChange={handleReceiverChange}
                            />
                        </div>
                    </div>
                    <div className="form-group form-group-address">
                        <label htmlFor="recipient-zipcode">주소 <span className="required">*</span></label>
                        <div className="address-group">
                            <div style={{display:'flex', alignItems:'center', marginBottom:'8px'}}>
                                <input
                                    type="text"
                                    name="postcode"
                                    value={receiverInfo.postcode}
                                    placeholder="우편번호"
                                    readOnly
                                    style={{width:'100px', marginRight:'10px'}}
                                />
                                <DaumPost onComplete={handleAddressComplete}/>
                            </div>
                            <input
                                type="text"
                                id="recipient-address1"
                                name="address"
                                value={receiverInfo.address}
                                onChange={handleReceiverChange}
                                className="input-address"
                                placeholder="기본 주소 검색 후 상세 주소를 입력해주세요"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
