const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensureAuthenticated, redirectBasedOnRole } = require('../middleware/authMiddleware');


router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

router.post('/register', userController.createUser);

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/test', (req, res) => {
    res.send('Test route is working!');
});

router.post('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/users/edit/:id', ensureAuthenticated, userController.editUser);
router.get('/users',ensureAuthenticated, userController.getUsers);
router.post('/users/update/:id',ensureAuthenticated, userController.updateUser); 
router.delete('/users/:id',ensureAuthenticated, userController.deleteUser);


module.exports = router;
