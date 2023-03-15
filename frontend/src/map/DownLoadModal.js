import React from "react";
import { Modal, Button } from "antd";

const DownLoadModal = ({
  isDownloadModalOpen,
  setIsDownloadModalOpen,
  download,
}) => {
  const handleCancel = () => {
    setIsDownloadModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Download"
        centered
        open={isDownloadModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button
            style={{ width: "auto" }}
            danger
            key="pdf"
            onClick={() => download("PDF")}
          >
            Download PDF
          </Button>,
          <Button
            style={{ width: "auto" }}
            danger
            key="png"
            onClick={() => download("PNG")}
          >
            Download PNG
          </Button>,
        ]}
      ></Modal>
    </>
  );
};

export default DownLoadModal;
