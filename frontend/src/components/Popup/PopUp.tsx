import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Trash, Pencil } from 'react-bootstrap-icons';

interface PostManagerProps {
  visible: boolean;
  setVisible: (isVisible: boolean) => void;
  onDeleteClicked: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onEditClicked: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function PostManager({ visible, setVisible, onDeleteClicked, onEditClicked }: PostManagerProps) {
  const handleClose = () => setVisible(false);

  return (
    <Modal show={visible} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Post Options</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="d-flex flex-column">
          <Button onClick={onDeleteClicked} variant="link" className="text-danger text-start py-3 border-bottom">
            <Trash className="me-3" /> Delete
          </Button>
          <Button onClick={onEditClicked} variant="link" className="text-dark text-start py-3 border-bottom">
            <Pencil className="me-3" /> Edit
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
