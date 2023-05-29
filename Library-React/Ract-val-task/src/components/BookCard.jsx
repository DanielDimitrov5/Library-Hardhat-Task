import React from 'react';
import { Button, Card } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';

const BookCard = ({ book, bookCopies, isLoadingRentBook, isBookRented, handleReturnBook, handleRentBook }) => {
    return (
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
                                <Button disabled={bookCopies[book.id] == 0} variant="primary" onClick={() => handleRentBook(book.id)}>
                                    Rent
                                </Button>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>
            <br />
        </React.Fragment>
    );
};

export default BookCard;