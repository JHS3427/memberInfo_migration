import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from 'react';

import { TravelMenu } from "./TravelMenu.jsx";

import { getTravelMenuList } from '../../feature/travel/travelMenuAPI.js';

export function TravelMenuList({ handleMenuClick }) {
    const dispatch = useDispatch();
    const travelMenuList = useSelector((state) => state.travelMenu.travelMenuList);

    const [number, setNumber] = useState(3);

    useEffect(() => {
        dispatch(getTravelMenuList(number));
    }, [number]);

    const handleClick = (type) => {
        handleMenuClick(type);
    }

    return(
        <>
            {travelMenuList && travelMenuList.map((rowArray, idx) =>
                { return rowArray && rowArray.map((travelMenu, idx) =>
                    <TravelMenu name={travelMenu.name} type={travelMenu.type} icon={travelMenu.icon} handleClick={handleClick}  key={idx} />
                )}
            )}
        </>
    );
}