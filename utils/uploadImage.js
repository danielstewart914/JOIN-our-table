const multer = require( 'multer' );

const storage = multer.diskStorage( {
    destination: ( req, file, cb ) => {
        cb( null, 'recipe-images/' );
    },
    filename: ( req, file, cb ) => {
        cb( null, Date.now() + file.originalname )
    }
} );

const imageFileFilter = ( req, file, cb ) => {
    if( !req.file && file.mimetype.startsWith( 'image' ) ) {
        req.validFile = true;
        cb( null, true );
    } else {
        cb( null , false );
    }
} 

const uploadImage = multer( { 
    storage: storage, 
    limits: { 
        fileSize: 1024 * 1024 * 10 
    },
    fileFilter: imageFileFilter
} );

module.exports = uploadImage;