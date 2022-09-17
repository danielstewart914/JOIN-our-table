const homeRouter = require('express').Router();
const { Recipe, Unit, Ingredient, RecipeIngredient } = require('../models');
const isAuthorized = require('../utils/auth');
const { Op } = require("sequelize");


homeRouter.get( '/', async ( req, res ) => {
// * homepage render
  try {
    const recipesData = await Recipe.findAll({
      where: {
        public: true
      },
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 6
    });
    const recipes = recipesData.map( recipe => recipe.toJSON() );
      res.render( 'homePage', {
        logged_in: req.session.logged_in,
        user_name: req.session.user_name,
        recipes
      });
    } catch ( err ) {
      res.status(400).json( err );
    }   
});

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

homeRouter.get( '/recipes/new', isAuthorized, async ( req, res ) => {

  res.render( 'newRecipe', {
    logged_in: req.session.logged_in,
    user_id: req.session.user_id,
    user_name: req.session.user_name,
  } );
});

homeRouter.get('/recipes/search', async (req, res) => {
  const ingredientsData = await Ingredient.findAll( {
    order: [
      [ 'ingredient_name', 'ASC' ]
    ]
  });
  
  const ingredients = ingredientsData.map(ingredient => ingredient.toJSON())
  
  res.render('search', {
    logged_in: req.session.logged_in,
    user_id: req.session.user_id,
    user_name: req.session.user_name,
    ingredients
  })
})

homeRouter.get( '/recipes', async ( req, res ) => {
  try { 
    const recipesData = await Recipe.findAll({
        where: {
          public: true
        },
        order: [
          ['createdAt', 'DESC']
        ]
  } );

  const recipes = recipesData.map( recipe => recipe.toJSON() );

  res.render( 'allRecipes', {
    logged_in: req.session.logged_in,
    user_id: req.session.user_id,
    user_name: req.session.user_name,
    recipes
   });
  
  } catch ( err ) {
    res.status(400).json( err );
  }
});

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
          as: 'unit',
          where: {
            '$ingredients.unit.recipeIngredient.recipe_id$': req.params.id
          }
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
});

// create a GET route for /profile
homeRouter.get("/profile", isAuthorized, async (req, res) => {
  
  try {
    
    const recipeData = await Recipe.findAll({
      where: { user_id: req.session.user_id },
    });
    let recipes
    if (recipeData) {
      recipes = recipeData.map((recipe) => recipe.toJSON());
    } else {
      recipes = false;
    }
      

    res.render("profile", {
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      user_name: req.session.user_name,
      recipes,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

homeRouter.get('/recipes/ingredient/:id', async (req, res) => {
  try {
    const recipeData = await Recipe.findAll({
      where: { 
        [Op.and]: [
          { '$ingredients.id$': req.params.id },
          { public: true }
        ]
        },
      include: {
        model: Ingredient,
        through: RecipeIngredient,
        as: 'ingredients',
      }
    })
    if ( !recipeData ) {
      res.render( '404', {
        logged_in: req.session.logged_in,
        user_name: req.session.user_name
    } );
    return;
    }
    const ingredientData = await Ingredient.findByPk(req.params.id)

    const ingredient = ingredientData.toJSON()
    
    const recipes = recipeData.map( recipe => recipe.toJSON() );
    res.render( 'recipeResults', {
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      user_name: req.session.user_name,
      recipes,
      ingredient_name: ingredient.ingredient_name
     });
  } catch ( err ) {
    res.status(400).json( err )
  }
});

// * IMPORTANT Do Not add any routes below the wildcard route
homeRouter.get( '/*', ( req, res ) => {
  res.render( '404', {
      logged_in: req.session.logged_in,
      user_name: req.session.user_name
  } );
} );

module.exports = homeRouter;