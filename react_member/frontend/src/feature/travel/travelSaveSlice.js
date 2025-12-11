import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    travelSaveList: [], //원본 - 1차원 배열
    travelSave: {}, //객체 하나
}

export const travelSaveSlice = createSlice({
  name: 'travelSave',
  initialState,
  reducers: {
    createSave(state, action) {
        const { travelSaveList, travelSave } = action.payload;

        state.travelSaveList = travelSaveList;
        state.travelSave = travelSave;
    },
  },
})

export const { createSave } = travelSaveSlice.actions

export default travelSaveSlice.reducer


