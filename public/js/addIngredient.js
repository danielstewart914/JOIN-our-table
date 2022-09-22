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
let selectedIngredient = null;
let selectedIngredientName = null;
let selectedUnit = null;
let selectedUnitName = null;
let selectedAmount = null;

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

// checks if typed in name matches existing one
const checkName = ( value, selector ) => {

    const nameList = document.querySelectorAll( selector );

    let returnValue = false;
    nameList.forEach( name => {
        console.log( value.toLowerCase(), name.textContent.toLowerCase() )
        if ( name.textContent.toLowerCase() === value.toLowerCase() ) {
            returnValue = true;
        }
    } );
    return returnValue;
}

// checks if all data is present and enables add to recipe button
const checkData = () => {
    if ( selectedAmount && selectedUnit && selectedIngredient ) addToRecipeButton.classList.remove( 'disabled' );
    // else disable add to recipe button
    else addToRecipeButton.classList.add( 'disabled' );

    if ( !ingredientSearchEl.value.trim().length || checkName( ingredientSearchEl.value.trim(), '.ingredient' ) ) createIngredientButton.classList.add( 'disabled' );
    else createIngredientButton.classList.remove( 'disabled' );

    if ( !unitSearchEl.value.trim().length || checkName( unitSearchEl.value.trim(), '.unit' ) ) createUnitButton.classList.add( 'disabled' );
    else createUnitButton.classList.remove( 'disabled' );
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

const load = async ( dataType ) => {
    try {
        const response = await fetch( `/api/${ dataType }s` );
        const data = await response.json();

        // create document fragment to store units list
        const dataFrag = document.createDocumentFragment();

        // create list item elements for each unit
        data.forEach( dataElement => dataFrag.append( createLi( dataElement, false, dataType ) ) );
        
        if ( dataType === 'unit' ) {
            // reset list HTML
            unitListEl.innerHTML = '';
            // append fragment to unit list
            unitListEl.append( dataFrag );
        }

        if ( dataType === 'ingredient' ) {
            // reset list HTML
            ingredientListEl.innerHTML = '';
            // append fragment to unit list
            ingredientListEl.append( dataFrag );
        }

    } catch ( err ) {
        console.log( err );
    }
}

const search = ( term, list ) => {
    // select all ingredient elements
    const all = document.querySelectorAll( `.${ list }` );

    // reset background and text colors of all ingredients
    all.forEach( element => {
        element.classList.remove( 'bg-phthalo-green', 'text-white', 'border-light' );
        element.classList.add( 'text-black', 'bg-key-lime', 'border-dark' );

        if ( element.textContent.toLowerCase().includes( term.toLowerCase() ) ) element.classList.remove( 'd-none' );
        else element.classList.add( 'd-none' );
    } );

}

const resetAndHideList = ( list, hide ) => {
    list.forEach( element => {
        element.classList.remove( 'bg-phthalo-green', 'text-white', 'border-light' );
        element.classList.add( 'text-black', 'bg-key-lime', 'border-dark', 'd-none' );
    } );
}

const selectListItem = ( event, type ) => {
    // return out of function if clicked element is not an ingredient
    if ( ![...event.target.classList ].includes( type ) ) return;

    if ( type === 'unit' ) {
        // set selected ingredient id to the value stored in ingredient element
        selectedUnit = parseInt( event.target.dataset.id );
        selectedUnitName = event.target.textContent;
        // set search field to value of clicked element and disable create button
        unitSearchEl.value = event.target.textContent;
    }

    if ( type === 'ingredient' ) {
        // set selected ingredient id to the value stored in ingredient element
        selectedIngredient = parseInt( event.target.dataset.id );
        selectedIngredientName = event.target.textContent;
        // set search field to value of clicked element and disable create button
        ingredientSearchEl.value = event.target.textContent;
    }

    // select all ingredient elements
    const all = document.querySelectorAll( `.${ type }`);

    resetAndHideList( all );

    // highlight selected ingredient
    event.target.classList.remove( 'bg-key-lime', 'text-black', 'border-dark', 'd-none' );
    event.target.classList.add( 'bg-phthalo-green', 'text-white', 'border-light' );

    checkData();
}

// show ingredient modal
addIngredientModal.addEventListener( 'click', ( ) => {
    load( 'unit' );
    load( 'ingredient' );
    checkData();
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
        selectedIngredient = null;
        selectedIngredientName = null;
        selectedUnit = null;
        selectedUnitName = null;
        selectedAmount = null;
        amountDisplayEl.classList.add( 'd-none' );
        addToRecipeButton.classList.add( 'disabled' );
    }, 100 );
} );

amountInputEl.addEventListener( 'keyup', ( event ) => {
    // get value
    const amount = amountInputEl.value.trim();
    const amountRegEx = /(^-$)|(^\d{1,2}\/\d{1,2}$)|(^\d+\s\d{1,2}\/\d{1,2}$)|(^\d+$)|(^\d+\.(\d{1,2})$)/;
    
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
    search( unitSearchEl.value.trim(), 'unit' )
    selectedUnit = null;
    selectedUnitName = null;
    messageEl.textContent = 'Click a Measurement and Ingredient below to select them.';
    checkData();
} );

unitListEl.addEventListener( 'click', ( event ) => {
    event.preventDefault();
    selectListItem( event, 'unit' );
} );

// load ingredients on text input
ingredientSearchEl.addEventListener( 'input', async ( event ) => {
    event.preventDefault();
    search( ingredientSearchEl.value.trim(), 'ingredient' )
    selectedIngredient = null;
    selectedIngredientName = null;
    messageEl.textContent = 'Click a Measurement and Ingredient below to select them.';
    checkData();
} );

ingredientListEl.addEventListener( 'click', ( event ) => {
    event.preventDefault();
    selectListItem( event, 'ingredient' );
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
        const allUnits = document.querySelectorAll( '.unit' );
        resetAndHideList( allUnits );
        unitListEl.append( createLi( newUnit, true, 'unit' ) );
        selectedUnit = newUnit.id;
        selectedUnitName = newUnit.unit_name;
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

        const allIngredients = document.querySelectorAll( '.ingredient' );
        resetAndHideList( allIngredients );
        ingredientListEl.append( createLi( newIngredient, true, 'ingredient' ) );
        selectedIngredient = newIngredient.id;
        selectedIngredientName = newIngredient.ingredient_name;
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
        selectedUnitName,
        selectedIngredientName
     ) );

    ingredientModal.hide();
} );