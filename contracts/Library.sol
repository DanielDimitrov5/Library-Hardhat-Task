// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

error Library_CopiesCannotBeZero();

error Library__InvalidBookId(uint256 id);
error Library__NoCopiesAvailable();
error Library__BookAlreadyBorrowedByYou();

error Library__YouHaventBorrowedThisBook(uint256 id);

contract Library is Ownable {

    uint256 public bookCount;

    struct Book {
        uint256 id;
        string name;
        uint16 copies;
    }

    mapping (uint256 => Book) public books;
    mapping(uint256 => mapping(address => bool)) public borrowed;
    mapping (uint256 => address[]) private borrowers;

    Book[] private bookArray;

    event LogNewBookAdded(uint256 id, string indexed name, uint16 copies);
    event LogBookBorrowed(address indexed borrower, uint256 indexed id);
    event LogBookReturned(address indexed borrower, uint256 indexed id);

    function addNewBook(string calldata _name, uint16 _copies) public onlyOwner returns(uint256) {
        if(_copies == 0) revert Library_CopiesCannotBeZero();

        ++bookCount;

        Book memory book =  Book(
            bookCount,
            _name,
            _copies
        );

        books[bookCount] = book;
        bookArray.push(book);

        emit LogNewBookAdded(book.id, _name, _copies);

        return bookCount;
    }

    function borrowBook(uint256 _id) public {
        if (books[_id].id == 0) revert Library__InvalidBookId(_id);
        
        if (borrowed[_id][msg.sender] == true) revert Library__BookAlreadyBorrowedByYou();

        if (books[_id].copies == 0) revert Library__NoCopiesAvailable();

        --books[_id].copies;
        borrowed[_id][msg.sender] = true;
        borrowers[_id].push(msg.sender);

        emit LogBookBorrowed(msg.sender, _id);
    }

    function returnBook(uint256 _id) public {
        if (borrowed[_id][msg.sender] == false) revert Library__YouHaventBorrowedThisBook(_id);

        ++books[_id].copies;
        borrowed[_id][msg.sender] = false;

        emit LogBookReturned(msg.sender, _id);
    }

    function getBorrowers(uint _id) public view returns (address[] memory) {
        return borrowers[_id];
    }

    function getBooks() public view returns(Book[] memory) {
        return bookArray;
    }
}