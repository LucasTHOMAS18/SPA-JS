import { getVaisseau } from '../lib/provider.js';

export async function addFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const vaisseau = await getVaisseau(id);

    if (!favorites.find(fav => fav.id === vaisseau.id)) {
        favorites.push(vaisseau);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

export function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

export function removeFavorite(id) {
    const favorites = getFavorites().filter(fav => fav.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

export function isFavorited(id) {
    return getFavorites().some(fav => fav.id === id);
}

export function toggleFavorite(id) {
    if (getFavorites().find(fav => fav.id === id)) {
        removeFavorite(id);
        return false;
    } else {
        addFavorite(id);
        return true;
    }
}