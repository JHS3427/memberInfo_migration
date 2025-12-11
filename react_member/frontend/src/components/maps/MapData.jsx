import React from 'react'
import Rantal from '../../pages/Rantal.jsx';

const MapData = () => {
  return (
    <Rantal
      id='map'
        center={{lat: 37.575877, lng: 126.976897}}
        style={{width:"100%", height: "100vh"}}
        level={4}
    />
  )
}

export default MapData;