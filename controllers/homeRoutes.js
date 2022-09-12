const homeRouter = require('express').Router();
const { Recipe, Unit, Ingredient, RecipeIngredient } = require('../models');

homeRouter.get( '/', ( req, res ) => {

// * homepage render
res.render( 'homepage', {
  logged_in: req.session.logged_in,
  userName: req.session.userName
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

  const recipe = recipeData.toJSON();

  res.render( 'recipe', {
    logged_in: req.session.logged_in,
    user_id: req.session.user_id,
    userName: req.session.userName,
    recipe
   } );
  
  } catch ( err ) {
    res.status(400).json( err );
  }
} );


module.exports = homeRouter;