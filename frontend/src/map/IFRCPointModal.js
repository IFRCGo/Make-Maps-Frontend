import React from "react";
import { Form, Input, Modal } from "antd";

const IFRCPointModal = ({
  IFRCModalOpen,
  setIFRCModalOpen,
  reloadLayer,
  reloadedLayer,
  featureID,
  updateFeatureGeometry,
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        updateFeatureGeometry(reloadedLayer, featureID, [
          values.LNG,
          values.LAT,
        ]);
        reloadLayer(reloadedLayer);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
        //todo
      });
    setIFRCModalOpen(false);
  };

  const handleCancel = () => {
    setIFRCModalOpen(false);
  };

  return (
    <Modal
      open={IFRCModalOpen}
      title={reloadedLayer.name + "  " + featureID}
      okText="Submit"
      cancelText="Cancel"
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="LNG"
          label="Longitude"
          rules={[{ required: true, message: "Please input the longitude!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="LAT"
          label="Latitude"
          rules={[{ required: true, message: "Please input the latitude!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default IFRCPointModal;
