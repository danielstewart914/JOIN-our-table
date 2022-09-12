const userRouter = require( 'express' ).Router();
const { User } = require( '../../models' );

// create User route
userRouter.post( '/', async ( req, res ) => {
    try {
        const newUserData = await User.create( req.body );

        req.session.user_id = newUserData.id;
        req.session.user_name = newUserData.name;
        req.session.logged_in = true;
        req.session.save( () => res.status(200).json( newUserData ) );
    } catch ( err ) {
        res.status(400).json( err );
    }
} );

// User login route
userRouter.post( '/login', async ( req, res ) => {
    try {
        const userData = await User.findOne( { where: { email: req.body.email } } );

        if( !userData ) {
            res.status(400).json( { message: 'Incorrect email or password, please try again' } );
            return;
        };

        const validPass = await userData.checkPassword( req.body.password );

        if( !validPass ) {
            res.status(400).json( { message: 'Incorrect email or password, please try again' } );
            return;
        }

        req.session.user_id = userData.id;
        req.session.user_name = userData.name;
        req.session.logged_in = true;

        req.session.save( () => {
            res.json( { message: 'You are now logged in' } );
        } );

    } catch ( err ) {
        res.status(400).json( err );
    }
} );

// user Logout
userRouter.post( '/logout', ( req, res ) => {
    if ( req.session.logged_in ) {
        req.session.destroy( () => {
            res.status(204).end();
        } );
    }
    else {
        res.status(404).end();
    }
} );

module.exports = userRouter;