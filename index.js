const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const sequelize = require('./db/sequelize');
const User = require('./src/models/user');
const Product = require('./src/models/product');
const configureRoutes = require('./routes/index');
const flash = require('express-flash');
const methodOverride = require('method-override');

dotenv.config();


const app = express();
// Middleware para analizar el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true })); // Para manejar datos de formularios
app.use(express.json()); // Para manejar JSON

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));


// Configuración de la vista
app.set('views', './src/views')
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la sesión
app.use(session({
  secret: 'contraseña mamalona', 
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// Inicialización de Passport y sesión Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración de rutas
configureRoutes(app);

// Manejo de la ruta raíz
app.get('/', (req, res) => {
  res.redirect('/store'); // Redirige a la página principal de la tienda
});

// Configuración de Passport local strategy
//Intente mover la configuración de Passport a un archivo separado, como passport-config.js, y luego importarlo en index.js. pero no funciono.
passport.use(new LocalStrategy(
  {
      usernameField: 'username', 
      passwordField: 'password'  
  },
  async function(username, password, done) {
      try {
          const user = await User.findOne({ where: { username } });
          if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
          }
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
              return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
      } catch (err) {
          return done(err);
      }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findByPk(id);
      done(null, user);
  } catch (err) {
      done(err);
  }
});

// Middleware para pasar la información del usuario a todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});



// Sincronización de la base de datos
User.associate({ Product });
Product.associate({ User });
// Definir las relaciones
User.hasMany(Product, { foreignKey: 'userId', sourceKey: 'id' });
Product.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

sequelize.sync({ force: false }).then(() => { // Cambiado a 'force: false' para evitar la eliminación de datos
  console.log('Database & tables created!');
});

// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
