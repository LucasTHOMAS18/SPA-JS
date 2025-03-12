
export async function loadListing(title, vaisseaux) {
    const app = document.getElementById('app');
    const details = document.getElementById('details');
    
    details.innerHTML = '';
    app.innerHTML = `<h1>${title}</h1>` + vaisseaux.map(p =>
        `<div class="horizontal-card" onclick="loadDetail(${p.id})">`
        + `<img src="${p.image}" alt="${p.nom}">`
        + `<h2>${p.nom}</h2>`
        + `</div>`
    ).join('');
}
