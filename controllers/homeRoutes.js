const homeRouter = require('express').Router();
const { Router } = require('express');
const sequelize = require('../config/connection');
const { } = require('../models');

homeRouter.get( '/login', ( req, res ) => {

// * homepage render
    
} );

homeRouter.get( '/login', ( req, res ) => {

    if ( req.session.loggedIn ) {
      res.redirect( '/' );
      return;
    }
  
    res.render( 'login' );
} );

homeRouter.get( '/signup', ( req, res ) => {

  if ( req.session.loggedIn ) {
    res.redirect( '/' );
    return;
  }

  res.render( 'signup' );
} );


module.exports = homeRouter;