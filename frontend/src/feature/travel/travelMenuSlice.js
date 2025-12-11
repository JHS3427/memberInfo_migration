import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    travelMenuList: [], //출력용 - 2차원 배열
    travelMenus: [], //원본 - 1차원 배열
    travelMenu: {} //상세페이지 객체 하나
}

export const travelMenuSlice = createSlice({
  name: 'travelMenu',
  initialState,
  reducers: {
    createMenu(state, action) {
        const { travelMenuList, travelMenus } = action.payload;
        
        state.travelMenuList = travelMenuList;
        state.travelMenus = travelMenus;
    }  
  },
})

// Action creators are generated for each case reducer function
export const { createMenu } = travelMenuSlice.actions //API 함수 또는 컴포넌트에서 dispatch(액션함수)

export default travelMenuSlice.reducer //store import


