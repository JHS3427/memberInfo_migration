import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    travelRepairList: [], //원본 - 1차원 배열
    travelRepair: {} //객체 하나
}

export const travelRepairSlice = createSlice({
  name: 'travelRepair',
  initialState,
  reducers: {
    createRepair(state, action) {
        const { travelRepairList, travelRepair } = action.payload;

        state.travelRepairList = travelRepairList;
        state.travelRepair = travelRepair;
    }
  },
})

// Action creators are generated for each case reducer function
export const { createRepair } = travelRepairSlice.actions //API 함수 또는 컴포넌트에서 dispatch(액션함수)

export default travelRepairSlice.reducer //store import


