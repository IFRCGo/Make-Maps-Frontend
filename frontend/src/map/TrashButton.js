import React from "react";
import { FloatButton, Popconfirm, message } from "antd";
import { CgTrash } from "react-icons/cg";
import { useMutation } from "@apollo/client";
import * as Mutation from "../API/AllMutations";
import "./TrashButton.css";

const TrashButton = ({ mapboxDrawRef }) => {
  const [deletePin] = useMutation(Mutation.DELETE_PIN);
  const [deleteDraw] = useMutation(Mutation.DELETE_DRAWING_LAYER);

  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Object deleted successfully!",
    });
  };
  const error = (error) => {
    messageApi.open({
      type: "error",
      content: error.message,
    });
  };
  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "No object is selected!",
    });
  };

  const handleClick = (selectedFeatures) => {
    if (selectedFeatures.length == 0) {
      warning();
    }
    selectedFeatures.forEach((feature) => {
      // change the window UI
      let state = feature;
      if (state.geometry.type === "Point") {
        deletePin({ variables: { id: feature.id } })
          .then(success())
          .catch((error) => error(error));
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
          .then(success())
          .catch((error) => error(error));
        mapboxDrawRef.current.trash();
      }
    });
  };

  return (
    <>
      {contextHolder}
      <Popconfirm
        placement="leftTop"
        title={"Are you sure you want to delete this object?"}
        onConfirm={() => {
          const selectedFeatures = mapboxDrawRef.current.getSelected().features;
          handleClick(selectedFeatures);
        }}
        okText="Yes"
        cancelText="No"
      >
        <FloatButton
          shape="square"
          style={{ right: 24, top: 90, height: "40px", zIndex: 999 }}
          icon={<CgTrash />}
        />
      </Popconfirm>
    </>
  );
};

export default TrashButton;
