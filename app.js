import { loadDetail } from './views/detailView.js';
import { loadFavorites } from './views/favoriteView.js';
import { loadListing } from './views/listingView.js';
import { loadSearch } from './views/searchViews.js';

export function route(view, id = null) {
    if (view === 'listing') loadListing();
    if (view === 'detail' && id) loadDetail(id);
    if (view === 'favorites') loadFavorites();
    if (view === 'search') {
        let querry = document.getElementById("search-field").value
        loadSearch(querry)
    };
}

window.route = route;
route('listing');