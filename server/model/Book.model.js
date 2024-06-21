import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a book title"]
    },
    author: {
        type: String,
        required: [true, "Please provide the author's name"]
    },
    genre: {
        type: String,
        required: [true, "Please specify the genre of the book"]
    },
    description: {
        type: String
    },
    condition: {
        type: String,
        required: [true, "Please specify the condition of the book"]
    },
    bookurl: {
        type: String,
        required: [true, "Please provide a book URL"]
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide the owner's user ID"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Book', bookSchema, "bookstore");