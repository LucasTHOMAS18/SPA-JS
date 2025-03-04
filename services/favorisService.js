import { getVaisseau } from '../provider.js';

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
