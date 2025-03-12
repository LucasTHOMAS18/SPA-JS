import { loadDetail } from './views/detailView.js';
import { loadFavorites } from './views/favoriteView.js';
import { loadListing } from './views/listingView.js';
import { loadSearch } from './views/searchViews.js';

export function showDetails(id) {
    loadDetail(id);
}

function handleRouting() {
    let hash = window.location.hash.replace('#', '');
    let args = hash.split('/');

    switch (args[0]) {
        case 'listing': 
            loadListing();
            break;

        case 'favorites':
            loadFavorites();
            break;

        case 'search':
            let querry = decodeURIComponent(args[1]);
            loadSearch(querry);
            break;

        default:
            location.hash = 'listing';
            break;
    }
}

window.addEventListener('DOMContentLoaded', handleRouting);
window.addEventListener('hashchange', handleRouting);

window.showDetails = showDetails;