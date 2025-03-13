import { SHIPS_PER_PAGE } from '../lib/config.js';
import { getVaisseaux, searchVaisseaux } from '../lib/provider.js';
import { getHashParam } from '../lib/utils.js';
import { getFavorites } from '../services/favorisService.js';
import { detailView } from './detailView.js';
import { GenericView } from './genericView.js';

class ListingView extends GenericView {
    constructor() {
        super();

        this.previousHash = '';
        this.previousParams = new URLSearchParams();

        this.title = '';
        this.ships = [];

        window.currentPage = this.currentPage;
    }

    get renderedShips() {
        let selectedPage = parseInt(getHashParam('page')) || 1;
        return this.ships.slice((selectedPage - 1) * SHIPS_PER_PAGE, selectedPage * SHIPS_PER_PAGE);
    }

    async handleRouting(hash, params) {
        const query = params.get('query');
        const page = params.get('page');
        const detail = params.get('detail');

        // Handle detail view
        if (detail) {
            detailView.render(detail);
        } else {
            detailView.hide();
        }

        // Handle page index change
        if (hash === this.previousHash && query === this.previousParams.get('query')) {
            if (page !== this.previousParams.get('page')) { // Prevent re-rendering if detail view is openned
                this.previousParams = params;
                this.render();
                return;
            } else {
                return;
            }
        }

        // Handle page change
        console.log("Page changed")
        switch (hash) {
            case 'search':
                this.title = `Résultats de la recherche pour "${query}"`;
                this.ships = await searchVaisseaux(query);
                break;

            case 'favorites':
                this.title = "Liste des favoris";
                this.ships = await getFavorites();
                break;

            default:
                this.title = "Liste des vaisseaux";
                this.ships = await getVaisseaux();
                break;
        }

        this.render();
        this.previousHash = hash;
        this.previousParams = params
    }

    async render() {
        this.details.innerHTML = '';

        this.footer.innerHTML = ""
        let selectedPage = parseInt(getHashParam('page')) || 1;
        let displayedShips = this.renderedShips;

        this.app.innerHTML = `<h1>${this.title}</h1>` + displayedShips.map(p =>
            `<div id=${p.id} class="horizontal-card" onclick="setHashParam('detail', ${p.id})">`
            + `<img src="${p.image}" alt="${p.nom}">`
            + `<h2>${p.nom}</h2>`
            + `</div>`
        ).join('');

        if (this.ships.length > SHIPS_PER_PAGE) {
            for (let i = 1; i <= parseInt(this.ships.length / SHIPS_PER_PAGE) + 1; i++) {
                footer.innerHTML += `<button class='${i === selectedPage ? "selected" : ""}' onclick="setHashParam('page', ${i}); removeHashParam('detail'); window.scrollTo({top: 0, behavior: 'smooth'});">${i}</button>`
            }
        }
    }
}

export const listingView = new ListingView();