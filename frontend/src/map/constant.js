export const API_KEY = "HMeYX3yPwK7wfZQDqdeC";
export const LAYERS = [
  {
    name: "Open Railway Map",
    url: "https://a.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
    type: "TMS",
  },
  {
    name: "ESRI World Topo",
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    type: "TMS",
  },
  {
    name: "Toner",
    url:
      "https://api.maptiler.com/maps/toner-v2/{z}/{x}/{y}.png?key=" + API_KEY,
    type: "TMS",
  },

  {
    name: "Thunderforest",
    url: "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6050c913919243db8c4ffb1bad6730c0",
    type: "TMS",
  },
  {
    name: "Free worldwide topographic map",
    url: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
    type: "TMS",
  },
  {
    name: "Waze (World)",
    url: "https://worldtiles3.waze.com/tiles/{z}/{x}/{y}.png",
    type: "TMS",
  },
  {
    name: "IFRC Points",
    image: "./../images/IFRC.jpg",
    data: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-66.84734335564356, 18.38480676410721],
        },
        properties: {
          id: "point-1",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-67.08629599236279, 18.39785950349716],
        },
        properties: {
          id: "point-2",
        },
      },
    ],
    type: "geojson",
  },
];
export const MAP_STATUS = {
  ADD_PIN: 1,
  ADD_POPUP: 2,
  MAP_STATUS: 3,
  DO_NOTHING: 0,
};
export const LAYER_STATUS = {
  IS_RENDERING: 1,
  NOT_RENDERING: 0,
};
