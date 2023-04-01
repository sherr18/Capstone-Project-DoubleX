// Import the express module
const express = require('express')
// Create a server instance of express
const app = express()

// Import cors middleware
const cors = require('cors')
// Register cors as global middleware
app.use(cors())
// Set public class
app.use(express.static("public"));
// Configure the intermediate plug-in that parses the form data
app.use(express.urlencoded({ extended: false }));




const tmdbController=require(process.cwd()+'/controller/tmdb');
app.get('/',tmdbController.indexMovie);
app.get('/movie',tmdbController.detailMovie);
app.get('/register',tmdbController.openRegister);
app.get('/login',tmdbController.openLogin);
app.get('/popularList',tmdbController.findTenMovieList);
app.get('/proplue',tmdbController.findMovieList);
app.get('/search/:query',tmdbController.searchMovie);


// Call the app.listen method, specify the port number, and start the web server
app.listen(3007, function () {
    //node app.js   
    console.log("http://localhost:3007/");
})