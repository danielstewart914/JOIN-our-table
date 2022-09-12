const nameEl = document.querySelector( '#fullName' );
const usernameEl = document.querySelector( '#username' );
const emailEl = document.querySelector( '#signUpEmail' );
const passwordEl = document.querySelector( '#signUpPassword' );

const emptyNameToolTip = new bootstrap.Tooltip( nameEl );
const emptyUsernameToolTip = new bootstrap.Tooltip( usernameEl );
const emptyEmailToolTip = new bootstrap.Tooltip( emailEl );
const emptyPasswordToolTip = new bootstrap.Tooltip( passwordEl );

const failedModal = new bootstrap.Modal( '#failed-modal' );
const failedAlertTitle = document.querySelector( '#failed-modal-label' );

const signup = async ( event ) => {
    event.preventDefault();

    const name = nameEl.value.trim();
    const username = usernameEl.value.trim();
    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();

    if ( isBlank( name, emptyNameToolTip ) ) return;
    if ( isBlank( username, emptyUsernameToolTip ) ) return;
    if ( isEmail( email, emptyEmailToolTip ) ) return;
    if ( isLessThan( password, emptyPasswordToolTip, 8 ) ) return;

    try {
        const response = await fetch( '/api/users', {
            method: 'POST',
            body: JSON.stringify( { name, username, email, password } ),
            headers: { 'Content-Type': 'application/json' }
        } );

        if ( response.ok ) window.location.replace( '/' );
        else {
            failedAlertTitle.textContent = "Sign Up Failed!";
            failedModal.show();
        }
    } catch ( err ) {
        console.log( err );
    }
};

document.querySelector( '#signUp' ).addEventListener( 'submit', signup );