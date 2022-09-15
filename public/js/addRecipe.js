const titleInputEl = document.querySelector( '#title' );
const descriptionInputEl = document.querySelector( '#description' );
const directionsInputEl = document.querySelector( '#directions' );
const imageInputEl = document.querySelector( '#recipe-image' );
const isPublicEl = document.querySelector( '#is-public' );
const submitRecipeButton = document.querySelector( '#submit-recipe' );

const postRecipe = async ()  => {

    // * Add checks here

    const recipe_title = titleInputEl.value.trim();
    const description = descriptionInputEl.value.trim();
    const directions = directionsInputEl.value.trim();
    const imageFile = imageInputEl.files[0];

    const ingredientsElements = document.querySelectorAll( '.recipe-ingredient' );

    const ingredients = [];
    ingredientsElements.forEach( ingredientEl => {
        const recipeIngredient = {
            amount: ingredientEl.dataset.amount,
            unit_id: ingredientEl.dataset.unit_id,
            ingredient_id: ingredientEl.dataset.ingredient_id,
        }
        ingredients.push( recipeIngredient );
    } );

    const recipeResponse = await fetch( '/api/recipes', {
        method: 'POST',
        body: JSON.stringify( { recipe_title, description, directions, ingredients, public: isPublicEl.checked } ),
        headers: { 'Content-Type': 'application/json' }
    } );

    const newRecipe = await recipeResponse.json();

    console.log( recipeResponse.ok );

    if ( !imageFile ) window.location.replace( `/recipes/${ newRecipe.id }` );
    const body = new FormData();

    body.append( 'recipe_image', imageFile );
    body.append( 'recipe_id', newRecipe.id );

    await fetch( '/api/recipes/image', {
        method: 'POST',
        body
    } );
    if ( recipeResponse.ok ) window.location.replace( `/recipes/${ newRecipe.id }` );

}

recipeIngredientListEl.addEventListener( 'click', ( event ) => {
    if ( ![...event.target.classList ].includes( 'remove-ingredient' ) ) return;
    event.target.closest( 'li' ).remove();
} );

submitRecipeButton.addEventListener( 'click', ( event ) => {
    event.preventDefault();
    postRecipe();
} );