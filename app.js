import { SHIPS_PER_PAGE } from './config.js';
import { getVaisseaux, searchVaisseaux, getFabricant } from './provider.js';
import { getFavorites } from './services/favorisService.js';
import { DetailView } from './views/detailView.js';
import { ListingView } from './views/listingView.js';

// URL management
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

export function getHashParam(key) {
    let { params } = getHashAndParams();
    return params.get(key);
}

// Routing
export const listingView = new ListingView(SHIPS_PER_PAGE);
export const detailView = new DetailView();

async function handleRouting() {
    let {hash, params} = getHashAndParams();

    let query = params.get('query');
    let detailId = params.get('detail');
    let fabricantId = params.get('fabricantId');
    
    switch (hash) {
        case 'listing':
            await listingView.render("Liste des vaisseaux", await getVaisseaux());
            break;

        case 'favorites':
            await listingView.render("Liste des favoris", await getFavorites());
            break;

        case 'search':
            if (query) await listingView.render("Resultats de la recherche", await searchVaisseaux(query));
            break;

        case 'manufacturer':
            if (fabricantId) {
                const fabricant = await getFabricant(fabricantId);
                await listingView.render(`Vaisseaux de ${fabricant.nom}`, await getVaisseauxByFabricant(fabricantId));
            }
            break;

        default:
            location.hash = 'listing';
            return;
    }

    if (detailId) {
        let id = parseInt(detailId);
        if (!isNaN(id)) detailView.render(id);
    }
}

window.addEventListener('DOMContentLoaded', handleRouting);
window.addEventListener('hashchange', handleRouting);

window.loadDetail = detailView.render;
window.hideDetails = detailView.hide;
window.setHashParam = setHashParam;