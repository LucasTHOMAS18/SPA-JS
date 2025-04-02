import { SHIPS_PER_PAGE } from '../lib/config.js';
import { getFabricants } from '../lib/provider.js';
import { getHashParam } from '../lib/utils.js';
import { ListingView } from './listingView.js';

class ManufacterListingView extends ListingView {
    constructor() {
        super();

        this.title = '';
        this.manufacters = [];

        window.currentPage = this.currentPage;
    }

    get renderedmanufacters() {
        let selectedPage = parseInt(getHashParam('page')) || 1;

        if (selectedPage > Math.ceil(this.manufacters.length / SHIPS_PER_PAGE)) {
            selectedPage = Math.ceil(this.manufacters.length / SHIPS_PER_PAGE);
        }

        return this.manufacters.slice((selectedPage - 1) * SHIPS_PER_PAGE, selectedPage * SHIPS_PER_PAGE);
    }

    async handleRouting(hash, params) {
        super.handleRouting(hash, params);
        this.manufacters = await getFabricants();
        this.render();
    }

    async render() {
        this.showLoadingAnimation();
        this.footer.innerHTML = ""
        
        let selectedPage = parseInt(getHashParam('page')) || 1;
        let displayedmanufacters = this.renderedmanufacters;

        this.app.innerHTML = `<h1>${this.title}</h1>` + displayedmanufacters.map(p =>
            `<div id=${p.id} class="horizontal-card" onclick="location.hash='manufacturer'; setHashParam('fabricantId', ${p.id}); window.scrollTo({top: 0, behavior: 'smooth'});">
                
                <div class='image-container'>
                    <img loading="lazy" class="logo" src="${p.logo}" alt="${p.nom}">
                </div>
                <h2>${p.nom}</h2>
            </div>`
        ).join('');

        if (this.manufacters.length > SHIPS_PER_PAGE) {
            for (let i = 1; i <= parseInt(this.manufacters.length / SHIPS_PER_PAGE) + 1; i++) {
                footer.innerHTML += `<button class='${i === selectedPage ? "selected" : ""}' onclick="setHashParam('page', ${i}); removeHashParam('detail'); window.scrollTo({top: 0, behavior: 'smooth'});">${i}</button>`
            }
        }
    }
}

export const manufacterListingView = new ManufacterListingView();