import React from "react";
import { FloatButton } from "antd";
import { CgTrash } from "react-icons/cg";
import { useMutation } from "@apollo/client";
import * as Mutation from "../API/AllMutations";

const TrashButton = ({ mapboxDrawRef }) => {
  const [deletePin] = useMutation(Mutation.DELETE_PIN);

  const handleClick = (pinId) => {
    if (window.confirm("Are you sure you want to delete this pin?")) {
      deletePin({ variables: { filter: { _id: pinId } } })
        .then(() => alert("Value deleted successfully!"))
        .catch((error) => alert(error.message));
    }
  };

  return (
    <FloatButton
      shape="square"
      style={{ right: 24, top: 90, height: "40px", zIndex: 999 }}
      icon={<CgTrash />}
      onClick={() => {
        const selectedFeatures = mapboxDrawRef.current.getSelected().features;
        selectedFeatures.forEach((feature) => {
          console.log(feature.id);
          handleClick(feature.id);
          let state = feature;
          if (state.geometry.type === "Point") {
            let container = document.getElementById(
              `text-container-${state.id}`
            );
            if (container) {
              // console.log("Found container element:", container);
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
  );
};

export default TrashButton;
