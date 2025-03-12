
export async function loadListing(title, vaisseaux, selectedPage=0, numberOfPages=0) {
    const app = document.getElementById('app');
    const details = document.getElementById('details');
    const footer = document.getElementById('footer')

    details.innerHTML = '';
    app.innerHTML = `<h1>${title}</h1>` + vaisseaux.map(p =>
        `<div class="horizontal-card" onclick="loadDetail(${p.id})">`
        + `<img src="${p.image}" alt="${p.nom}">`
        + `<h2>${p.nom}</h2>`
        + `</div>`
    ).join('');

    footer.innerHTML=""
    for (let i=1; i < numberOfPages; i++) {
        footer.innerHTML += `<button class='${i === selectedPage ? "selected" : ""}' onclick="setHashParam('page', ${i});">${i}<button>`
    }
}
