import { searchVaisseaux } from '../provider.js';

export async function loadSearch(querry) {
    const vaisseaux = await searchVaisseaux(querry);
    
    const app = document.getElementById('app');
    const details = document.getElementById('details');
    
    details.innerHTML = '';
    app.innerHTML = '<h1>Resultats de la recherche</h1>' + vaisseaux.map(p =>
        `<div class="horizontal-card" onclick="route('detail', ${p.id})">`
        + `<img src="${p.image}" alt="${p.nom}">`
        + `<h2>${p.nom}</h2>`
        + `</div>`
    ).join('');
}
