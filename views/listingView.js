import { getVaisseaux } from '../provider.js';

export async function loadListing() {
    const vaisseaux = await getVaisseaux();
    const app = document.getElementById('app');
    app.innerHTML = '<h1>Liste des Vaisseaux</h1>' + vaisseaux.map(p =>
        `<div onclick="router('detail', ${p.id})">${p.nom}</div>`
    ).join('');
}
