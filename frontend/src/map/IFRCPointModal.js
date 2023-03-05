import React, { useState } from "react";
import { Modal } from "antd";
import { LAYERS, LAYER_STATUS } from "./constant";
import { Form, Input, Modal } from 'antd';

const LayerModal = ({
    mapRef,
    IFRCModalOpen,
    setIFRCModalOpen,
    reloadLayer,
    reloadedLayer,
    updateFeatureGeometry,
    reloadedData
}) => {
    const [form] = Form.useForm();
    const [reloadData, setReloadData] = useState([]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();
                useState
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
        IFRCModalOpen(false);
    };

    const handleCancel = () => {
        IFRCModalOpen(false);
    };

    return (
        <Modal
            open={open}
            title="Create a new collection"
            okText="Create"
            cancelText="Cancel"
            onCancel={handleCancel}
            onOk={handleOk}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{ modifier: "public" }}
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[
                        { required: true, message: "Please input the title of collection!" }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input type="textarea" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default LayerModal;
