const signup = async ( event ) => {
    event.preventDefault();

    const name = document.querySelector( '#fullName' ).value.trim();
    const username = document.querySelector( '#username' ).value.trim();
    const email = document.querySelector( '#signUpEmail' ).value.trim();
    const password = document.querySelector( '#signUpPassword' ).value.trim();

    if ( name && username && email && password ) {
        const response = await fetch( '/api/users', {
            method: 'POST',
            body: JSON.stringify( { name, username, email, password } ),
            headers: { 'Content-Type': 'application/json' }
        } );

        if ( response.ok ) window.location.replace( '/' );
        else alert( 'Signup Failed' );
    }
};

document.querySelector( '.signup-form' ).addEventListener( 'submit', signup );