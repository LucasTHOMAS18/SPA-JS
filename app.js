import { hideDetails, loadDetail } from './views/detailView.js';
import { loadFavorites } from './views/favoriteView.js';
import { loadListing } from './views/listingView.js';
import { loadSearch } from './views/searchViews.js';

export function showDetails(id) {
    let hash = window.location.hash.split('?')[0].replace('#', '');
    let params = new URLSearchParams(window.location.hash.split('?')[1]);

    params.set('detail', id);
    location.hash = `${hash}?${params.toString()}`;

    loadDetail(id);
}

export function updateSearchQuery(query) {
    location.hash = `search?query=${encodeURIComponent(query)}`;
}

function handleRouting() {
    let hash = window.location.hash.split('?')[0].replace('#', '');
    let params = new URLSearchParams(window.location.hash.split('?')[1]);

    let query = params.get('query');
    let detailId = params.get('detail');

    switch (hash) {
        case 'listing':
            loadListing();
            break;

        case 'favorites':
            loadFavorites();
            break;

        case 'search':
            if (query) loadSearch(query);
            break;

        default:
            location.hash = 'listing';
            return;
    }

    if (detailId) {
        let id = parseInt(detailId);
        if (!isNaN(id)) showDetails(id);
    }
}

window.addEventListener('DOMContentLoaded', handleRouting);
window.addEventListener('hashchange', handleRouting);

window.showDetails = showDetails;
window.updateSearchQuery = updateSearchQuery;
window.hideDetails = hideDetails;