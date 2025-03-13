import { getHashAndParams } from "./lib/utils.js";
import { notFoundView } from "./views/404View.js";
import { listingView } from "./views/listingView.js";

// Routing
const routes = {
    "": listingView,
    "listing": listingView,
    "search": listingView,
    "favorites": listingView,
    "404": notFoundView,
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
