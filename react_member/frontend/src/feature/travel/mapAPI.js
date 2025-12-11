import React from "react";
import { createMenu } from "./mapSlice.js";
import { axiosData, axiosGet, groupByRows } from "../../utils/dataFetch.js";

export const getMarkerList = async (number) => {
//  여기 url 바뀌면 react 재시작 할 것
    const url = "/map/all"; //DB 경우
//    console.log("url => ", url);
    const jsonData = await axiosGet(url);
//    console.log("json => ", jsonData);

//    이거는 몇행 가져왔냐 이거임
//    const rows = groupByRows(jsonData, number); //groupByRows()로 1차원인 jsonData를 2차원 배열로 변경한다 //dataFetch.js에 있음
//    리덕스(모든 공간에서 가져다가 사용) 사용이 아니면 dispatch는 필요없다.
//    dispatch(createMenu({"markerList": rows, "markers": jsonData}));

    return jsonData;
}

