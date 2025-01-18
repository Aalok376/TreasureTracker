/*const express = require('express');
const http = require('http');  // Import http
const socketIo = require('socket.io');  // Import socket.io
const path = require('path');
const connectToDatabase = require('./data/database').connectToDatabase;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const app = express();

// Create server instance
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server);  // Pass the server to socket.io

// Import routes
const userRoutes = require('./routes/routes')(io);  // Pass io to the routes

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
 
  resave: false,
  saveUninitialized: true,
}));
app.use(methodOverride('_method'));

// View engine
app.set('view engine', 'ejs');

// Use routes
app.use('/', userRoutes);
// Connect to the database
connectToDatabase();

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {  
  console.log(`Server is running on port ${PORT}`);
});
*/
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const connectToDatabase = require('./data/database').connectToDatabase;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//const userRoutes = require('./routes/routes')(io);  // Pass io to the routes
const userRoutes = require('./routes/routes')(io);  // Pass io to the routes
console.log(typeof userRoutes);  // Should log 'function' or 'object'
app.use('/', userRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'your_secret_key',  // Add a secret for session encryption
  resave: false,
  saveUninitialized: true,
}));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

app.use('/', userRoutes);

connectToDatabase();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

