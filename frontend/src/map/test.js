// function createTextAreaContainer(point, mapRef) {
//   var container = document.getElementById(`text-container-${point.id}`);
//   if (!container) {
//     container = document.createElement("div");
//     container.style.position = "absolute";
//     container.style.zIndex = "100";
//     container.classList.add("text-container");
//     container.id = `text-container-${point.id}`;

//     mapRef.current.getCanvasContainer().appendChild(container);
//   }
//   return container;
// }

// function textAreaInput(textarea, mapRef, mapboxDrawRef, container, point) {
//   textarea.addEventListener("input", function () {
//     textarea.style.height = "auto";
//     textarea.style.height = textarea.scrollHeight + "px";
//     textarea.setAttribute("contenteditable", true);

//     var screenCoordinates = mapRef.current.project(point.geometry.coordinates);
//     container.style.left = screenCoordinates.x;
//     container.style.top =
//       screenCoordinates.y - textarea.clientHeight / 2 + "px";

//     mapboxDrawRef.current.setFeatureProperty(point.id, "text", textarea.value);

//     container.style.left = screenCoordinates.x;
//     container.style.top =
//       screenCoordinates.y - container.clientHeight / 2 + "px";
//   });
// }

// function textAreaZoom(textarea, mapRef, container, point) {
//   mapRef.current.on("zoom", function () {
//     var zoom = mapRef.current.getZoom();
//     var fontSize = 5 + (zoom - 10) * 1;

//     textarea.style.fontSize = fontSize + "px";
//     textarea.style.height = "auto";
//     textarea.style.minHeight = parseInt(textarea.style.fontSize) * 2 + "px";
//     textarea.style.maxHeight = "200px"; // Set the maximum height to 200 pixels

//     // Adjust position of text area based on font size
//     var screenCoordinates = mapRef.current.project(point.geometry.coordinates);
//     container.style.left = screenCoordinates.x;
//     container.style.top =
//       screenCoordinates.y - textarea.clientHeight / 2 + "px";
//   });
// }

// function textAreaMove(textarea, mapRef, container, point) {
//   mapRef.current.on("move", () => {
//     var screenCoordinates = mapRef.current.project(point.geometry.coordinates);
//     //console.log(screenCoordinates);
//     container.style.left =
//       screenCoordinates.x + textarea.clientHeight / 5 + "px";
//     container.style.top =
//       screenCoordinates.y - textarea.clientHeight / 2 + "px";
//   });
// }

// function createTextArea(mapboxDrawRef, mapRef, point) {
//   var container = createTextAreaContainer(point, mapRef);
//   var textarea = document.createElement("textarea");
//   textarea.cols = 1;
//   textarea.style.lineHeight = textarea.style.height;
//   textarea.style.width = "180px";
//   var zoom = mapRef.current.getZoom();

//   textarea.style.fontSize = 5 + (zoom - 10) * 1 + "px"; //

//   textarea.style.height = "auto";
//   textarea.style.resize = "none";
//   textarea.style.overflow = "auto";
//   textarea.placeholder = "Please enter your text for the marker added... ";
//   textarea.style.boxSizing = "border-box";
//   textarea.classList.add("custom_text_area");
//   textarea.maxLength = 100;

//   textarea.value = point.properties.text || "";

//   textAreaInput(textarea, mapRef, mapboxDrawRef, container, point);

//   textarea.addEventListener("keyup", function () {
//     textarea.dispatchEvent(new Event("input"));
//   });
//   const MAX_LINES = 2;

//   textarea.addEventListener("keydown", function (event) {
//     if (event.key === "Enter") {
//       const lines = textarea.value.split(/\r*\n/).length;
//       if (lines >= MAX_LINES) {
//         event.preventDefault();
//       }
//     }
//   });

//   container.appendChild(textarea);
//   var screenCoordinates = mapRef.current.project(point.geometry.coordinates);
//   container.style.top = screenCoordinates.y - textarea.offsetHeight / 2 + "px";
//   container.style.left = screenCoordinates.x + textarea.clientHeight / 5 + "px";
//   textarea.focus();

//   textAreaZoom(textarea, mapRef, container, point);
//   textAreaMove(textarea, mapRef, container, point);
// }
