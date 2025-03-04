import { getFavorites } from '../services/favorisService.js';

export async function loadFavorites() {
    const favorites = getFavorites();
    
    const app = document.getElementById('app');
    const details = document.getElementById('details');
    details.innerHTML = '';
    app.innerHTML = '<h1>Liste des Vaisseaux</h1>' + favorites.map(p =>
        `<div class="horizontal-card" onclick="route('detail', ${p.id})">`
        + `<img src="${p.image}" alt="${p.nom}">`
        + `<h2>${p.nom}</h2>`
        + `</div>`
    ).join('');
}
