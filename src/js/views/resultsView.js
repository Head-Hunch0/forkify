import View from "./view";
import previewView from "./previewView";
import icons from "url:../../img/icons.svg";
class Results extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "Recipe not found. Please look up a different recipe🙃";
  _successMessage = "";

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new Results();