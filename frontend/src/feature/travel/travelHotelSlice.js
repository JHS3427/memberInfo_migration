import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    travelHotelList: [], //원본 - 1차원 배열
    travelHotel: {} //객체 하나
}

export const travelHotelSlice = createSlice({
  name: 'travelHotel',
  initialState,
  reducers: {
    createHotel(state, action) {
        const { travelHotelList, travelHotel } = action.payload;
        
        state.travelHotelList = travelHotelList;
        state.travelHotel = travelHotel;
    }  
  },
})

// Action creators are generated for each case reducer function
export const { createHotel } = travelHotelSlice.actions //API 함수 또는 컴포넌트에서 dispatch(액션함수)

export default travelHotelSlice.reducer //store import


