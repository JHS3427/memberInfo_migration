import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk'
import RentalPayment from './RentalPayment.jsx';
import cityBikeImage from '../../utils/cityBikeImage.js';
import { useDispatch, useSelector } from 'react-redux';
import useRentalMapResponsive from '../../utils/useRentalMapResponsive.js'
import { setSelectedStation } from '../../feature/rental/rentalMarkerSlice.js';

const imageKey = ["seoulBike"];
const imagePath = cityBikeImage[imageKey];

export function RentalInfo({ data, onClose, onReSearch }) {
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    
    const windowWidth = useRentalMapResponsive();
    const isMobile = windowWidth <= 810;

    const dispatch = useDispatch();
    const filteredBikeList = useSelector((state) => state.rentalData.filteredBikeList);

    if (!data) return null;

    const stationLat = data.latitude;
    const stationLng = data.longitude;

    // 기본 마커 이미지
    const defaultMarkerImage = {
        src: 'http://t1.daumcdn.net/mapjsapi/images/marker.png',
        size: { width: 20, height: 30 },
    };
    // 선택된 마커 이미지
    const selectedMarkerImage = {
        src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', // 예시로 빨간 마커 사용
        size: { width: 25, height: 35 }, // 크기를 다르게 하여 시각적으로 강조
    };

    const MapContent = (
        <Map
            center={{ lat: stationLat, lng: stationLng }}
            level={5}
            onIdle={(map) => {
                const newCenter = map.getCenter();
                onReSearch({ lat: newCenter.getLat(), lng: newCenter.getLng() });
            }}
            style={{
                width: "100%",
                height: "300px",
                borderRadius: "10px",
                margin: "20px 0",
                zIndex: "-1",
                border: "2px solid var(--color-blue)"
            }}
        >
            {filteredBikeList && filteredBikeList.map((station) => {
                const isSelected = data && data.id === station.id;
                return (
                    <MapMarker
                        key={station.id}
                        image={isSelected ? selectedMarkerImage : defaultMarkerImage}
                        position={{ lat: station.latitude, lng: station.longitude }}
                        onClick={() => { dispatch(setSelectedStation(station)) }}
                    />
                )
            })}
        </Map>
    );

    const ImageContent = (
        <img
            className='map_marker_data_info_img'
            src={imagePath}
            alt="자전거 이미지"
        />
    )

    return (
        <>
            <div className='map_marker_data_info'>
                <h3>{data?.name}</h3>
                {/* 모바일 일땐 지도를 이미지 영역에 렌더링, pc 버전일 때에는 이미지 렌더링 */}
                {isMobile ? MapContent : ImageContent}
                <ul className='map_marker_data_info_list'>
                    <li style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ width: "100%", marginRight: "15px" }}>위도 <em>{data?.latitude}</em></span>
                        <span style={{ width: "100%", marginLeft: "15px" }}>경도 <em>{data?.longitude}</em></span>
                    </li>
                    <li>
                        <span>자전거 수: <strong>{data?.free_bikes}</strong></span>
                        <span>빈 거치대: <strong>{data?.empty_slots}</strong></span>
                        <span>어린이 자전거 : <strong>{data.extra?.kid_bikes}</strong></span>
                    </li>
                </ul>
                <form>
                    <button type='button' className='boarding' onClick={() => setPaymentModalOpen(true)}>대여하기</button>
                    <button className='map_marker_data_info_closs' onClick={onClose}>닫기</button>
                </form>
                {isPaymentModalOpen && (
                    <RentalPayment
                        className={`bike_rental_payment_info`}
                        data={isPaymentModalOpen}
                        onClose={() => setPaymentModalOpen(false)}
                    />
                )}
            </div>
        </>
    );
}