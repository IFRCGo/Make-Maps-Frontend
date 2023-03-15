import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Modal, Input, Button, message } from "antd";
import { LinkOutlined } from "@ant-design/icons";

const LinkModal = ({ isLinkModalOpen, setIsLinkModalOpen }) => {
  const { id, long, lat } = useParams();
  const [text, setText] = useState(
    `https://ifrc-go-make-maps-frontend.azurewebsites.net/map/live/${id}/${long}/${lat}`
  );

  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Copy successful!",
    });
  };

  const handleCancel = () => {
    setIsLinkModalOpen(false);
  };
  return (
    <>
      {contextHolder}
      <Modal
        title="Share Link"
        centered
        open={isLinkModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Input.Group compact>
          <Input
            style={{
              width: "calc(100% - 130px)",
            }}
            value={text}
            defaultValue={text}
          />
          <CopyToClipboard text={text}>
            <Button
              style={{ width: "auto" }}
              type="primary"
              icon={<LinkOutlined />}
              onClick={() => {
                handleCancel();
                success();
              }}
            >
              Copy
            </Button>
          </CopyToClipboard>
        </Input.Group>
      </Modal>
    </>
  );
};

export default LinkModal;
