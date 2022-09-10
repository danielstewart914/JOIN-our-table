
function createRecipeCard() {
    recipeCard= `
    <div class="card" style="width: 18rem;">
  <img src=${image} class="card-img-top" alt="Image of current recipe">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">${recipe}</p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">${Ingredient}</li>
  </ul>
    `

    return recipeCard;
}