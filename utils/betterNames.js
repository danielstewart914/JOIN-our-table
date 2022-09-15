const firstToUpper = ( string ) => {
    return string.replace( /\b\w/g, c => c.toUpperCase() );
}

const betterNames = ( req, res, next ) => {
    if ( req.body.ingredient_name ) req.body.ingredient_name = firstToUpper( req.body.ingredient_name );
    if ( req.body.unit_name ) req.body.unit_name = firstToUpper( req.body.unit_name );
    next();
}

module.exports = betterNames;