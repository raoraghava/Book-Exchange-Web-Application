import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


/** import all components */
import Username from './components/Username';
import Password from './components/Password';
import Register from './components/Register';
import HomePage from './components/homepage';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';
import AddBook from './components/addbook';
import MyBooks from './components/mybooks';
import BrowseBooks from './components/browsebooks';
import ManageExchanges from './components/manageexchanges';


/** auth middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth'

/** root routes */
const router = createBrowserRouter([
    {
        path : '/',
        element : <Username></Username>
    },
    {
        path : '/register',
        element : <Register></Register>
    },
    {
        path : '/password',
        element : <ProtectRoute><Password /></ProtectRoute>
    },
    {
        path : '/homepage',
        element : <AuthorizeUser><HomePage /></AuthorizeUser>
    },
    {
        path : '/recovery',
        element : <Recovery></Recovery>
    },
    {
        path : '/reset',
        element : <Reset></Reset>
    },
    {
        path : '*',
        element : <PageNotFound></PageNotFound>
    },
    {
        path: '/addbook',
        element : <AuthorizeUser><AddBook/></AuthorizeUser>
    },
    {
        path: '/books',
        element : <AuthorizeUser><MyBooks/></AuthorizeUser>
    },
    {
        path: '/browse',
        element : <AuthorizeUser><BrowseBooks/></AuthorizeUser>
    },
    {
        path: '/manage-requests',
        element : <AuthorizeUser><ManageExchanges/></AuthorizeUser>
    }
])

export default function App() {
  return (
    <main>
        <RouterProvider router={router}></RouterProvider>
        
    </main>
  )

}
