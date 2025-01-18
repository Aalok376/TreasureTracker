/*const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../Model/User'); 
const Message = require('../Model/Message');  
const multer = require('multer');
const path = require('path');

module.exports = function(io){
   
  io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

     socket.on('sendMessage', (data) => {
      console.log('Received message:', data);
       io.emit('receiveMessage', data);
    });

     socket.on('disconnect', () => {
      console.log('User disconnected: ' + socket.id);
    });
  });

   router.get('/register', (req, res) => {
    res.render('register');
  });

  router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role || 'user',  
      });

      await newUser.save();
      res.redirect('/login');  
    } catch (err) {
      console.error(err);
      res.status(500).send('Error during registration.');
    }
  });

   router.get('/login', (req, res) => {
    res.render('login');
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).send('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).send('Invalid credentials');
      }

       
      req.session.userId = user._id;
      res.redirect('/dashboard');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error during login.');
    }
  });

  // Dashboard Route (Only accessible after login)
  router.get('/dashboard', async (req, res) => {
    if (!req.session.userId) {
      return res.redirect('/login');  
    }
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
          return res.status(404).send('User not found');
        }
        res.render('dashboard', { user });
      } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving user.');
      }
    });
  
    
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${req.session.userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
      }
    });
  
    const upload = multer({ storage: storage });
  
    
    router.post('/update-profile-pic', upload.single('profilePicture'), async (req, res) => {
      if (!req.session.userId) {
        return res.redirect('/login');
      }
  
      try {
        await User.findByIdAndUpdate(req.session.userId, { profilePicture: req.file.filename });
        res.redirect('/dashboard');
      } catch (err) {
        console.error(err);
        res.status(500).send('Error updating profile picture');
      }
    });
// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error logging out:', err);
        return res.status(500).send('Error during logout.');
      }
      res.clearCookie('connect.sid');  
      res.redirect('/login');
    });
  });

  // Chat Route
  router.get('/chat', async (req, res) => {
    if (!req.session.userId) {
      return res.redirect('/login');  
    }

    try {
      const loggedInUser = await User.findById(req.session.userId);
      if (!loggedInUser) {
        return res.status(404).send('User not found');
      }

      const oppositeRole = loggedInUser.role === 'admin' ? 'user' : 'admin';
      const users = await User.find({ role: oppositeRole });

      res.render('chat', { user: loggedInUser, users });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving chat data.');
    }
  });

  // Fetch messages between the logged-in user and selected user
  router.get('/chat/messages/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
      const chatUser = await User.findById(userId);
      if (!chatUser) {
        return res.status(404).json({ message: 'Chat user not found' });
      }

      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: 'Logged-in user not found' });
      }

      const messages = await Message.find({
        $or: [
          { sender_id: req.session.userId, receiver_id: userId },
          { sender_id: userId, receiver_id: req.session.userId }
        ]
      }).sort({ createdAt: 1 });

      res.json(messages);
    } catch (err) {
      console.error('Error retrieving messages:', err);
      res.status(500).json({ message: 'Error retrieving messages' });
    }
  });

  // Send a message
  router.post('/chat/sendMessage', async (req, res) => {
    const { message, receiverId } = req.body;

    try {
      const sender = await User.findById(req.session.userId);
      if (!sender) {
        return res.status(404).json({ message: 'Logged-in user not found' });
      }

      const receiver = await User.findById(receiverId);
      if (!receiver) {
        return res.status(404).json({ message: 'Receiver user not found' });
      }

      const newMessage = new Message({
        sender_id: sender._id,
        receiver_id: receiver._id,
        message,
        createdAt: new Date(),
      });
      await newMessage.save();

      io.emit('receiveMessage', {
       senderId: sender._id,
       receiverId: receiver._id,
       message: newMessage.message,
       createdAt: newMessage.createdAt,
       senderName: sender.name,
     });

     res.json({ success: true, message: newMessage });
   } catch (err) {
     console.error('Error sending message:', err);
     res.status(500).json({ message: 'Error sending message' });
   }
 });

 return router;
};*/
console.log('routes.js loaded');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../Model/User'); 
const Message = require('../Model/Message');  
const multer = require('multer');
const path = require('path');

module.exports = function(io) {
  console.log('routes.js function executed');
  
  // Socket.io setup
  io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    socket.on('sendMessage', (data) => {
      console.log('Received message:', data);
      io.emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected: ' + socket.id);
    });
  });

  // Define all routes here
  router.get('/register', (req, res) => {
    res.render('register');
  });

  router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
      });

      await newUser.save();
      res.redirect('/login');  
    } catch (err) {
      console.error(err);
      res.status(500).send('Error during registration.');
    }
  });

  router.get('/login', (req, res) => {
    res.render('login');
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).send('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).send('Invalid credentials');
      }

      req.session.userId = user._id;
      res.redirect('/dashboard');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error during login.');
    }
  });

  router.get('/dashboard', async (req, res) => {
    if (!req.session.userId) {
      return res.redirect('/login');  
    }
    try {
      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.render('dashboard', { user });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving user.');
    }
  });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${req.session.userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });

  const upload = multer({ storage: storage });

  router.post('/update-profile-pic', upload.single('profilePicture'), async (req, res) => {
    if (!req.session.userId) {
      return res.redirect('/login');
    }

    try {
      await User.findByIdAndUpdate(req.session.userId, { profilePicture: req.file.filename });
      res.redirect('/dashboard');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating profile picture');
    }
  });

  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error logging out:', err);
        return res.status(500).send('Error during logout.');
      }
      res.clearCookie('connect.sid');  
      res.redirect('/login');
    });
  });

  router.get('/chat', async (req, res) => {
    if (!req.session.userId) {
      return res.redirect('/login');  
    }

    try {
      const loggedInUser = await User.findById(req.session.userId);
      if (!loggedInUser) {
        return res.status(404).send('User not found');
      }

      const oppositeRole = loggedInUser.role === 'admin' ? 'user' : 'admin';
      const users = await User.find({ role: oppositeRole });

      res.render('chat', { user: loggedInUser, users });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving chat data.');
    }
  });

  router.get('/chat/messages/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
      const messages = await Message.find({
        $or: [
          { sender_id: req.session.userId, receiver_id: userId },
          { sender_id: userId, receiver_id: req.session.userId }
        ]
      }).sort({ createdAt: 1 });

      res.json(messages);
    } catch (err) {
      console.error('Error retrieving messages:', err);
      res.status(500).json({ message: 'Error retrieving messages' });
    }
  });

  router.post('/chat/sendMessage', async (req, res) => {
    const { message, receiverId } = req.body;

    try {
      const newMessage = new Message({
        sender_id: req.session.userId,
        receiver_id: receiverId,
        message,
        createdAt: new Date(),
      });
      await newMessage.save();

      io.emit('receiveMessage', {
        senderId: req.session.userId,
        receiverId,
        message: newMessage.message,
        createdAt: newMessage.createdAt,
      });

      res.json({ success: true, message: newMessage });
    } catch (err) {
      console.error('Error sending message:', err);
      res.status(500).json({ message: 'Error sending message' });
    }
  });

  return router;
};
