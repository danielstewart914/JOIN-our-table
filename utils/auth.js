const isAuthorized = ( req, res, next ) => {
    if ( !req.session.loggedIn ) {
      res.redirect('/login');
    } else {
      next();
    }
  };
  
  module.exports = isAuthorized;