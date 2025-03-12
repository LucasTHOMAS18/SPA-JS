import { SHIPS_PER_PAGE } from './config.js';
import { getVaisseaux, NUMBER_OF_SHIPS, searchVaisseaux } from './provider.js';
import { getFavorites } from './services/favorisService.js';
import { hideDetails, loadDetail } from './views/detailView.js';
import { loadListing } from './views/listingView.js';

export function getHashAndParams() {
    let [hashPart, paramString] = window.location.hash.split('?');
    let hash = hashPart.replace('#', '');
    let params = new URLSearchParams(paramString || '');
    return { hash, params };
}

export function setHashParam(key, value) {
    let { hash, params } = getHashAndParams();
    params.set(key, value);
    
    let newHash = hash + (params.toString() ? `?${params.toString()}` : '');
    
    window.location.hash = newHash;
}

async function handleRouting() {
    let {hash, params} = getHashAndParams();

    let query = params.get('query');
    let detailId = params.get('detail');
    
    let page = params.get('page');
    let start = page ? (page - 1) * SHIPS_PER_PAGE : 0;
    let limit = page ? (page) * SHIPS_PER_PAGE : SHIPS_PER_PAGE

    switch (hash) {
        case 'listing':
            await loadListing("Liste des vaisseaux", await getVaisseaux(start, limit), page, parseInt(NUMBER_OF_SHIPS / SHIPS_PER_PAGE));
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
window.hideDetails = hideDetails;
window.setHashParam = setHashParam;