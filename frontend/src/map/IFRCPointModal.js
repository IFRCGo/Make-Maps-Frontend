import React, { useState } from "react";
import { LAYERS, LAYER_STATUS } from "./constant";
import { Form, Input, Modal } from 'antd';

//todo 
//Add detection to ensure that the input value cannot exceed the range
const IFRCPointModal = ({
    IFRCModalOpen,
    setIFRCModalOpen,
    reloadLayer,
    reloadedLayer,
    featureID,
    updateFeatureGeometry,
}) => {
    const [form] = Form.useForm();
    const [reloadData, setReloadData] = useState([]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();
                updateFeatureGeometry(reloadedLayer, featureID, [values.LNG, values.LAT]);
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
                    rules={[
                        { required: true, message: "Please input the longitude!" },
                        // { type: "number", message: "Please input a number for longitude!" }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="LAT"
                    label="Latitude"
                    rules={[
                        { required: true, message: "Please input the latitude!" },
                        // { type: "number", message: "Please input a number for latitude!" }
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default IFRCPointModal;
