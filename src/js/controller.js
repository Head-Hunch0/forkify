import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarkView from './views/bookmarkView';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
// const recipeContainer = document.querySelector('.recipe');


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async () => {
  
  try {
    
    const id = window.location.hash.slice(1);
    if (!id) return;
    //render spinner
    recipeView.renderSpinner();
    
    // update results view to mark selected search result
    // resultsView.render(model.getSearchResultsPage())
    bookmarkView.render(model.state.bookmarks)
    //loading recipe 
    await model.loadRecipe(id);    
    // render recipe 
    recipeView.render(model.state.recipe)
  }
  catch (e) {
    recipeView.renderError()
  }
};
const controlSearchResults = async function () {
  try {
    // get search value from form 
    const query = searchView.getQuery();
    if (!query) return;
    
    // load search query results
    await model.loadSearchResults(query);
    // render results
    resultsView.render(model.getSearchResultsPage())
    
    // render first pagination button
    paginationView.render(model.state.search)
  }
  catch (e) { throw e }
}
// handler function for rendering pages for pagination 
// linkde to the paginationView
const controlPagination = function (goToPage) {
  console.log(goToPage);
  //render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // render new pagination buttons
  paginationView.render(model.state.search)
}
const controlServings = function (newServings) {
  // update servings
  model.updateServings(newServings)
  //update ui
  recipeView.render(model.state.recipe);
  // recipeView.update(model.state.recipe)
}
const controlAddBookmark = function () {
  //check if current recipe is bookmarked
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    // remove current item from bookmarks array
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe)
  // update recipe view
  recipeView.render(model.state.recipe)
  // render bookmarks
  bookmarkView.render(model.state.bookmarks)
}
// handler function from bookmarks
const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks)
}

// controlSearchResults()
const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdtaeServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
}
init();


