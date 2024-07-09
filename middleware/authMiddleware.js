// Middleware para asegurar que el usuario esté autenticado
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      console.log('Usuario autenticado correctamente.');
      return next();
  }
  console.log('Usuario no autenticado, redirigiendo a /store/login');
  res.redirect('/store/login');
};



// Middleware para redireccionamiento basado en roles
exports.redirectBasedOnRole = (req, res, next) => {
  if (req.isAuthenticated()) {
      if (req.user.user_role === 'admin') {
          return res.redirect('/products/admin/products'); // Redirige a la lista de productos para admin
      } else if (req.user.user_role === 'normal') {
          return res.redirect('/products/user-products'); // Redirige a la lista de productos para usuarios normales
      } else {
          // Manejar casos donde el rol no es ni admin ni normal
          console.log('Usuario autenticado pero sin rol válido, redirigiendo a /store/login');
          return res.redirect('/store/login');
      }
  }
  // Si no está autenticado, redirige al inicio de sesión
  console.log('Usuario no autenticado, redirigiendo a /store/login');
  res.redirect('/store/login');
};
