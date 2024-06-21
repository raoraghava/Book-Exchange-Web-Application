import React, { useEffect, useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import mainImage from '../assets/home.png'

const HomePage = () => {
    
    const navigate = useNavigate();
    const { auth, setUsername } = useAuthStore();

    useEffect(() => {
        if (!auth.username) {
            // Attempt to re-fetch or re-set the username if it's missing
            const storedUsername = localStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername);
            } else {
                // Handle scenario where username is not available
                navigate('/'); // Redirect to login or a suitable action
            }
        }
    }   
    )
    function userLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <nav className="bg-white shadow-md py-4">
                <div className="max-w-screen-xl mx-auto px-4 flex justify-around text-center">
                    <Link to="/books" className="text-blue-500 hover:text-blue-700 transition-colors">My Books</Link>
                    <Link to="/addbook" className="text-blue-500 hover:text-blue-700 transition-colors">Add Book</Link>
                    <Link to="/browse" className="text-blue-500 hover:text-blue-700 transition-colors">Browse Books</Link>
                    <button onClick={userLogout} className="text-blue-500">Logout</button>
                </div>
            </nav>
            
            <h1 className="text-4xl font-bold text-center  text-gray-800 pt-10">Welcome to Book Exchange, {auth.username}!</h1>
            <div className='text-center py-5'>
                <Link to="/manage-requests" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Manage Exchange Requests
                </Link>
            </div>
            <img src={mainImage} alt="Main Banner" className="max-w-md mx-auto h-auto"/> 
            
        </div>
    );
}

export default HomePage;
