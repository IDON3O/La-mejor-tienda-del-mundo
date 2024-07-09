const User = require('../src/models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const passport = require('passport');

// Schema de validación
const userSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required()
});

async function createUser(req, res) {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).render('register', { 
      title: 'Register', 
      errorMessage: error.details[0].message 
    });
  }

  const { username, password, email } = value;
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).render('register', { 
        title: 'Register', 
        errorMessage: 'User already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword, email });
    res.status(201).render('login', { 
      title: 'Login', 
      successMessage: 'User created successfully. Please log in.' 
    });
  } catch (error) {
    res.status(400).render('register', { 
      title: 'Register', 
      errorMessage: error.message 
    });
  }
}
exports.createUser = createUser;

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render('login', { 
        title: 'Login', 
        errorMessage: 'Login failed. Incorrect username or password.' 
      });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.redirect('/products/redirect');
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
};

exports.editUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.render('editUser', { title: 'Edit User', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  console.log('Updating user with id:', req.params.id); // Log para depuración
  console.log('Request body:', req.body); // Log para depuración

  const { id } = req.params;
  const { username, email, user_role } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = username;
    user.email = email;
    user.user_role = user_role;

    await user.save();

    res.redirect('/store/users'); // Redirigir a la lista de usuarios
  } catch (error) {
    res.status(400).render('editUser', {
      title: 'Edit User',
      errorMessage: error.message,
      user: req.body
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('userList', { title: 'User List', users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();

    res.redirect('/store/users'); // Redirigir a la lista de usuarios o a donde sea necesario
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};