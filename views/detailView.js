import { getFabricant, getRole, getVaisseau } from '../lib/provider.js';
import { getHashAndParams } from '../lib/utils.js';
import { isFavorited, toggleFavorite } from '../services/favorisService.js';
import { GenericView } from './genericView.js';

class DetailView extends GenericView {
    async render(id) {
        const {hash, params} = getHashAndParams();
    
        params.set('detail', id);
        location.hash = `${hash}?${params.toString()}`;
        
        const vaisseau = await getVaisseau(id);
        const fabricant = (await getFabricant(vaisseau.fabricantId)).nom;
        const roles = await Promise.all(vaisseau.rolesIds.map(async (roleId) => {
            return " " + (await getRole(roleId)).nom;
        }));

        document.getElementById("details").innerHTML = 
        `<div>`
        + `<span onclick="hideDetails();" class='close-button material-symbols-rounded'>close</span>`
        + `<img src="${vaisseau.image}">`
        + "<section>"
        + `<h1>${vaisseau.nom}</h1>`
        + `<span id='favorite-button' class='material-symbols-rounded'>star</span>`
        + `<p><strong>Fabricant:</strong> ${fabricant}</p>`
        + `<p><strong>Roles:</strong> ${roles}</p>`
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

export const detailView = new DetailView();
window.showDetails = detailView.render;
window.hideDetails = detailView.hide;
