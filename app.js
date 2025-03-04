import { loadDetail } from './views/detailView.js';
import { loadFavorites } from './views/favoriteView.js';
import { loadListing } from './views/listingView.js';

export function route(view, id = null) {
    if (view === 'listing') loadListing();
    if (view === 'detail' && id) loadDetail(id);
    if (view === 'favorites') loadFavorites();
}

window.route = route;
route('listing');
