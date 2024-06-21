import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import { browseBooks, requestExchange } from '../helper/helper';
import bookimage from '../assets/book.png'
const BrowseBooks = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        browseBooks().then(books => {
            setBooks(books);
        }).catch(error => {
            console.error('Failed to fetch books:', error);
        });
    }, []);

    const handleRequestExchange = async (bookId) => {
        try {
            const response = await requestExchange(bookId);
            alert('Request sent: ' + response.message);
        } catch (error) {
            alert('Failed to request exchange');
            console.error('Error requesting exchange:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Browse Books</h1>
                <Link to="/homepage" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Home
                </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                {books.map(book => (
                    <div key={book._id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white"> {/* Ensure bg-white is applied here */}
                        <img
    className="w-full" // You might want to adjust or remove this class if it conflicts with your inline styles
    src={bookimage}
    alt="Book Cover"
    style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px',  }} // Controlling size here
/>
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-2">{book.title}</div>
                            <p className="text-gray-700 text-base">Author: {book.author}</p>
                            <p className="text-gray-600 text-sm">Genre: {book.genre}</p>
                            <p className="text-gray-600 text-sm">Condition: {book.condition}</p>
                            <p className="text-gray-600 text-sm">Owner: {book.ownerUsername}</p> {/* Display the owner's name */}
                            <button
                                onClick={() => handleRequestExchange(book._id)}
                                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Request Book
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrowseBooks;
