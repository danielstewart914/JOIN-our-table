const emailEl = document.querySelector( '#loginEmail' );
const passwordEl = document.querySelector( '#loginPassword' );

const emptyEmailToolTip = new bootstrap.Tooltip( emailEl );
const emptyPasswordToolTip = new bootstrap.Tooltip( passwordEl );

const failedModal = new bootstrap.Modal( '#failed-modal' );
const failedAlertTitle = document.querySelector( '#failed-modal-label' );

const login = async ( event ) => {
    event.preventDefault();

    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();

    if ( isEmail( email, emptyEmailToolTip ) ) return;
    if ( isBlank( password, emptyPasswordToolTip ) ) return;

    try {
        const response = await fetch( '/api/users/login', {
            method: 'POST',
            body: JSON.stringify( { email, password } ),
            headers: { 'Content-Type': 'application/json' }
        } );
        
        if ( response.ok ) window.location.replace( '/' );
        else {
            failedAlertTitle.textContent = 'Login Failed!';
            failedModal.show();
        }
    } catch ( err ) {
        console.log( err );
    }
}

document.querySelector( '#login' ).addEventListener( 'submit', login );