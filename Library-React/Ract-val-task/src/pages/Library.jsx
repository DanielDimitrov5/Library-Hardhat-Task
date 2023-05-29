import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useSigner } from "wagmi";
import libraryABI from "../abi/Library.json";
import Spinner from 'react-bootstrap/Spinner';

import { Button, Container, Row, Col } from 'react-bootstrap';
import BookCard from "../components/BookCard";
import AddBookModal from "../components/AddBookModal";

const Library = () => {

    const { data: signer } = useSigner();
    const contractAddress = "0x5F81B135A28cA68aB6Ea67f50468dC40cceF0696";

    const [libraryContract, setLibraryContract] = useState();
    const [contractData, setContractData] = useState({});

    const [isLoadingContractData, setIsLoadingContractData] = useState(true);
    const [bookCopies, setBookCopies] = useState({});
    const [isLoadingRentBook, setIsLoadingBookAction] = useState({});
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
        setIsLoadingBookAction(loadingStates);
        setContractData({ bookCount, books });
        setIsLoadingContractData(false);
    }, [libraryContract]);

    const handleRentBook = async (bookId) => {
        setIsLoadingBookAction(prevState => ({
            ...prevState,
            [bookId]: true
        }));

        try {
            const tx = await libraryContract.borrowBook(bookId);
            const txReceipt = await tx.wait();

            if (txReceipt.status === 1) {
                setIsBookRented(prevState => ({
                    ...prevState,
                    [bookId]: true
                }));

                const copies = (await libraryContract.books(bookId)).copies;

                setBookCopies(prevState => ({
                    ...prevState,
                    [bookId]: copies
                }));

                setIsLoadingBookAction(prevState => ({
                    ...prevState,
                    [bookId]: false
                }));
            }

        } catch (error) {
            setIsLoadingBookAction(prevState => ({
                ...prevState,
                [bookId]: false
            }));
        }

    };

    const handleReturnBook = async (bookId) => {
        setIsLoadingBookAction(prevState => ({
            ...prevState,
            [bookId]: true
        }));

        try {
            const tx = await libraryContract.returnBook(bookId);
            const txReceipt = await tx.wait();

            if (txReceipt.status === 1) {
                setIsBookRented(prevState => ({
                    ...prevState,
                    [bookId]: false
                }));

                const copies = (await libraryContract.books(bookId)).copies;

                setBookCopies(prevState => ({
                    ...prevState,
                    [bookId]: copies
                }));

                setIsLoadingBookAction(prevState => ({
                    ...prevState,
                    [bookId]: false
                }));
            }

        } catch (error) {
            setIsLoadingBookAction(prevState => ({
                ...prevState,
                [bookId]: false
            }));
        }
    };

    const handleAddBook = async () => {
        setIsLoadingAddBook(true);

        try {
            const tx = await libraryContract.addNewBook(title, copies);

            libraryContract.on("LogNewBookAdded", (id, name, copies) => {

                setContractData(prevState => ({
                    ...prevState,
                    books: [...prevState.books, { id, name: title, copies }]
                }));

                setBookCopies(prevState => ({
                    ...prevState,
                    [id]: copies
                }));

                handleCloseModal();
                setIsLoadingAddBook(false);
            });
        } catch (error) {
            handleCloseModal();
            setIsLoadingAddBook(false);
        }

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
                    + Book
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
                                                <>
                                                    {contractData.books.map((book) => (
                                                        <BookCard
                                                            key={book.id}
                                                            book={book}
                                                            bookCopies={bookCopies}
                                                            isLoadingRentBook={isLoadingRentBook}
                                                            isBookRented={isBookRented}
                                                            handleReturnBook={handleReturnBook}
                                                            handleRentBook={handleRentBook}
                                                        />
                                                    ))}
                                                </>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <AddBookModal showModal={showModal}
                handleCloseModal={handleCloseModal}
                handleSubmit={handleSubmit}
                data={{ title, copies }}
                setTitle={setTitle}
                setCopies={setCopies}
                isLoadingAddBook={isLoadingAddBook}
                handleAddBook={handleAddBook} />
        </>
    )
};

export default Library;
