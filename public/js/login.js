const login = async ( event ) => {
    event.preventDefault();

    const email = document.querySelector( '#loginEmail' ).value.trim();
    const password = document.querySelector( '#loginPassword' ).value.trim();

    if ( email && password ) {
        const response = await fetch( '/api/users/login', {
            method: 'POST',
            body: JSON.stringify( { email, password } ),
            headers: { 'Content-Type': 'application/json' }
        } );

        if ( response.ok ) window.location.replace( '/' );
        else alert( 'Login failed!' );
    }
}

document.querySelector( '.login-form' ).addEventListener( 'submit', login );