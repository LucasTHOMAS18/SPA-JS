import { SHIPS_PER_PAGE } from '../lib/config.js';
import { getFabricant, getRole, getVaisseaux, getVaisseauxByFabricant, getVaisseauxByRole, searchVaisseaux } from '../lib/provider.js';
import { getHashParam } from '../lib/utils.js';
import { getFavorites } from '../services/favorisService.js';
import { detailView } from './detailView.js';
import { GenericView } from './genericView.js';

class ListingView extends GenericView {
    constructor() {
        super();

        GenericView.previousParams = new URLSearchParams();

        this.title = '';
        this.ships = [];

        window.currentPage = this.currentPage;
    }

    get renderedShips() {
        let selectedPage = parseInt(getHashParam('page')) || 1;

        if (selectedPage > Math.ceil(this.ships.length / SHIPS_PER_PAGE)) {
            selectedPage = Math.ceil(this.ships.length / SHIPS_PER_PAGE);
        }

        return this.ships.slice((selectedPage - 1) * SHIPS_PER_PAGE, selectedPage * SHIPS_PER_PAGE);
    }

    async handleRouting(hash, params) {
        const query = params.get('query');
        const page = params.get('page');
        const detail = params.get('detail');
        const fabricantId = params.get('fabricantId');
        const roleId = params.get('roleId');

        // Handle detail view
        if (detail) {
            detailView.render(detail);
        } else {
            detailView.hide();
        }

        // Handle page index change
        if (hash != "" && hash === GenericView.previousHash && 
            query === GenericView.previousParams.get('query') &&
            fabricantId === GenericView.previousParams.get('fabricantId') &&
            roleId === GenericView.previousParams.get('roleId')) {
            if (page !== GenericView.previousParams.get('page')) { // Prevent re-rendering if detail view is openned
                GenericView.previousParams = params;
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
                
            case 'manufacturer':
                if (fabricantId) {
                    const fabricant = await getFabricant(fabricantId);
                    this.title = `Vaisseaux de ${fabricant.nom}`;
                    this.ships = await getVaisseauxByFabricant(fabricantId);
                } else {
                    this.title = "Liste des vaisseaux";
                    this.ships = await getVaisseaux();
                }
                break;
                
            case 'role':
                if (roleId) {
                    const role = await getRole(roleId);
                    this.title = `Vaisseaux avec rôle: ${role.nom}`;
                    this.ships = await getVaisseauxByRole(roleId); // <-- Doit appeler la fonction corrigée
                }
                break;

                
            default:
                this.title = "Liste des vaisseaux";
                this.ships = await getVaisseaux();
                break;
        }

        this.render();
        GenericView.previousHash = hash;
        GenericView.previousParams = params
    }

    async render() {
        this.details.innerHTML = '';

        this.footer.innerHTML = ""
        let selectedPage = parseInt(getHashParam('page')) || 1;
        let displayedShips = this.renderedShips;

        this.app.innerHTML = `<h1>${this.title}</h1>` + displayedShips.map(p =>
            `<div id=${p.id} class="horizontal-card" onclick="setHashParam('detail', ${p.id})">
                
                <div class='image-container'>
                    <img src="${p.image}" alt="${p.nom}">
                </div>
                <h2>${p.nom}</h2>
            </div>`
        ).join('');

        if (this.ships.length > SHIPS_PER_PAGE) {
            for (let i = 1; i <= parseInt(this.ships.length / SHIPS_PER_PAGE) + 1; i++) {
                footer.innerHTML += `<button class='${i === selectedPage ? "selected" : ""}' onclick="setHashParam('page', ${i}); removeHashParam('detail'); window.scrollTo({top: 0, behavior: 'smooth'});">${i}</button>`
            }
        }
    }
}

export const listingView = new ListingView();