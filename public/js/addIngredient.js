const addToRecipeButton = document.querySelector( '#add-to-recipe' );
const recipeIngredientListEl = document.querySelector( '#recipe-ingredients-list' );

// amount elements
const amountInputEl = document.querySelector( '#amount-input' );
const amountDisplayEl = document.querySelector( '#amount-display' );

// unit elements
const unitSearchEl = document.querySelector( '#unit-search' );
const unitListEl = document.querySelector( '#unit-list' );
const createUnitButton = document.querySelector( '#create-unit' );

// ingredient elements
const ingredientSearchEl = document.querySelector( '#ingredient-search' );
const ingredientListEl = document.querySelector( '#ingredient-list' );
const createIngredientButton = document.querySelector( '#create-ingredient' );

// message display and tooltip
const messageEl = document.querySelector( '#message' );
const invalidAmountToolTip = new bootstrap.Tooltip( amountInputEl );

// modal elements
const ingredientModal = new bootstrap.Modal( '#ingredient-modal' );
const ingredientModalEl = document.querySelector( '#ingredient-modal' );
const addIngredientModal = document.querySelector( '#modal-trigger' );
const dismissIngredientModal = document.querySelector( '#dismiss-ingredient-modal' );

// recipeIngredient data
let selectedIngredient = false;
let selectedUnit = false;
let selectedAmount = false;

const createRecipeIngredientEl = ( amount, unit_id, ingredient_id, unit_name, ingredient_name ) => {
    const recipeIngredientEl = document.createElement( 'li' );
    recipeIngredientEl.classList.add( 'recipe-ingredient', 'col', 'border-1', 'border-start', 'border-end' );
    recipeIngredientEl.dataset.amount = amount;
    recipeIngredientEl.dataset.unit_id = unit_id;
    recipeIngredientEl.dataset.ingredient_id = ingredient_id;

    recipeIngredientEl.innerHTML = `
        <span class="fw-semibold">${ amount }</span>
        <span  class="fw-bold">${ unit_name }</span>
        ${ ingredient_name }
        <button type="button" class="remove-ingredient btn btn-danger btn-close float-end"></button>
    `;


    return recipeIngredientEl;
}

// checks if all data is present and enables add to recipe button
const checkData = () => {
    if ( selectedAmount && selectedUnit && selectedIngredient ) addToRecipeButton.classList.remove( 'disabled' );
    // else disable add to recipe button
    else addToRecipeButton.classList.add( 'disabled' );
}

// create list item elements for ingredient object
const createLi = ( listItem, selected, value ) => {
    const listItemEl = document.createElement( 'li' );
    if ( value === 'ingredient' ) listItemEl.textContent = listItem.ingredient_name;
    if ( value === 'unit' ) listItemEl.textContent = listItem.unit_name;
    listItemEl.dataset.id = listItem.id;
    listItemEl.classList.add(
        value,
        'list-group-item', 
        'border',
        'border-2',
        'rounded', 
        'my-2',
        'p-1', 
        'text-center',
        'fs-5',
        'flex-grow-1',
        'flex-shrink-0'
    );

    if ( selected ) listItemEl.classList.add( 'bg-phthalo-green', 'text-white', 'border-light' );
    else listItemEl.classList.add( 'bg-key-lime', 'text-black', 'border-dark' )
    return listItemEl;
}

const loadUnits = async () => {
    try {
        // trim search term and fetch
        const search = unitSearchEl.value.trim();
        const response = await fetch( `/api/units?search=${ search }` );
        const units = await response.json();

        // create document fragment to store units list
        const unitFrag = document.createDocumentFragment();

        // if there are no ingredients matching search
        if ( !units.length ) {
            // reveal create button and update message
            createUnitButton.classList.remove( 'disabled' );
            messageEl.textContent = 'Cannot find Measurement. Click create to add it to the database.';
        } else {
            // hide create button and update message
            createUnitButton.classList.add( 'disabled' );
            messageEl.textContent = 'Click a Measurement and Ingredient below to select them.';
        }

        // create list item elements for each unit
        units.forEach( unit => unitFrag.append( createLi( unit, false, 'unit' ) ) );
        // reset list HTML
        unitListEl.innerHTML = '';
        // append fragment to unit list
        unitListEl.append( unitFrag );

    } catch ( err ) {
        console.log( err );
    }
}

const loadIngredients = async () => {
    try {
        // trim search term and fetch
        const search = ingredientSearchEl.value.trim();
        const response = await fetch( `/api/ingredients?search=${ search }` );
        const ingredients = await response.json();

        // create document fragment to store ingredients
        const ingredientFrag = document.createDocumentFragment();

        // if there are no ingredients matching search
        if ( !ingredients.length ) {
            // reveal create button and update message
            createIngredientButton.classList.remove( 'disabled' );
            messageEl.textContent = 'Cannot find Ingredient. Click create to add it to the database.';
        } else {
            // hide create button and update message
            createIngredientButton.classList.add( 'disabled' );
            messageEl.textContent = 'Click a Measurement and Ingredient below to select them.';
        }

        // create list item elements for each ingredient
        ingredients.forEach( ingredient => ingredientFrag.append( createLi( ingredient, false, 'ingredient' ) ) );
        // reset list HTML
        ingredientListEl.innerHTML = '';
        // append fragment to ingredient list
        ingredientListEl.append( ingredientFrag );

    } catch ( err ) {
        console.log( err );
    }
}

// show ingredient modal
addIngredientModal.addEventListener( 'click', ( ) => {
    messageEl.textContent = '';
    loadUnits();
    loadIngredients();
    ingredientModal.show();
} );

// when modal is dismissed reset search
ingredientModalEl.addEventListener( 'hide.bs.modal', () => {
    // reset everything after 100 milliseconds to allow for fade of modal
    setTimeout( () => {
        ingredientSearchEl.value = '';
        ingredientListEl.innerHTML = '';
        unitSearchEl.value = '';
        unitListEl.innerHTML = '';
        amountInputEl.value = '';
        selectedIngredient = false;
        selectedUnit = false;
        selectedAmount = false;
        amountDisplayEl.classList.add( 'd-none' );
        addToRecipeButton.classList.add( 'disabled' );
    }, 100 );
} );

amountInputEl.addEventListener( 'keyup', ( event ) => {
    // get value
    const amount = amountInputEl.value.trim();
    const amountRegEx = /(^\d{1,2}\/\d{1,2}$)|(^\d+\s\d{1,2}\/\d{1,2}$)|(^\d+$)|(^\d+\.(\d{1,2})$)/;
    
    amountDisplayEl.classList.remove( 'd-none' );

    // test against RegEx
    if ( !amountRegEx.test( amount ) ) {
        selectedAmount = false;
        amountDisplayEl.textContent = '?!';
        showToolTip( invalidAmountToolTip, 5000 );
        return;
    }

    // add to display and reveal element
    selectedAmount = amount;
    amountDisplayEl.textContent = amount;
    // hide tool tip
    invalidAmountToolTip.hide();
    showingToolTip = false;

    checkData();
} );

// load units on text input
unitSearchEl.addEventListener( 'input', async ( event ) => {
    event.preventDefault();
    loadUnits();
    selectedUnit = false;
    messageEl.textContent = 'Click a Measurement and Ingredient below to select them.';
    checkData();
} );

unitListEl.addEventListener( 'click', ( event ) => {
    event.preventDefault();

    // return out of function if clicked element is not an ingredient
    if ( ![...event.target.classList ].includes( 'unit' ) ) return;

    // set selected ingredient id to the value stored in ingredient element
    selectedUnit = parseInt( event.target.dataset.id );

    // select all ingredient elements
    const allUnits = document.querySelectorAll( '.unit' );

    // reset background and text colors of all ingredients
    allUnits.forEach( unitEl => {
        unitEl.classList.remove( 'bg-phthalo-green', 'text-white', 'border-light' );
        unitEl.classList.add( 'text-black', 'bg-key-lime', 'border-dark' );
    } );

    // highlight selected ingredient
    event.target.classList.remove( 'bg-key-lime', 'text-black', 'border-dark' );
    event.target.classList.add( 'bg-phthalo-green', 'text-white', 'border-light' );

    // set search field to value of clicked element
    unitSearchEl.value = event.target.textContent;
    // reset innerHTML
    unitListEl.innerHTML = '';
    // append clicked element to list contents
    unitListEl.appendChild( event.target );
    checkData();
} );

// load ingredients on text input
ingredientSearchEl.addEventListener( 'input', async ( event ) => {
    event.preventDefault();
    loadIngredients();
    selectedIngredient = false;
    messageEl.textContent = 'Click a Measurement and Ingredient below to select them.';
    checkData();
} );

ingredientListEl.addEventListener( 'click', ( event ) => {
    event.preventDefault();

    // return out of function if clicked element is not an ingredient
    if ( ![...event.target.classList ].includes( 'ingredient' ) ) return;

    // set selected ingredient id to the value stored in ingredient element
    selectedIngredient = parseInt( event.target.dataset.id );

    // select all ingredient elements
    const allIngredients = document.querySelectorAll( '.ingredient' );

    // reset background and text colors of all ingredients
    allIngredients.forEach( ingredientEl => {
        ingredientEl.classList.remove( 'bg-phthalo-green', 'text-white', 'border-light' );
        ingredientEl.classList.add( 'text-black', 'bg-key-lime', 'border-dark' );
    } );

    // highlight selected ingredient
    event.target.classList.remove( 'bg-key-lime', 'text-black', 'border-dark' );
    event.target.classList.add( 'bg-phthalo-green', 'text-white', 'border-light' );

    // set search field to value of clicked element
    ingredientSearchEl.value = event.target.textContent;
    // reset innerHTML
    ingredientListEl.innerHTML = '';
    // append clicked element to list contents
    ingredientListEl.appendChild( event.target );
    checkData();
} );

createUnitButton.addEventListener( 'click', async ( event ) => {
    event.preventDefault();

    const unit_name = unitSearchEl.value.trim();
    const response = await fetch( '/api/units', {
        method: 'POST',
        body: JSON.stringify( { unit_name } ),
        headers: { 'Content-Type': 'application/json' }
    } );

    if ( response.ok ) {
        const newUnit = await response.json();
        unitListEl.append( createLi( newUnit, true, 'unit' ) );
        selectedUnit = newUnit.id;

        // hide create button and update message
        createUnitButton.classList.add( 'disabled' );
        messageEl.textContent = '';
    } else {
        messageEl.textContent = 'Could not create unit';
    }
    checkData();
} );

// create new ingredient
createIngredientButton.addEventListener( 'click', async ( event ) => {
    event.preventDefault();

    const ingredient_name = ingredientSearchEl.value.trim();
    const response = await fetch( '/api/ingredients', {
        method: 'POST',
        body: JSON.stringify( { ingredient_name } ),
        headers: { 'Content-Type': 'application/json' }
    } );

    if ( response.ok ) {
        const newIngredient = await response.json();
        ingredientListEl.append( createLi( newIngredient, true, 'ingredient' ) );
        selectedIngredient = newIngredient.id;

        // hide create button and update message
        createIngredientButton.classList.add( 'disabled' );
        messageEl.textContent = '';
    } else {
        messageEl.textContent = 'Could not create ingredient';
    } 
    checkData();
} );

addToRecipeButton.addEventListener( 'click', () => {

    recipeIngredientListEl.appendChild( createRecipeIngredientEl( 
        selectedAmount,
        selectedUnit,
        selectedIngredient,
        unitListEl.children[0].textContent,
        ingredientListEl.children[0].textContent
     ) );

    ingredientModal.hide();
} );