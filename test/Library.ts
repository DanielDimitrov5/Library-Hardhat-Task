import { Library__factory } from "../typechain-types";
import { Library } from "../typechain-types";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("Library", function () {
    let library: Library;
    let libraryFactory: Library__factory;

    let deployer: any;
    let address1: any;
    let address2: any;

    before(async () => {
        libraryFactory = await ethers.getContractFactory("Library") as Library__factory;

        library = await libraryFactory.deploy();

        await library.deployed();

        [deployer, address1, address2] = await ethers.getSigners();
    });

    describe("Deployment", () => {
        it("Should set the right owner", async function () {
            expect(await library.owner()).to.equal(deployer.address);
        });
    });

    describe("addNewBook", () => {

        it("Should revert if not called by owner", async () => {
            await expect(library.connect(address1).addNewBook("Harry Potter", 10)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("SHould revert if copies are less than 1", async () => {
            await expect(library.addNewBook("Harry Potter", 0)).to.be.revertedWithCustomError(library, "Library_CopiesCannotBeZero");
        });

        it("Should add a new book", async () => {
            await library.addNewBook("Harry Potter", 10)

            expect(await library.bookCount()).to.equal(1);

            const [id, title, copies] = await library.books(1);

            expect(id).to.equal(1);
            expect(title).to.equal("Harry Potter");
            expect(copies).to.equal(10);
        });

        it("Should emit event", async () => {
            await expect(library.addNewBook("War and Peace", 5)).to.emit(library, "LogNewBookAdded").withArgs(2, "War and Peace", 5);
        });
    });

    describe("borrowBook", () => {
        it("Should revert if book'is is invalid", async () => {
            await expect(library.borrowBook(100)).to.be.revertedWithCustomError(library, "Library__InvalidBookId").withArgs(100);
        });

        before(async () => {
            await library.addNewBook("The Maze Runner", 1);
            await library.borrowBook(3);
        });

        it("Should revert if book is borrowed by the same user", async () => {
            await expect(library.borrowBook(3)).to.be.revertedWithCustomError(library, "Library__BookAlreadyBorrowedByYou");
        });

        it("Should revert if book is not available", async () => {
            await expect(library.connect(address1).borrowBook(3)).to.be.revertedWithCustomError(library, "Library__NoCopiesAvailable");
        });

        it("Should borrow book", async () => {
            const bookId = 1;

            const initialCopies = (await library.books(bookId)).copies;

            await library.connect(address2).borrowBook(bookId);

            expect((await library.books(bookId)).copies).to.equal(initialCopies - 1);
            expect(await library.borrowed(bookId, address2.address)).to.be.true;
        });

        it("Should emit event", async () => {
            await expect(library.connect(address1).borrowBook(1)).to.emit(library, "LogBookBorrowed").withArgs(address1.address, 1);
        });
    });

    describe("returnBook", () => {
        it("Should revert if sender haven't borrowed this book", async () => {
            await expect(library.returnBook(1)).to.be.revertedWithCustomError(library, "Library__YouHaventBorrowedThisBook").withArgs(1);
        });

        it("Should return book", async () => {
            const bookId = 1;

            const initialCopies = (await library.books(bookId)).copies;

            await library.connect(address2).returnBook(bookId);

            expect((await library.books(bookId)).copies).to.equal(initialCopies + 1);
            expect(await library.borrowed(bookId, address2.address)).to.be.false;
        });

        it("Should emit event", async () => {
            await expect(library.connect(address1).returnBook(1)).to.emit(library, "LogBookReturned").withArgs(address1.address, 1);
        });
    });

    describe("View functions", () => {
        it("getBorrowers", async () => {
            expect(await library.getBorrowers(1)).to.deep.equal([address2.address, address1.address]);
        });

        it("getBooks", async () => {
            expect(await library.getBooks()).to.deep.equal([
                [1, "Harry Potter", 10],
                [2, "War and Peace", 5],
                [3, "The Maze Runner", 1]
            ]);
        });
    });
});