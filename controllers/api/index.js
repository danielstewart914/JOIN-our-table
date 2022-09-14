const apiRouter = require('express').Router();
const userRoutes = require('./userRoutes');
const unitRoutes = require('./unitRoutes');
const ingredientsRoutes= require('./ingredientsRoutes');
const recipeRoutes = require( './recipeRoutes' );

apiRouter.use('/users', userRoutes);
apiRouter.use('/units', unitRoutes);
apiRouter.use('/ingredients', ingredientsRoutes);
apiRouter.use( '/recipes', recipeRoutes );
module.exports = apiRouter;