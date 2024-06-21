import React, { useState } from 'react';
import { addBook } from '../helper/helper';
import { useNavigate } from 'react-router-dom'


const AddBook = () => {
    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        genre: '',
        description: '',
        condition: '',
        bookurl: ''
    });

    const handleChange = (e) => {
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    };
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addBook(bookData);
            alert('Book added successfully!'); // Display a success message
            navigate('/homepage')
            console.log(response); // Log response data for reference
        } catch (error) {
            alert('Failed to add book'); // Display an error message
            console.error(error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
                    <input type="text" name="title" id="title" value={bookData.title} onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author:</label>
                    <input type="text" name="author" id="author" value={bookData.author} onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre:</label>
                    <input type="text" name="genre" id="genre" value={bookData.genre} onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
                    <textarea name="description" id="description" value={bookData.description} onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition:</label>
                    <input type="text" name="condition" id="condition" value={bookData.condition} onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                    <label htmlFor="bookurl;" className="block text-sm font-medium text-gray-700">Book URL:</label>
                    <input type="text" name="bookurl" id="bookurl" value={bookData.bookurl} onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
                    Add Book
                </button>
            </form>
        </div>
    );
};

export default AddBook;
