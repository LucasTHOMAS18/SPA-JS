import { getHashAndParams } from "./lib/utils.js";
import { listingView } from "./views/listingView.js";

// Routing
const routes = {
    "": listingView,
    "listing": listingView,
    "search": listingView,
    "favorites": listingView,
}

function handleRouting() {
    let { hash, params } = getHashAndParams();
    let route = hash.split('/')[0];
    routes[route].handleRouting(hash, params);
}

window.addEventListener('hashchange', handleRouting);
window.addEventListener('load', handleRouting);
