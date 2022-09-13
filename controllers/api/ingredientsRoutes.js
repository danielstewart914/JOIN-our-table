const ingredientsRouter = require('express').Router();
const { Ingredient } = require('../../models')

// GET all ingredients
ingredientsRouter.get('/', async (req, res) => {
    try {
      const ingredientsData = await Ingredient.findAll();
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
 ingredientsRouter.post('/', async (req, res) => {
    try {
        const ingredientsData = await Ingredient.create(req.body);
        res.status(200).json(ingredientsData);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = ingredientsRouter;