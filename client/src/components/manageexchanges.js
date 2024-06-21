import React, { useEffect, useState } from 'react';
import { getMyExchanges, respondToExchange } from '../helper/helper';

const ManageExchanges = () => {
    const [exchanges, setExchanges] = useState([]);

    useEffect(() => {
        fetchExchanges();
    }, []);

    const fetchExchanges = async () => {
        try {
            const data = await getMyExchanges();
            setExchanges(data);
        } catch (error) {
            console.error('Error fetching exchanges:', error);
        }
    };

    const handleResponse = async (exchangeId, decision) => {
        try {
            await respondToExchange(exchangeId, decision);
            // Refresh the list of exchanges by filtering out the responded exchange
            setExchanges(exchanges.filter(exchange => exchange._id !== exchangeId));
        } catch (error) {
            console.error('Error responding to exchange:', error);
            alert('Failed to update exchange status.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-xl font-bold mb-4">Incoming Exchange Requests</h2>
            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Book Title</th>
                        <th className="py-3 px-6 text-left">Requester</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {exchanges.map((exchange) => (
                        <tr key={exchange._id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left">{exchange.book?.title || 'Book no longer available'}</td>
                            <td className="py-3 px-6 text-left">{exchange.requester.username}</td>
                            <td className="py-3 px-6 text-center">
                                <button 
                                    onClick={() => handleResponse(exchange._id, 'accept')}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                                >
                                    Accept
                                </button>
                                <button 
                                    onClick={() => handleResponse(exchange._id, 'decline')}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center ml-4"
                                >
                                    Decline
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageExchanges;
