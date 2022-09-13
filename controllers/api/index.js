const apiRouter = require('express').Router();
const userRoutes = require('./userRoutes');
const unitRoutes = require('./unitRoutes');
const ingredientsRoutes= require('./ingredientsRoutes')

apiRouter.use('/users', userRoutes);
apiRouter.use('/units', unitRoutes);
apiRouter.use('/ingredients', ingredientsRoutes);
module.exports = apiRouter;