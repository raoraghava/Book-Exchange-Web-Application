import axios from 'axios';
import jwt_decode from 'jwt-decode';

axios.defaults.baseURL = "http://localhost:8080";


/** Make API Requests */


/** To get username from Token */
export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find Token");
    let decode = jwt_decode(token)
    return decode;
}

/** authenticate function */
export async function authenticate(username){
    try {
        return await axios.post('/api/authenticate', { username })
    } catch (error) {
        return { error : "Username doesn't exist...!"}
    }
}

/** get User details */
export async function getUser({ username }){
    try {
        const { data } = await axios.get(`/api/user/${username}`);
        return { data };
    } catch (error) {
        return { error : "Password doesn't Match...!"}
    }
}

/** register user function */
export async function registerUser(credentials){
    try {
        const { data : { msg }, status } = await axios.post(`/api/register`, credentials);

        let { username, email } = credentials;

        /** send email */
        if(status === 201){
            await axios.post('/api/registerMail', { username, userEmail : email, text : msg})
        }

        return Promise.resolve(msg)
    } catch (error) {
        return Promise.reject({ error })
    }
}

/** login function */
export async function verifyPassword({ username, password }){
    try {
        if(username){
            const { data } = await axios.post('/api/login', { username, password })
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error : "Password doesn't Match...!"})
    }
}

/** update user profile function */
export async function updateUser(response){
    try {
        
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers : { "Authorization" : `Bearer ${token}`}});

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error : "Couldn't Update Profile...!"})
    }
}

/** generate OTP */
export async function generateOTP(username){
    try {
        const {data : { code }, status } = await axios.get('/api/generateOTP', { params : { username }});

        // send mail with the OTP
        if(status === 201){
            let { data : { email }} = await getUser({ username });
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject : "Password Recovery OTP"})
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error });
    }
}

/** verify OTP */
export async function verifyOTP({ username, code }){
    try {
       const { data, status } = await axios.get('/api/verifyOTP', { params : { username, code }})
       return { data, status }
    } catch (error) {
        return Promise.reject(error);
    }
}

/** reset password */
export async function resetPassword({ username, password }){
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return Promise.resolve({ data, status})
    } catch (error) {
        return Promise.reject({ error })
    }
}



export async function addBook(bookData) {
    try {
        const response = await axios.post('/api/books', bookData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data; // Response from server after adding the book
    } catch (error) {
        throw error;
    }
}
export async function fetchMyBooks() {
    try {
        const response = await axios.get('/api/my-books', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data; // Returns the array of books
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
}

export async function browseBooks() {
    try {
        const response = await axios.get('/api/browse-books', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data; // Returns the array of books
    } catch (error) {
        console.error('Error browsing books:', error);
        throw error;
    }
}

export async function requestExchange(bookId) {
    try {
        const response = await axios.post('/api/exchanges', { bookId }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error requesting exchange:', error);
        throw error;
    }
}



export async function getMyExchanges() {
    try {
        const response = await axios.get('/api/exchanges/my', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch exchanges:', error);
        throw error;
    }
}

export async function respondToExchange(exchangeId, decision) {
    try {
        const response = await axios.put(`/api/respond/${exchangeId}`, { decision }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to respond to exchange:', error);
        throw error;
    }
}

export async function deleteBook(bookId) {
    const response = await axios.delete(`/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.message;
}



