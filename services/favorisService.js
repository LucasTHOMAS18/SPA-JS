import { getVaisseau } from '../provider.js';
import { hideDetails } from '../views/detailView.js';

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

export function toggleFavorite(id) {
    console.log("Skibidi")

    if (getFavorites().find(fav => fav.id === id)) {
        removeFavorite(id);

        document.getElementById("favorite-button").style.fontVariationSettings = "FILL: 0";
        
        if (document.getElementById(id)) {
            document.getElementById(id).remove();
            hideDetails()
        }
    } else {
        document.getElementById("favorite-button").style.fontVariationSettings = "FILL: 0";
        addFavorite(id);
    }
}