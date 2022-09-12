const homeRouter = require('express').Router();
const { Recipe, Unit, Ingredient, RecipeIngredient } = require('../models');

homeRouter.get( '/', ( req, res ) => {

// * homepage render
    
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
    user_id: req.session.user_id,
    recipe
   } );
  
  } catch ( err ) {
    res.status(400).json( err );
  }
} );


module.exports = homeRouter;