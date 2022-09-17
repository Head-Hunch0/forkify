// import { search } from "core-js/fn/symbol";
import { async } from "regenerator-runtime";
import { _API , RESULTSPERPAGE} from "./config";
import { getJSON } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RESULTSPERPAGE,
        page:1
    },
    bookmarks: []
};
 // recipe results 
export const loadRecipe = async (id) => {
    try {
            //fetch data 
        const data = await getJSON(`${_API}${id}`);

        let { recipe } = data.data;

        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.sorce_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients
        };
        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
        }
    catch(e) {
        throw e;
        }
}
    // search results from api
export const loadSearchResults = async function (query) {
    try {// store qyuerries made
        state.search.query = query;

        const data =await getJSON(`${_API}?search=${query}`);
        // search resluts to state 
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url
            };
        });
        state.search.page = 1;
    }
    catch(e) {
        throw e
    }
}
// getting number of pages from total number of recipes found 
export const getSearchResultsPage = function (page = state.search.page) {

    state.search.page  = page

    const start = (page - 1) * state.search.resultsPerPage;
    const end = (page * state.search.resultsPerPage);
    return state.search.results.slice(start,end);
}
// updating servings and ingredients based on num of servings
export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        // formula = ingredients * new servings / old servings
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });
    state.recipe.servings = newServings;
}

// store bookmarks in local storage 
const persistBookmarks = function () {
    localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks))
}
// adding a bookmark 
export const addBookmark = function (recipe) {
    // add bookmark 
    state.bookmarks.push(recipe);
    
    // mark current recipe as bookmarked
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true
    console.log(state.bookmarks)
    persistBookmarks();
}
// deleting a bookmark
export const deleteBookmark = function (id) {
    // delete recipe from bookmarks array
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // unmark bookmarked recipe
    if (id === state.recipe.id) state.recipe.bookmarked = false;    
    console.log(state.bookmarks)
    persistBookmarks();
}

const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
}
init();
 
console.log(state.bookmarks)

const clearBookmarks = function () {
    localStorage.clear('bookmarks')
}
// clearBookmarks();