import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { XCircleFill, CheckCircleFill, ExclamationCircleFill, InfoCircleFill } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

interface MessageModalProps {
  show: boolean;
  onHide: () => void;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

const MessageModal: React.FC<MessageModalProps> = ({ show, onHide, message, type = 'info' }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleFill className="text-success" size={30} />;
      case 'error':
        return <XCircleFill className="text-danger" size={30} />;
      case 'warning':
        return <ExclamationCircleFill className="text-warning" size={30} />;
      default:
        return <InfoCircleFill className="text-info" size={30} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success bg-opacity-10';
      case 'error':
        return 'bg-danger bg-opacity-10';
      case 'warning':
        return 'bg-warning bg-opacity-10';
      default:
        return 'bg-info bg-opacity-10';
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <div className={`modal-content border-0 ${getBackgroundColor()}`}>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="w-100 text-center">{type.charAt(0).toUpperCase() + type.slice(1)}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center py-4">
          {getIcon()}
          <p className="mt-3 text-center">{message}</p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="outline-secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default MessageModal;