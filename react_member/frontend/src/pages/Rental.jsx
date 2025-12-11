import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map, MapMarker } from 'react-kakao-maps-sdk'
import { BiTargetLock } from "react-icons/bi";
import { RentalInfo } from '../components/rental/RentalInfo.jsx';
import { addData, setFilteredList, setSelectedStation } from '../feature/rental/rentalMarkerSlice.js';
import { showMarkerAPI } from '../feature/rental/rentalMarkerAPI.js';
import useRentalMapResponsive from '../utils/useRentalMapResponsive.js';
import useKakaoLoader from "../useKakaoLoader.js";

const getDistance = (startLat, startLon, endLat, endLon) => {
    // 주 지점이 같은 경우 0km 반환
    if ((startLat === endLat) && (startLon === endLon)) {
        return 0;
    }

    // 지구의 평균 반지름 (단위: km)
    const earthRadiusKm = 6371;

    // 도(각도: 위도, 경도)를 라디안으로 변환
    const degreesToRadians = Math.PI / 180;

    // 위도 및 경도 차이를 라디안으로 변환
    const latDifferenceRad = (endLat - startLat) * degreesToRadians;
    const lonDifferenceRed = (endLon - startLon) * degreesToRadians;

    // Haversine 공식의 값 계산
    const haversineValueA =
        Math.sin(latDifferenceRad / 2) * Math.sin(latDifferenceRad / 2) +
        Math.cos(startLat * degreesToRadians) * Math.cos(endLat * degreesToRadians) *
        Math.sin(lonDifferenceRed / 2) * Math.sin(latDifferenceRad / 2);

    // Haversine 공식의 c값 계산 (두 지점 사이의 호의 중심 각, 라디안)
    const centralAngleArc = 2 * Math.atan2(Math.sqrt(haversineValueA), Math.sqrt(1 - haversineValueA));

    // 최종 거리 계산 (거리 = 반지름 * 호의 길이)
    const distanceKm = earthRadiusKm * centralAngleArc;

    return distanceKm;
}

const Rantal = () => {
    useKakaoLoader()
    // useDispatch()를 사용하기 위해서 dispatch 변수 선언 그리고 할당 함.
    const dispatch = useDispatch();

    //마커의 정보를 담고있는 store에 등록된 데이터
    const selectedMarker = useSelector((state) => state.rentalData.selectedStation);

    // store에 등록된 전체 데이터를 사용하기 위해 useSelector로 데이터 추출
    const allBikeStations = useSelector((state) => state.rentalData.bikeList);

    // 사용자가 위치 사용 권한을 거부했을 시 기본 좌표 반영
    const [latLon, setLatLon] = useState({ lat: 37.575877, lng: 126.976897 });

    // store에서 필터링된 마커 리스트를 가져 올 변수
    const [filteredMaps, setFilteredMaps] = useState([]);

    const [mapCenter, setMapCenter] = useState(latLon);

    const [showSearchButton, setShowSearchButton] = useState(false);

    const respondiveMap = useRentalMapResponsive();
    const isMapMobile = respondiveMap <= 810;

    // 기본 마커 이미지
    const defaultMarkerImage = {
        src: 'http://t1.daumcdn.net/mapjsapi/images/marker.png',
        size: { width: 30, height: 50 },
    };

    // 선택된 마커 이미지
    const selectedMarkerImage = {
        src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', // 예시로 빨간 마커 사용
        size: { width: 40, height: 60 }, // 크기를 다르게 하여 시각적으로 강조
    };

    useEffect(() => {
        const bikePullData = async () => {
            try {
                // 불러온 자전거 데이터를 Redux store에 저장 (전역 상태 관리용) or 마커의 전체 데이터를 포함
                const data = await showMarkerAPI();
                dispatch(addData(data));

                // 2. 사용자 위치 가져오기 및 상태 설정 (에러 처리 포함)
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setLatLon({ lat: latitude, lng: longitude });
                    },
                    (error) => {
                        // 에러 콜백 함수
                        console.error(`Geolocation Error: Code ${error.code}, Message: ${error.message}`);
                        // 여기서 error.code (1, 2, 3)를 확인합니다.
                    },
                    {
                        // 세 번째 옵션 객체
                        enableHighAccuracy: true, // 이게 문제의 원인일 수 있습니다.
                        timeout: 10000,           // 현재 설정된 타임아웃 시간(ms)
                        maximumAge: 0
                    },
                    (error) => {
                        // 위치 접근 실패 시 로그 기록
                        console.error("사용자 위치 정보를 가져오는 데 실패했습니다:", error);
                        // 옵션: 실패 시 기본 위치 설정
                        // setLatLon({ lat: 37.5665, lng: 126.9780 });
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // 옵션
                );
            } catch (error) {
                // API 호출 실패 시 에러 처리
                console.error("자전거 데이터를 불러오는 중 오류 발생:", error);
                // 사용자에게 오류를 시각적으로 알리는 로직 추가 (예: 에러 상태 설정)
            }
        };

        bikePullData();
    }, []);

    // allBikeStations(Redux 데이터)나 latLon(사용자 위치)이 변경될 때마다 필터링을 다시 수행
    useEffect(() => {
        // 사용자 위치가 설정되었고, Redux에 데이터가 로딩되었을 때만 필더링 수행
        if (allBikeStations.length > 0) {
            const maxDistanceKm = 0.5; // 반경 500m
            const maxMarkers = 10;

            const filteredStations = allBikeStations.filter(station => {
                const distance = getDistance(
                    latLon.lat,
                    latLon.lng,
                    station.latitude, // JSON 데이터의 위도 속성
                    station.longitude // JSON 데이터의 경도 속성
                );
                // 거리가 500m 이하인 경우에만 true 반환
                return distance <= maxDistanceKm
            });


            const finalFilteredStations = filteredStations.slice(0, maxMarkers);
            dispatch(setFilteredList(finalFilteredStations));

            //필더링된 결과를 렌더링에 사용할 로컬 상태에 저장
            setFilteredMaps(filteredStations);

            if (isMapMobile && finalFilteredStations.length > 0 && selectedMarker === null) {
                dispatch(setSelectedStation(finalFilteredStations[0]));
            }

        }
    }, [allBikeStations, latLon, dispatch, selectedMarker, isMapMobile]);

    const handleReSearch = (center) => {
        if (center && center.lat && center.lng) {
            setLatLon({ lat: center.lat, lng: center.lng });
        } else {
            setLatLon(mapCenter);
        }
        setShowSearchButton(false)
    }

    return (
        
        <div className='rental_map_box'>

                <RentalInfo
                    data={selectedMarker}
                    onClose={() => dispatch(setSelectedStation(null))}
                    onReSearch={handleReSearch}
                />
                <Map
                className='kakao_rental_map'
                center={latLon}
                style={{ width: "100%", height: "calc(100vh - 55px)" }}
                onIdle={(map) => {

                    //지도의 새로운 중심 좌표를 가져와서 latLon 상태 업데이트
                    const newCenter = map.getCenter();
                    setMapCenter({
                        lat: newCenter.getLat(),
                        lng: newCenter.getLng(),
                    });

                    setShowSearchButton(true);
                }}
            >
                <button onClick={handleReSearch}><BiTargetLock className='rental_map_target' /></button>
                {
                    filteredMaps && filteredMaps.map((station, index) => {
                        const isSelected = selectedMarker && selectedMarker.id === station.id;
                        return<MapMarker key={`${station.id}-${index}`}
                            position={{ lat: station.latitude, lng: station.longitude }}
                            image={isSelected ? selectedMarkerImage : defaultMarkerImage}
                            onClick={() => { dispatch(setSelectedStation(station)) }}
                        >
                        </MapMarker>
                    })
                }
            </Map>
        </div>
    )
}
export default Rantal;