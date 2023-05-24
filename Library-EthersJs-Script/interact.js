import { ethers } from "ethers";
import { config } from "dotenv";
config();

const abi = [
    {
        "inputs": [],
        "name": "Library_CopiesCannotBeZero",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Library__BookAlreadyBorrowedByYou",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "Library__InvalidBookId",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Library__NoCopiesAvailable",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "Library__YouHaventBorrowedThisBook",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "LogBookBorrowed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "LogBookReturned",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint16",
                "name": "copies",
                "type": "uint16"
            }
        ],
        "name": "LogNewBookAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "uint16",
                "name": "_copies",
                "type": "uint16"
            }
        ],
        "name": "addNewBook",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "bookCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "books",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint16",
                "name": "copies",
                "type": "uint16"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "borrowBook",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "borrowed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBooks",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint16",
                        "name": "copies",
                        "type": "uint16"
                    }
                ],
                "internalType": "struct Library.Book[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getBorrowers",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "returnBook",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

// const address = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

const address = "0x5F81B135A28cA68aB6Ea67f50468dC40cceF0696";

const run = async () => {
    // const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

    // const walletDeployer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    // const wallerAddress1 = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider)

    const walletDeployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const wallerAddress1 = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    const libraryDeployer = new ethers.Contract(address, abi, walletDeployer);
    const libraryAddress1 = libraryDeployer.connect(wallerAddress1);

    // const addBookTx = await libraryDeployer.addNewBook("The Da Vinci Code", 3);
    // await addBookTx.wait();

    const books = await libraryDeployer.getBooks();

    books.forEach(book => {
        console.log(`${ethers.BigNumber.from(book.id).toString()} ${book.name}`);
    });
    console.log("--------------------------------------------------");

    const book = await libraryDeployer.books(5);

    const borrowxTx = await libraryAddress1.borrowBook(book.id, { gasLimit: 1000000 });
    await borrowxTx.wait();

    const borrowed = await libraryDeployer.borrowed(book.id, wallerAddress1.address);

    if (borrowed) {
        console.log(`Book ${book.name} borrowed successfully by ${wallerAddress1.address}`)

        const copiesLeft = (await libraryDeployer.books(book.id)).copies;
        console.log(`Book ${book.name} currently available in ${ethers.BigNumber.from(copiesLeft).toString()} copies.`);
    } else {
        console.log(`Book ${book.name} not borrowed by ${wallerAddress1.address}`)
    }
    console.log("--------------------------------------------------");

    const returnTx = await libraryAddress1.returnBook(book.id, { gasLimit: 1000000 });
    const retrunResult = await returnTx.wait();

    if(retrunResult.status === 1) {
        console.log(`Book ${book.name} returned successfully by ${wallerAddress1.address}`)
    } else {
        console.log(`Book ${book.name} not returned by ${wallerAddress1.address}`)
    }

    const bookAvailabelCopies = (await libraryDeployer.books(book.id)).copies;

    console.log(`Book ${book.name} currently available in ${ethers.BigNumber.from(bookAvailabelCopies).toString()} copies.`);
    console.log("--------------------------------------------------");
};

run();