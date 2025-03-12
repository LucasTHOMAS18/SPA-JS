import { getVaisseaux, searchVaisseaux } from './provider.js';
import { getFavorites } from './services/favorisService.js';
import { hideDetails, loadDetail } from './views/detailView.js';
import { loadListing } from './views/listingView.js';

export function updateSearchQuery(query) {
    location.hash = `search?query=${encodeURIComponent(query)}`;
}

async function handleRouting() {
    let hash = window.location.hash.split('?')[0].replace('#', '');
    let params = new URLSearchParams(window.location.hash.split('?')[1]);

    let query = params.get('query');
    let detailId = params.get('detail');

    switch (hash) {
        case 'listing':
            await loadListing("Liste des vaisseaux", await getVaisseaux());
            break;

        case 'favorites':
            await loadListing("Liste des favoris", await getFavorites());
            break;

        case 'search':
            if (query) await loadListing("Resultats de la recherche", await searchVaisseaux(query));
            break;

        default:
            location.hash = 'listing';
            return;
    }

    if (detailId) {
        let id = parseInt(detailId);
        if (!isNaN(id)) loadDetail(id);
    }
}

window.addEventListener('DOMContentLoaded', handleRouting);
window.addEventListener('hashchange', handleRouting);

window.loadDetail = loadDetail;
window.updateSearchQuery = updateSearchQuery;
window.hideDetails = hideDetails;