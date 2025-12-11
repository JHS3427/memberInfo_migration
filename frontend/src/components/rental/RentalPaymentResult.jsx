import { useSearchParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/rental/status";

export function RentalPaymentResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // 1. URL에서 주문번호(orderId)를 가져옴. (카카오페이 콜백 URL에는 pg_token도 있지만 여기서는 orderId만 사용)
    const orderId = searchParams.get("orderId");

    // 2. 컴포넌트 상태 정의
    const [rentalStatus, setRentalStatus] = useState({
        loading: true,
        success: false,
        error: null,
        details: null // 서버에서 받아올 상세 정보 (자전거 번호, 대여 시간 등)
    });

    // 3. 컴포넌트 마운트 시 최종 결제 상태를 서버에서 조회
    useEffect(() => {
        if (!orderId) {
            // 주문번호가 없으면 오류 처리
            setRentalStatus({ loading: false, success: false, error: "주문 정보가 유효하지 않습니다." });
            return;
        }

        const fetchFinalStatus = async () => {
            try {
                // 🚨 핵심: 백엔드 API를 호출하여 DB 상태를 검증
                const response = await axios.get(`${API_URL}?orderId=${orderId}`);
                const data = response.data;

                if (data.finalStatus === "APPROVED" || data.status === "대여 중") {
                    // 결제 성공 및 대여 완료 상태
                    setRentalStatus({
                        loading: false,
                        success: true,
                        error: null,
                        details: data // { bikeId: 'B-101', station: '강남', startTime: '...' } 형태의 상세 정보
                    });
                } else {
                    // 결제 실패 또는 승인 거부 상태
                    setRentalStatus({
                        loading: false,
                        success: false,
                        error: data.message || "결제는 완료되었으나, 대여 처리에 실패했습니다.",
                        details: null
                    });
                }

            } catch (err) {
                console.error("결제 상태 조회 중 서버 통신 에러:", err);
                setRentalStatus({
                    loading: false,
                    success: false,
                    error: "서버 통신 오류. 다시 시도해 주세요.",
                    details: null
                });
            }
        };

        fetchFinalStatus();
    }, [orderId]);

    // --- 4. 렌더링 ---

    if (rentalStatus.loading) {
        return (
            <div style={{ padding: "3rem", textAlign: "center" }}>
                <h2>결제 상태 확인 중...</h2>
                <p>잠시만 기다려 주세요. 최종 대여 정보를 확인하고 있습니다.</p>
            </div>
        );
    }

    // A. 결제 및 대여 성공 시
    if (rentalStatus.success && rentalStatus.details) {
        const { bikeId, stationName, startTime } = rentalStatus.details;
        return (
            <div className="payment_result">
                <h1>결제 완료!</h1>
                <p>결제 번호 :  {orderId}</p>

                <ul>
                    <li>자전거 대여 정보</li>
                    <li>대여 자전거 번호: {bikeId || 'N/A'}</li>
                    <li>대여 시작 시각: {new Date(startTime).toLocaleString()}</li>
                    <li>대여 스테이션: {stationName}</li>
                </ul>

                <div>
                    <p>다음 단계: 해당 자전거의 잠금 장치를 해제하고 이용을 시작해 주세요.</p>
                </div>

                <button onClick={() => navigate('/')}>메인 화면으로 돌아가기</button>
            </div>
        );
    }

    // B. 결제 실패 또는 오류 시
    return (
        <div className="payment_fail" style={{ padding: "3rem", border: "1px solid #F44336", maxWidth: "600px", margin: "50px auto", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <h1>결제 및 대여 실패</h1>
            <p style={{ fontSize: "1.1rem", marginBottom: "30px" }}>대여 번호 : {orderId}</p>

            <ul>
                <li style={{ fontWeight: "bold", color: "#333" }}>오류 내용: {rentalStatus.error || '알 수 없는 오류가 발생했습니다.'}</li>
                <li>결제 과정에 문제가 발생했거나, 서버에서 최종 승인 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.</li>
            </ul>

            <button onClick={() => navigate('/rental')}>결제 다시 시도하기</button>
        </div>
    );
}