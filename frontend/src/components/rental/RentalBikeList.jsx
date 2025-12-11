import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { showMarkerAPI } from '../../feature/rental/rentalMarkerAPI.js';
import { addData, setSelectedStation } from '../../feature/rental/rentalMarkerSlice.js'


const RentalBikeList = ({className}) => {

	// useDispatch() 사용 선언
	const dispatch = useDispatch();
	//store에 등록한 전역 데이터를 셀렉터를 통해서 get.
	const filteredBikeList = useSelector((state) => state.rentalData.filteredBikeList);
    const selectedStation = useSelector((state) => state.rentalData.selectedStation);

	useEffect(() => {
			const bikeListData = async () => {
			const bikeData = await showMarkerAPI();
			dispatch(addData(bikeData));
		}
		bikeListData();
	}, [dispatch]);

	return (
		<div>
			<div className={className}>
				<ul>
					{
						filteredBikeList && filteredBikeList.map((bikeList, index)=>{
                            const isActive = selectedStation && (selectedStation.extra.uid === bikeList.extra.uid);
							return (
								<li
                                    className={isActive ? "active" : ""}
									key={index}
									onClick={()=>{
										dispatch(setSelectedStation(bikeList))
									}}
								>{bikeList.name}<span>{bikeList.extra.uid}</span></li>
							)
						})

					}
				</ul>
			</div>
		</div>
	)
}

export default RentalBikeList;