const homeRouter = require('express').Router();
const { Recipe, Unit, Ingredient, RecipeIngredient } = require('../models');

homeRouter.get( '/', ( req, res ) => {

// * homepage render
res.render( 'homePage', {
  logged_in: req.session.logged_in,
  user_name: req.session.user_name
} );
    
} );

homeRouter.get( '/login', ( req, res ) => {

    if ( req.session.logged_in ) {
      res.redirect( '/' );
      return;
    }
  
    res.render( 'login' );
} );

homeRouter.get( '/signup', ( req, res ) => {

  if ( req.session.logged_in ) {
    res.redirect( '/' );
    return;
  }

  res.render( 'signup' );
} );

homeRouter.get( '/recipes/:id', async ( req, res ) => {
  try { 
    const recipeData = await Recipe.findByPk( req.params.id, {
      include: {
        model: Ingredient,
        through: RecipeIngredient,
        as: 'ingredients',
        attributes: [ 'ingredient_name' ],
        include: {
          model: Unit,
          through: RecipeIngredient,
          as: 'unit'
        }
      } 
  } );

  if ( !recipeData ) {
    res.render( '404', {
      logged_in: req.session.logged_in,
      user_name: req.session.user_name
  } );
  return;

  }

  const recipe = recipeData.toJSON();

  if ( !recipe.public && recipe.user_id !== req.session.user_id ) {
    res.render( '401', {
      logged_in: req.session.logged_in,
      user_name: req.session.user_name
  } );
  return;

  }

  res.render( 'recipe', {
    logged_in: req.session.logged_in,
    user_id: req.session.user_id,
    user_name: req.session.user_name,
    recipe
   } );
  
  } catch ( err ) {
    res.status(400).json( err );
  }
} );

// * IMPORTANT Do Not add any routes below the wildcard route
homeRouter.get( '/*', ( req, res ) => {
  res.render( '404', {
      logged_in: req.session.logged_in,
      user_name: req.session.user_name
  } );
} );

module.exports = homeRouter;