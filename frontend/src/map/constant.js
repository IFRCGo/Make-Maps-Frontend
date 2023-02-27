export const API_KEY = "HMeYX3yPwK7wfZQDqdeC";
export const LAYERS = [
  {
    name: "OpenRailWayMap",
    url: "https://a.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
    type: "TMS",
  },
  {
    name: "name2",
    url:
      "https://api.maptiler.com/maps/toner-v2/{z}/{x}/{y}.png?key=" + API_KEY,
    type: "TMS",
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
