import React from "react";
import { FloatButton } from "antd";
import { CgTrash } from "react-icons/cg";

const TrashButton = ({ mapboxDrawRef }) => {
  return (
    <FloatButton
      shape="square"
      style={{ right: 100, marginBottom: -10 }}
      icon={<CgTrash />}
      onClick={() => {
        const selectedFeatures = mapboxDrawRef.current.getSelected().features;
        selectedFeatures.forEach((feature) => {
          let state = feature;
          if (state.geometry.type === "Point") {
            let container = document.getElementById(
              `text-container-${state.id}`
            );
            if (container) {
              console.log("Found container element:", container);
              setTimeout(() => {
                container.remove();
              }, 0);
            } else {
              console.log(
                `Could not find container with ID 'text-container-${state.id}'`
              );
            }
            mapboxDrawRef.current.trash();
          } else {
            mapboxDrawRef.current.trash();
          }
        });
      }}
    />
  )
}

export default TrashButton