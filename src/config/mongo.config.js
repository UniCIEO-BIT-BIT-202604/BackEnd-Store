import mongoose from 'mongoose';

const LOCAL_STRING_CONNECTION = 'mongodb://localhost:27017/db-store';
const REMOTE_STRING_CONNECTION = 'mongodb+srv://jcarlosj:saARXutKrVvHFHsO@cluster0.lapkq.mongodb.net/'

async function dbConection () {
    try {
        await mongoose.connect( REMOTE_STRING_CONNECTION );
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error( error );
        console.error( `Connect Failed! :'(`);
    }

}

export default dbConection;