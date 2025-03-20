import { SHIPS_PER_PAGE } from '../lib/config.js';
import { getFabricant, getRole, getVaisseau, getVaisseaux, getVaisseauxByFabricant, getVaisseauxByRole, searchVaisseaux } from '../lib/provider.js';
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
        window.showVideo = ListingView.showVideo;
        window.hideVideo = ListingView.hideVideo;
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

    static async showVideo(id) {
        ListingView.hideVideo();
    
        const card = document.getElementById(id);
        const container = card.querySelector(".image-container");
        const overlay = card.querySelector(".overlay");
    
        const vaisseau = await getVaisseau(id);
    
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${vaisseau.trailer_url}?autoplay=1&mute=1&loop=1&modestbranding=1&rel=0&disablekb=1&playsinline=1&color=white&showinfo=0`;
        iframe.allowFullscreen = true;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
        iframe.setAttribute('data-noresize', '1');
        iframe.setAttribute('data-optimize', '1');
    
        container.insertBefore(iframe, overlay);
    }
    

    static async hideVideo(id) {
        const iframe = document.querySelector("iframe");
        if (iframe) {
            iframe.src = '';
            iframe.remove();
        }
    }

    async render() {
        this.details.innerHTML = '';

        this.footer.innerHTML = ""
        let selectedPage = parseInt(getHashParam('page')) || 1;
        let displayedShips = this.renderedShips;

        this.app.innerHTML = `<h1>${this.title}</h1>` + displayedShips.map(p =>
            `<div id=${p.id} class="horizontal-card" onclick="setHashParam('detail', ${p.id})">
                <div class='image-container'>
                    <div class="overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: transparent;"></div>
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
