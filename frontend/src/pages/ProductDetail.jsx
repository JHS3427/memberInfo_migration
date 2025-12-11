import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {getProduct} from "../feature/product/productAPI.js";
import {ImageList} from "../components/commons/ImageList.jsx";
import {addCart} from "../feature/cart/cartAPI.js";
import '../styles/product/productdetail.css';
import {addCompareItem} from "../feature/compare/compareSlice.js";
import Swal from "sweetalert2";

export function ProductDetail() {
    const {category, pid} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const product = useSelector((state) => state.product.product);
    const imgList = useSelector((state) => state.product.imgList);
    const cartList = useSelector((state)=>state.cart.cartList);

    useEffect(()=> {
        if (category && pid) {
            dispatch(getProduct(category, pid));
        }
    }, [dispatch, category, pid]);

    const handleFindStore = () => {
        navigate("/location");
    }
    const goToCart = () => {
        const userInfo = localStorage.getItem('loginInfo');
        if (!userInfo) {
            Swal.fire({
                icon: "warning",
                title: "로그인 필요",
                text: "로그인이 필요합니다.",
            });
            navigate("/login");
            return;
        }
        dispatch(addCart(product.product_id, category));
    }

    const goToPurchase = () => {
        const userInfo = localStorage.getItem('loginInfo');
        if (!userInfo) {
            Swal.fire({
                icon: "warning",
                title: "로그인 필요",
                text: "로그인이 필요합니다.",
            });
            navigate("/login");
            return;
        }
            navigate("/cart");
    }

    const goToCompare =() => {
        dispatch(addCompareItem(product));
        Swal.fire({
            icon: "success",
            title: "",
            text: "비교함에 상품이 담겼습니다.",
        });
    }

    return (
        <div className="product-detail-container" style={{paddingTop:'65px'}}>
            <div className='product-detail-top'>
                <div className='product-detail-image-top'>
                    <img src={product.image} alt={product.name} className="main-image"/>
                    <ImageList  className="product-detail-thumbnails"
                                imgList={imgList}/>
                </div>

                {/* 1-2. 오른쪽 정보 패널 */}
                <ul className='product-detail-info-top'>
                    <li className='product-detail-name'>{product.name}</li>
                    <li className='product-detail-price'>
                        {product.price && `KRW ${parseInt(product.price).toLocaleString()}`}
                    </li>
                    <li className='product-detail-subtitle'>
                        {product.subInfo}
                    </li>

                    {/* 컬러 선택기 */}
                    <li className='color-selector-wrapper'>
                        <div className='color-selector'>
                            <span>{product.color}</span>
                        </div>
                    </li>

                    {/* 비교하기 버튼 */}
                    <li className='button-wrapper product-action-buttons'>
                        <button type="button"
                                className="action-button btn-secondary"
                                onClick={goToCompare}>
                            + 비교하기
                        </button>
                        <button type="button"
                                className="action-button btn-secondary"
                                onClick={goToCart}
                                disabled={!product.product_id}>
                            장바구니
                        </button>
                        <button type="button"
                                className="action-button btn-primary"
                                onClick={goToPurchase}>
                            구매
                        </button>
                    </li>

                    {/* 메인스펙 (dropdown) */}
                    <li className='spec-wrapper'>
                        <details className='main-spec' open> {/* 'open' 속성으로 기본 펼침 */}
                            <summary>메인스펙</summary>
                            <div className='spec-content'>
                                {
                                    product.description && product.description.map((line, index) => (
                                        <p key={index}>{line}</p>
                                    ))
                                }
                            </div>
                        </details>
                    </li>

                    {/* 사이즈 / 대리점 찾기 버튼 */}
                    <li className='button-wrapper stack'>
                        <button type="button" className="spec-button store"
                                onClick={handleFindStore}>대리점 찾기</button>
                    </li>
                </ul>
            </div>

            <div className="tab-content">
                <div className="tab-pane-detail">
                    <h3>DETAIL</h3>
                    <img src={product.image} alt={product.name} className="main-image"/>
                    <ImageList  className="product-detail-thumbnails"
                                imgList={imgList}/>
                </div>
            </div>
        </div>
    );
}