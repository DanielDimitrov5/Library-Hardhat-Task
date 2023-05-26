import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useSigner } from "wagmi";
import libraryABI from "../abi/Library.json";
import Spinner from 'react-bootstrap/Spinner';

import { Button, Card, Container, Row, Col, Modal, Form } from 'react-bootstrap';

const Library = () => {
    const { data: signer } = useSigner();
    const contractAddress = "0x5F81B135A28cA68aB6Ea67f50468dC40cceF0696";

    const [libraryContract, setLibraryContract] = useState();
    const [contractData, setContractData] = useState({});

    const [isLoadingContractData, setIsLoadingContractData] = useState(true);
    const [bookCopies, setBookCopies] = useState({});
    const [isLoadingRentBook, setIsLoadingRentBook] = useState({});
    const [isBookRented, setIsBookRented] = useState({});
    const [isLoadingAddBook, setIsLoadingAddBook] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [copies, setCopies] = useState('');

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const getContractData = useCallback(async () => {
        setIsLoadingContractData(true);

        const bookCount = await libraryContract.bookCount();
        const books = await libraryContract.getBooks();

        let copies = {};
        let loadingStates = {};

        for (let i = 1; i <= books.length; i++) {
            const book = await libraryContract.books(i);
            copies[i] = book.copies;
            loadingStates[i] = false;

            const isBorrowed = await libraryContract.borrowed(i, signer.getAddress());

            setIsBookRented(prevState => ({
                ...prevState,
                [i]: isBorrowed
            }));
        }

        setBookCopies(copies);
        setIsLoadingRentBook(loadingStates);
        setContractData({ bookCount, books });
        setIsLoadingContractData(false);
    }, [libraryContract]);

    const handleRentBook = async (bookId) => {
        setIsLoadingRentBook(prevState => ({
            ...prevState,
            [bookId]: true
        }));

        try {
            await libraryContract.borrowBook(bookId);

            setIsBookRented(prevState => ({
                ...prevState,
                [bookId]: true
            }));

        } catch (error) {
            console.log(error);
        }

        setBookCopies(prevState => ({
            ...prevState,
            [bookId]: prevState[bookId] - 1
        }));

        setIsLoadingRentBook(prevState => ({
            ...prevState,
            [bookId]: false
        }));
    };

    const handleReturnBook = async (bookId) => {
        setIsLoadingRentBook(prevState => ({
            ...prevState,
            [bookId]: true
        }));

        try {
            await libraryContract.returnBook(bookId);

            setIsBookRented(prevState => ({
                ...prevState,
                [bookId]: false
            }));

        } catch (error) {
            console.log(error);
        }

        setBookCopies(prevState => ({
            ...prevState,
            [bookId]: prevState[bookId] + 1
        }));

        setIsLoadingRentBook(prevState => ({
            ...prevState,
            [bookId]: false
        }));
    };

    const handleAddBook = async () => {
        setIsLoadingAddBook(true);

        try {
            await libraryContract.addNewBook(title, copies);
        } catch (error) {
            console.log(error);
        }

        handleCloseModal();
        setIsLoadingAddBook(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setTitle('');
        setCopies('');
        setShowModal(false);
    };

    useEffect(() => {
        if (signer) {
            const libraryContract = new ethers.Contract(contractAddress, libraryABI, signer);
            setLibraryContract(libraryContract);
        }
    }, [signer]);

    useEffect(() => {
        if (libraryContract) {
            getContractData();
        }
    }, [libraryContract, getContractData]);

    return (
        <>
            <div className="container my-5">
                <div className="mt-5">
                    <h1>Library</h1>
                </div>
                <Button variant="primary" onClick={handleShowModal}>
                    +book
                </Button>
                <Container>
                    <Row className="justify-content-center">
                        <Col xs={12} md={6}>
                            <div className="mt-5">
                                <div className="row">
                                    <div className="col-14" >
                                        {isLoadingContractData ? (
                                            <Row className="justify-content-center">
                                                <Spinner animation="border" variant="warning" />

                                            </Row>
                                        ) : (
                                            <ul>
                                                {contractData.books.map((book) => (
                                                    <React.Fragment key={book.id}>
                                                        <Card>
                                                            <Card.Header as="h5">Book #{book.id.toString()}</Card.Header>
                                                            <Card.Body>
                                                                <Card.Title>{book.name}</Card.Title>
                                                                <Card.Text>
                                                                    Available copies: {bookCopies[book.id]}
                                                                </Card.Text>
                                                                {isLoadingRentBook[book.id] ? (
                                                                    <Spinner animation="border" variant="warning" />
                                                                ) : (
                                                                    <>
                                                                        {isBookRented[book.id] ? (
                                                                            <Button variant="success" onClick={() => handleReturnBook(book.id)}>
                                                                                Return
                                                                            </Button>
                                                                        ) : (
                                                                            <Button variant="primary" onClick={() => handleRentBook(book.id)}>
                                                                                Rent
                                                                            </Button>
                                                                        )}

                                                                    </>
                                                                )}
                                                            </Card.Body>
                                                        </Card>
                                                        <br />
                                                    </React.Fragment>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
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
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formCopies">
                            <Form.Label>Copies:</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter number of copies"
                                value={copies}
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
        </>
    )
};

export default Library;
