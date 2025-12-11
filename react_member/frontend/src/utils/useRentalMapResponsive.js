import { useState, useEffect } from 'react';

const useRentalMapResponsive = () => {
    const [responsiveMap, setResponsiveMap] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 0
    );

    useEffect(() => {
        if (typeof window === 'undefined'){
            return;
        }
        const handleResize = () => {
            setResponsiveMap(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])

    return responsiveMap;
};

export default useRentalMapResponsive;