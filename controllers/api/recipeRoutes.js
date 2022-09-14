const recipeRouter = require( 'express' ).Router();
const uploadImage = require( '../../utils/uploadImage' );
const { Recipe, RecipeIngredient, Unit, Ingredient } = require( '../../models' );
const fs = require( 'fs' );
const { json } = require('express');

recipeRouter.post( '/', async ( req, res ) => {
    try {

    if ( !req.body.recipe_title || !req.body.description || !req.body.directions || !req.body.ingredients ) {
        res.status(400).json( { message: 'Missing Data' } );
        return;
    }

    // replace single newlines with double newlines in description and directions
    const description = req.body.description.replace(/(^|[^\n])\n(?!\n)/g, "$1\n\n");
    const directions = req.body.directions.replace(/(^|[^\n])\n(?!\n)/g, "$1\n\n");

    // create new recipe
    const newRecipeData = await Recipe.create( {
        image_path: '',
        recipe_title: req.body.recipe_title,
        description: description,
        directions: directions,
        user_id: req.session.user_id,
        public: req.body.public
    } );

    // create RecipeIngredients input objects
    const recipeIngredientInfo = req.body.ingredients.map( ingredientObject => {
        return {
            recipe_id: newRecipeData.id,
            ingredient_id: ingredientObject.ingredient_id,
            unit_id: ingredientObject.unit_id,
            amount: ingredientObject.amount
        }
    } );

    console.log( recipeIngredientInfo )

    // create RecipeIngredients
    await RecipeIngredient.bulkCreate( recipeIngredientInfo );

    const fullRecipeData = await Recipe.findByPk( newRecipeData.id, {
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

    // respond with newly created recipe
    res.status(200).json( fullRecipeData );
    } catch ( err ) {
        res.status(400).json( err );
    }


} );

recipeRouter.post( '/image', uploadImage.single( 'recipe_image' ), async ( req, res ) => {
    let image_path;

    try {
        // if file is an image
        if ( req.validFile ) image_path =  '/' + req.file.path.replace( '\\', '/' );
        else {
            image_path = '';
        }

        const updated = await Recipe.update( 
            { 
                image_path: image_path 
            }, 
            {
                where: { id: req.body.recipe_id }
            },
        );

        if ( updated ) res.status(200).json( { message: 'Image upload Success!' } );
        else res.status(200).json( { message: 'Nothing happened!' } );

    } catch ( err ) {
        fs.unlink( '.' + image_path, ( err ) => {
            if ( err ) {
              console.error( err )
              return;
            }
        } );
        res.status(400).json( err );
    }
} );

module.exports = recipeRouter;