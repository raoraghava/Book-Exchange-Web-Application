import UserModel from '../model/User.model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import otpGenerator from 'otp-generator';
import Book from '../model/Book.model.js';
import Exchange from '../model/exchange.model.js'

export async function addBook(req, res) {
    try {
        const { title, author, genre, description, condition, bookurl } = req.body;
        const userId = req.user.userId; // Make sure to use the correct field from req.user

        // Create a new book
        const book = new Book({
            owner: userId,
            title,
            author,
            genre,
            description,
            condition,
            bookurl
        });

        await book.save();
        res.status(201).json({ message: 'Book added successfully', bookId: book._id });
    } catch (error) {
        console.error('Failed to add book:', error);
        res.status(500).send({ message: 'Failed to add book', error: error.message });
    }
};


/** middleware for verify user */
export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}



/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {
    const { username, password, profile, email } = req.body;

    try {
        // Check for existing username
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(409).send({ error: "Username already exists. Please use a unique username." });
        }

        // Check for existing email
        const existingEmail = await UserModel.findOne({ email });
        if (existingEmail) {
            return res.status(409).send({ error: "Email already exists. Please use a unique email." });
        }

        // If no user is found with the same username or email, proceed to hash password
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || '',
                email
            });

            // Save the new user
            await user.save();
            return res.status(201).send({ msg: "User registered successfully" });
        } else {
            return res.status(400).send({ error: "Password is required" });
        }
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).send({ error: "Server error during registration" });
    }
}


/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req,res){
   
    const { username, password } = req.body;

    try {
        
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

                        // create jwt token
                        const token = jwt.sign({
                                        userId: user._id,
                                        username : user.username
                                    }, ENV.JWT_SECRET , { expiresIn : "24h"});

                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });                                    

                    })
                    .catch(error =>{
                        return res.status(400).send({ error: "Password does not Match"})
                    })
            })
            .catch( error => {
                return res.status(404).send({ error : "Username not Found"});
            })

    } catch (error) {
        return res.status(500).send({ error});
    }
}


/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req,res){
    
    const { username } = req.params;

    try {
        
        if(!username) return res.status(501).send({ error: "Invalid Username"});

        UserModel.findOne({ username }, function(err, user){
            if(err) return res.status(500).send({ err });
            if(!user) return res.status(501).send({ error : "Couldn't Find the User"});

            /** remove password from user */
            // mongoose return unnecessary data with object so convert it into json
            const { password, ...rest } = Object.assign({}, user.toJSON());

            return res.status(201).send(rest);
        })

    } catch (error) {
        return res.status(404).send({ error : "Cannot Find User Data"});
    }

}


/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req,res){
    try {
        
        // const id = req.query.id;
        const { userId } = req.user;

        if(userId){
            const body = req.body;

            // update the data
            UserModel.updateOne({ _id : userId }, body, function(err, data){
                if(err) throw err;

                return res.status(201).send({ msg : "Record Updated...!"});
            })

        }else{
            return res.status(401).send({ error : "User Not Found...!"});
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){
   if(req.app.locals.resetSession){
        return res.status(201).send({ flag : req.app.locals.resetSession})
   }
   return res.status(440).send({error : "Session expired!"})
}


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req,res){
    try {
        
        if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});

        const { username, password } = req.body;

        try {
            
            UserModel.findOne({ username})
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ username : user.username },
                            { password: hashedPassword}, function(err, data){
                                if(err) throw err;
                                req.app.locals.resetSession = false; // reset session
                                return res.status(201).send({ msg : "Record Updated...!"})
                            });
                        })
                        .catch( e => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error : "Username not Found"});
                })

        } catch (error) {
            return res.status(500).send({ error })
        }

    } catch (error) {
        return res.status(401).send({ error })
    }
}


export async function getMyBooks(req, res){
    try {
        // Assume user ID is stored in req.user.userId after authentication
        const books = await Book.find({ owner: req.user.userId });
        res.json(books);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving books', error });
    }
};

export async function browseBooks(req, res) {
    try {
        // Fetch all books except those owned by the logged-in user and populate owner details
        const books = await Book.find({ owner: { $ne: req.user.userId } })
                                .populate({
                                    path: 'owner',
                                    select: 'username'  // Only fetch the username of the owner
                                });
        res.json(books.map(book => ({
            ...book.toObject(),
            ownerUsername: book.owner.username  // Include the owner's username in the response
        })));
    } catch (error) {
        console.error('Error retrieving books:', error);
        res.status(500).send({ message: 'Error retrieving books', error });
    }
};



export async function requestExchange(req, res) {
    const { bookId } = req.body;
    const book = await Book.findById(bookId);
    if (!book) {
        return res.status(404).send({ message: 'Book not found' });
    }

    const exchange = new Exchange({
        book: bookId,
        requester: req.user.userId,
        owner: book.owner
    });

    await exchange.save();
    res.status(201).json({ message: 'Exchange requested', exchange });
};

// PUT /api/exchanges/:id/respond
export async function respondToExchange(req, res){
    const { id } = req.params;  // Retrieves the ID from the URL parameter
    const { decision } = req.body; // Decision could be 'accept' or 'decline'

    try {
        const exchange = await Exchange.findById(id);
        if (!exchange) {
            return res.status(404).json({ message: 'Exchange request not found' });
        }

        if (decision === 'accept') {
            const book = await Book.findById(exchange.book);
            if (!book) {
                return res.status(404).send({ message: 'Book not found' });
            }
            book.owner = exchange.requester;  // Transfer ownership to the requester
            await book.save();

            exchange.status = 'accepted';
            exchange.respondedAt = new Date(); // This line updates the time of response
            await exchange.save();

            res.json({ message: 'Exchange accepted and book transferred', exchange });
        } else {
            exchange.status = 'declined';
            exchange.respondedAt = new Date(); // Updates the time of response on decline as well
            await exchange.save();
            res.json({ message: 'Exchange declined', exchange });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error responding to exchange request', error });
    }
};


export const getMyExchanges = async (req, res) => {
    try {
        const userId = req.user.userId; // Assumed that authenticate middleware sets `req.user`

        // Fetch exchanges where the logged-in user is either the requester or the owner
        const exchanges = await Exchange.find({
            $or: [
                { requester: userId },
                { owner: userId }
            ]
        })
        .populate({
            path: 'book',
            match: { _id: { $ne: null } }  // Ensure book is not null
        })
        .populate('requester', 'username')  // Populate requester's username
        .populate('owner', 'username');     // Populate owner's username

        // Filter out exchanges where the book is null after population
        const filteredExchanges = exchanges.filter(exchange => exchange.book !== null);

        res.json(filteredExchanges);
    } catch (error) {
        console.error('Error retrieving user exchanges:', error);
        res.status(500).json({ message: 'Failed to retrieve exchanges', error });
    }
};


export async function deleteBook(req, res) {
    try {
        const bookId = req.params.id;
        const userId = req.user.userId; // Assumed to be set from auth middleware

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this book" });
        }

        await book.remove();
        res.status(200).json({ message: "Book successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}





