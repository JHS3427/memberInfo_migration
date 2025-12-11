import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    menuList: [], //출력용 - 2차원 배열
    menus: [], //원본 - 1차원 배열
    menu: {} //상세페이지 객체 하나
}

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    createMenu(state, action) {
        const { menuList, menus } = action.payload;
        state.menuList = menuList;
        state.menus = menus;
    }//,

    // filterMenu(state, action) {
    //     const { pid } = action.payload;
        
    //     //방법 1. productList가 2차원 배열이므로 flat() 함수를 이용하여 1차원 변경 후 filter
    //     // const [filterProduct] = productList.flat.filter((item) => //filter함수는 실행 결과값으로 새로운 배열을 생성한다.
    //     //     item.pid === pid
    //     // );
    //     // state.product = filterProduct;

    //     //방법 2. products 1차원 배열에서 find 함수
    //     state.menu = state.menus.find(item => item.pid === pid);
    // }
  },
})

// Action creators are generated for each case reducer function
export const { createMenu/*, filterMenu*/ } = menuSlice.actions //API 함수 또는 컴포넌트에서 dispatch(액션함수)

export default menuSlice.reducer //store import


