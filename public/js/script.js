let showingToolTip = false;

const showToolTip = ( toolTip, timer = 1500 ) => {
    // if not showing tooltip
    if ( !showingToolTip ) {
        toolTip.show();
        showingToolTip = true;
        // hide tooltip after 1.5 seconds
        setTimeout( () => {
            toolTip.hide();
            showingToolTip = false;
        }, timer );
    }
}

// check if element is blank
const isBlank = ( input, toolTip ) => {

    // if input is blank
    if ( !input ) {
        showToolTip( toolTip );
        // return true for blank element
        return true;
    }
    // return false for populated element
    return false;
}

const isEmail = ( input, toolTip ) => {
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if input is blank
    if ( !input || !emailRegEx.test( input ) ) {
        showToolTip( toolTip );
        // return true for invalid email
        return true;
    }
    // return false for populated element
    return false;
}

const isLessThan = ( input,toolTip, min ) => {
    if ( input.length < min ) {
        showToolTip( toolTip );
        // return true for short string
        return true;
    }
     // return false if meet min length
     return false;
}