import app from './app.js'
import connectDB from './config/db.js'; // import the database connection function

const port = process.env.PORT || 5000;

// Connect DB first and then start the server
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server started at ${port}`)
    }); // start the server and listen on the specified port
});