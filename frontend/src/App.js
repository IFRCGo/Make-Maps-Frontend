import React from 'react';
import './App.css';
import { Layout, theme } from 'antd';
// import MapInterface from './components/MapInterface';
import Map from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import FloatBut from './components/FloatBut';
import HeaderContents from './components/HeaderContents';
import ToolBar from './components/ToolBar';

const { Header, Content, Footer } = Layout;

function App() {
  const data = "";
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="site-layout">
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
        }}
      >
        <HeaderContents />
      </Header>

      <Content
        style={{
          margin: 0,
          background: colorBgContainer,
          height: '500px',
        }}
      >
        {/* <MapInterface className="map-layout"/> */}
        <Map mapLib={maplibregl}
        initialViewState={{
          longitude: -0.2,
          latitude: 51.5072,
          zoom: 12
        }}
          style={{width: "100%", height: " calc(100vh - 77px)"}}
          // mapStyle="https://api.maptiler.com/maps/basic-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC" // Basic layer
          // mapStyle="https://api.maptiler.com/maps/streets-v2/style.json?key=HMeYX3yPwK7wfZQDqdeC" // Street Layer
          // mapStyle="https://api.maptiler.com/maps/openstreetmap/style.json?key=HMeYX3yPwK7wfZQDqdeC" // open street layer
          mapStyle="https://api.maptiler.com/maps/hybrid/style.json?key=HMeYX3yPwK7wfZQDqdeC"  // satellite layer
        >
        </Map>
          <FloatBut />
          <ToolBar 
            data={data}
          />
        </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        IFRC GO MAKE MAPS ©2023
      </Footer>
    </Layout>
  );
}

export default App;
