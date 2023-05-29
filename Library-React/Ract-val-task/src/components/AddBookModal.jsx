import { Button, Modal, Form } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';

const addBookModal = ({ showModal, handleCloseModal, handleSubmit, data, setTitle, setCopies, isLoadingAddBook, handleAddBook }) => {
    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Add new book</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Title:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter title"
                            value={data.title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formCopies">
                        <Form.Label>Copies:</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter number of copies"
                            value={data.copies}
                            onChange={(e) => setCopies(e.target.value)}
                        />
                    </Form.Group>
                    <br />
                    {isLoadingAddBook ? (
                        <Spinner animation="border" variant="warning" />
                    ) : (
                        <Button onClick={handleAddBook} variant="primary" type="submit">
                            Add
                        </Button>
                    )}
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default addBookModal;