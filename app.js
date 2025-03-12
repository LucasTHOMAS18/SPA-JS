import { loadDetail } from './views/detailView.js';
import { loadFavorites } from './views/favoriteView.js';
import { loadListing } from './views/listingView.js';
import { loadSearch } from './views/searchViews.js';

export function route(view, ...args) {
    if (view === 'listing') loadListing();
    if (view === 'detail') loadDetail(args);
    if (view === 'favorites') loadFavorites();
    if (view === 'search') {
        let querry = document.getElementById("search-field").value
        loadSearch(querry)
    };
}

window.route = route;
route('listing');