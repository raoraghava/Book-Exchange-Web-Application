import React, { useEffect, useState } from 'react';
import { fetchMyBooks, deleteBook } from '../helper/helper';
import bookimage from '../assets/book.png';  // Ensure the path is correct

const MyBooks = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchMyBooks().then(setBooks).catch(error => {
            console.error('Failed to fetch books:', error);
        });
    }, []);

    const handleDelete = async (bookId) => {
        try {
            await deleteBook(bookId);
            setBooks(currentBooks => currentBooks.filter(book => book._id !== bookId));
            alert('Book deleted successfully!');
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete the book');
        }
    };

    const handleViewBook = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="container mx-auto px-1 py-3">
            <div className="grid grid-cols-1 gap-3">
                {books.map(book => (
                    <div key={book._id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
                        <img className="w-full h-48 object-cover" src={bookimage} alt="Book Cover" />

                        <div className="px-8 py-4">
                            <div className="font-bold text-xl mb-2">{book.title}</div>
                            <p className="text-gray-700 text-base">Author: {book.author}</p>
                            <p className="text-gray-600 text-base">Genre: {book.genre}</p>
                            <p className="text-gray-600 text-sm">Condition: {book.condition}</p>
                            <div className="flex justify-between items-center mt-4">
                                <button 
                                    onClick={() => handleViewBook(book.bookurl)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                                >
                                    View Book
                                </button>
                                <button 
                                    onClick={() => handleDelete(book._id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                                >
                                    Delete Book
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBooks;
