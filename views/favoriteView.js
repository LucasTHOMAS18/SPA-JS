export async function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const app = document.getElementById('app');
    const details = document.getElementById('details');
    details.innerHTML = '';
    app.innerHTML = '<h1>Liste des Vaisseaux</h1>' + favorites.map(p =>
        `<div class="horizontal-card" onclick="router('detail', ${p.id})">`
        + `<img src="${p.image}" alt="${p.nom}">`
        + `<h2>${p.nom}</h2>`
        + `</div>`
    ).join('');
}
