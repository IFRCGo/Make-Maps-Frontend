import React from "react";
import { FloatButton } from "antd";
import { CgTrash } from "react-icons/cg";
import { useMutation } from "@apollo/client";
import * as Mutation from "../API/AllMutations";

const TrashButton = ({ mapboxDrawRef }) => {
  const [deletePin] = useMutation(Mutation.DELETE_PIN);
  const [deleteDraw] = useMutation(Mutation.DELETE_DRAWING_LAYER);

  const handleClick = (selectedFeatures) => {
    selectedFeatures.forEach((feature) => {
      // change the window UI
      if (window.confirm("Are you sure you want to delete this pin?")) {
        let state = feature;
        if (state.geometry.type === "Point") {
          deletePin({ variables: { id: feature.id } })
            .then(() => alert("Value deleted successfully!"))
            .catch((error) => alert(error.message));
          let container = document.getElementById(`text-container-${state.id}`);
          if (container) {
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
          deleteDraw({ variables: { id: feature.id } })
            .then(() => alert("Value deleted successfully!"))
            .catch((error) => alert(error.message));
          mapboxDrawRef.current.trash();
        }
      }
    });
  };

  return (
    <FloatButton
      shape="square"
      style={{ right: 24, top: 90, height: "40px", zIndex: 999 }}
      icon={<CgTrash />}
      onClick={() => {
        const selectedFeatures = mapboxDrawRef.current.getSelected().features;
        handleClick(selectedFeatures);
      }}
    />
  );
};

export default TrashButton;
