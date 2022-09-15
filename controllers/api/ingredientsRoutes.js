const ingredientsRouter = require('express').Router();
const { Op } = require( 'sequelize' );
const { Ingredient } = require('../../models');
const betterNames = require( '../../utils/betterNames' );

// GET all ingredients
ingredientsRouter.get('/', async (req, res) => {
  try {

    if ( !req.query.search ) {
      const ingredientsData = await Ingredient.findAll( {
        order: [
          [ 'ingredient_name', 'ASC' ]
        ]
      } );
      res.status(200).json(ingredientsData);
      return;
    }

    const { search } = req.query;

    const ingredientsData = await Ingredient.findAll( {
      where: {
        ingredient_name: {
          [Op.substring]: search
        }
      },
      order: [
        [ 'ingredient_name', 'ASC' ]
      ]
    } );
  
    res.status(200).json(ingredientsData);
  } catch (err) {
    res.status(500).json(err);
  }
});


//Get ingredients by ID:
ingredientsRouter.get('/:id', async (req, res) => {
    try {
      const ingredientsData = await Ingredient.findByPk(req.params.id);
  
      if (!ingredientsData) {
        res.status(404).json({ message: 'No ingredient found with this id!' });
        return;
      }
  
      res.status(200).json(ingredientsData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
 
  // POST a new ingredient 
 ingredientsRouter.post('/', betterNames, async (req, res) => {
    try {
        const ingredientsData = await Ingredient.create(req.body);
        res.status(200).json(ingredientsData);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = ingredientsRouter;