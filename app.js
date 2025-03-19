import { getHashAndParams } from "./lib/utils.js";
import { notFoundView } from "./views/404View.js";
import { listingView } from "./views/listingView.js";
import { manufacterListingView } from "./views/manufactersListingView.js";
import { gameView } from "./views/gameView.js"; 

// Routing
const routes = {
    "": listingView,
    "listing": listingView,
    "search": listingView,
    "favorites": listingView,
    "manufacturer": listingView, 
    "role": listingView,         
    "manufacters": manufacterListingView,
    "404": notFoundView,
    "game": gameView
}

function handleRouting() {
    let { hash, params } = getHashAndParams();
    let route = hash.split('/')[0];

    if (routes.hasOwnProperty(route)) {
        routes[route].handleRouting(hash, params);
    } else {
        routes["404"].handleRouting();
    }
}

window.addEventListener('hashchange', handleRouting);
window.addEventListener('load', handleRouting);
