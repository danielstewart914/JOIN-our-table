const apiRouter = require('express').Router();
const userRoutes = require('./userRoutes');
const unitRoutes = require('./unitRoutes');

apiRouter.use('/users', userRoutes);
apiRouter.use('/units', unitRoutes);
module.exports = apiRouter;