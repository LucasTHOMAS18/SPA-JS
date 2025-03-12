import { getHashParam } from "../app.js";

export class ListingView {
    constructor(shipsPerPage) {
        this.shipsPerPage = shipsPerPage;

        this.app = document.getElementById('app');
        this.details = document.getElementById('details');
        this.footer = document.getElementById('footer');
    }
    
    async render(title, vaisseaux) {    
        this.details.innerHTML = '';
        
        this.footer.innerHTML=""
        let selectedPage = parseInt(getHashParam('page')) || 1;
        let displayedShips = vaisseaux.slice((selectedPage - 1) * this.shipsPerPage, selectedPage * this.shipsPerPage);
        
        this.app.innerHTML = `<h1>${title}</h1>` + displayedShips.map(p =>
            `<div class="horizontal-card" onclick="loadDetail(${p.id})">`
            + `<img src="${p.image}" alt="${p.nom}">`
            + `<h2>${p.nom}</h2>`
            + `</div>`
        ).join('');
        
        if (vaisseaux.length > this.shipsPerPage)  {
            for (let i=1; i <= parseInt(vaisseaux.length / this.shipsPerPage) + 1; i++) {
                footer.innerHTML += `<button class='${i === selectedPage ? "selected" : ""}' onclick="setHashParam('page', ${i}); hideDetails(); window.scrollTo({top: 0, behavior: 'smooth'});">${i}</button>`
            }
        }
    }
}
