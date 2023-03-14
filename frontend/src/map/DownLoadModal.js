import React, { useState } from "react";
import { Modal, Button, Space } from "antd";

const DownLoadModal = ({
    isDownloadModalOpen, setIsDownloadModalOpen, download
}) => {
    const handleCancel = () => {
        setIsDownloadModalOpen(false);
    };

    const doNothing = () => {
        
    }
    return (
        <>
            <Modal
                title="Share Link"
                centered
                open={isDownloadModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="pdf" onClick={() => download("PDF")}>
                        Download PDF
                    </Button>,
                    <Button key="png" onClick={() => download("PNG")}>
                        Download PNG
                    </Button>,
                ]}
            >
            </Modal>
        </>
    );
}

export default DownLoadModal;