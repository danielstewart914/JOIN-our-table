# Project 2 Routes

## Home Routes
GET - `/` - Home Page

GET - `/login` - Login Page

GET - `/signup` - Sign Up Page

GET - `/profile` - View Profile

GET - `/profile/recipes` - Display all Personal Recipes

GET - `/recipes` - Display all Public Recipes

GET - `/recipes/edit/:id` - Edit Recipe

GET - `/recipes/new` - Create new Recipe

GET - `recipes/ingredient/:id` - Get all recipes by ingredient id

GET - `recipes/tag/:id` - Get all recipes by tag id

GET - `recipes/:id` - Get Recipe by id ( validate if public, and validate user id if needed )

## API Routes

### User
POST - `api/user` - Create New User

POST - `api/user/login` - Login User ( validate user and password )

POST - `api/user/logout` - Logout User

### Optional

PUT - `api/user/:id` - Update User by Id ( validate user id )

## Recipe

POST - `api/recipes` - Create new Recipe ( create corresponding RecipeTags, RecipeIngredients )

### Optional

PUT - `api/recipes/:id` - Update Recipe by id ( validate user id, and update corresponding RecipeTags, RecipeIngredients )

DELETE - `api/recipes/:id` - Delete Recipe by id ( validate user id, and delete corresponding RecipeTags, RecipeIngredients ) )

## Ingredient
GET - `api/ingredients` - Get all ingredients

GET - `api/ingredients/:id` - Get ingredient by id

POST - `api/ingredients` - Create new ingredient

### Optional

PUT - `api/ingredients/:id` - Update ingredient name

DELETE - `api/ingredients/:id` - Delete ingredient by id

## Tag
GET - `api/tags` - Get all tags

GET - `api/tags/:id` - Get tag by id

### Optional

POST - `api/tags` - Create new tag

PUT - `api/tags/:id` - Update tag name by id

DELETE - `api/tags/:id` - Delete tag by id

## Unit
GET - `api/units` - Get all units

GET - `api/units/:id` - Get unit by id

### Optional

POST - `api/units` - Create new unit

PUT - `api/units/:id` - Update unit name by id

DELETE - `api/units/:id` - Delete unit by id 