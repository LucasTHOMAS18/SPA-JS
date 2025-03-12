import { getHashAndParams } from '../app.js';
import { getFabricant, getVaisseau } from '../provider.js';
import { isFavorited, toggleFavorite } from '../services/favorisService.js';

export class DetailView {
    constructor() {
        this.details = document.getElementById('details');
    }

    async render(id) {
        let {hash, params} = getHashAndParams();
    
        params.set('detail', id);
        location.hash = `${hash}?${params.toString()}`;
        
        let vaiseau = await getVaisseau(id);
    
        document.getElementById("details").innerHTML = 
        `<div id=${vaiseau.id}>`
        + `<span onclick="hideDetails();" class='close-button material-symbols-rounded'>close</span>`
        + `<img src="${vaiseau.image}">`
        + "<section>"
        + `<h1>${vaiseau.nom}</h1>`
        + `<span id='favorite-button' class='material-symbols-rounded'>star</span>`
        + `<p><strong>Fabricant:</strong> ${(await getFabricant(vaiseau.fabricant)).nom}</p>`
        + `<p><strong>Roles:</strong> ${await vaiseau.roles}</p>`
        + "</section>"
        + '</div>';
        
        if (isFavorited(vaiseau.id)) document.getElementById("favorite-button").classList.add("filled");
        document.getElementById('favorite-button').addEventListener('click', () => {
            toggleFavorite(vaiseau.id);
        });
    }
    
    async hide() {
        let {hash, params} = getHashAndParams();
    
        params.delete('detail');
        location.hash = params.toString() ? `${hash}?${params.toString()}` : hash;
        
        document.getElementById('details').innerHTML = '';
    }

}