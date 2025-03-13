import { getHashAndParams } from '../app.js';
import { getFabricant, getRole, getVaisseau } from '../provider.js';
import { isFavorited, toggleFavorite } from '../services/favorisService.js';

export class DetailView {
    constructor() {
        this.details = document.getElementById('details');
    }

    async render(id) {
        const {hash, params} = getHashAndParams();
    
        params.set('detail', id);
        location.hash = `${hash}?${params.toString()}`;
        
        const vaisseau = await getVaisseau(id);
        const fabricant = (await getFabricant(vaisseau.fabricantId)).nom;
        const roles = await Promise.all(vaisseau.roles.map(async (roleId) => {
            const role = await getRole(roleId);
            return `<span class="clickable-role" onclick="location.hash='role?roleId=${roleId}'">${role.nom}</span>`;
        }));

        document.getElementById("details").innerHTML = 
        `<div>`
        + `<span onclick="hideDetails();" class='close-button material-symbols-rounded'>close</span>`
        + `<img src="${vaisseau.image}">`
        + "<section>"
        + `<h1>${vaisseau.nom}</h1>`
        + `<span id='favorite-button' class='material-symbols-rounded'>star</span>`
        + `<p><strong>Fabricant:</strong> <span class="clickable-fabricant" onclick="location.hash='manufacturer?fabricantId=${vaisseau.fabricantId}'">${fabricant}</span></p>`
        + `<p><strong>Roles:</strong> ${roles.join('')}</p>`
        + "</section>"
        + '</div>';
        
        if (isFavorited(vaisseau.id)) document.getElementById("favorite-button").classList.add("filled");
        document.getElementById('favorite-button').addEventListener('click', () => {
            toggleFavorite(vaisseau.id);
        });
    }
    
    async hide() {
        let {hash, params} = getHashAndParams();
    
        params.delete('detail');
        location.hash = params.toString() ? `${hash}?${params.toString()}` : hash;
        
        document.getElementById('details').innerHTML = '';
    }

}