import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    mapList: [], //출력용 - 2차원 배열
    maps: [], //원본 - 1차원 배열    
    map: {}, //상세페이지 객체 하나
}

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    createMenu(state, action) {
        const { mapList, maps } = action.payload;
        
        state.mapList = mapList;
        state.maps = maps;
    },
  },
})

// Action creators are generated for each case reducer function
export const { createMenu } = mapSlice.actions //API 함수 또는 컴포넌트에서 dispatch(액션함수)

export default mapSlice.reducer //store import


