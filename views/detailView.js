import { getFabricant, getVaisseau } from '../provider.js';
import { isFavorited, toggleFavorite } from '../services/favorisService.js';

export async function loadDetail(id) {
    let vaiseau = await getVaisseau(id);

    document.getElementById("details").innerHTML = 
    `<span onclick="route('listing');" class='close-button material-symbols-rounded'>close</span>`
    + `<img src="${vaiseau.image}">`
    + "<section>"
    + `<h1>${vaiseau.nom}</h1>`
    + `<span id='favorite-button' class='material-symbols-rounded'>star</span>`
    + `<p><strong>Fabricant:</strong> ${(await getFabricant(vaiseau.fabricant)).nom}</p>`
    + `<p><strong>Roles:</strong> ${await vaiseau.roles}</p>`
    + "</section>";
    
    if (isFavorited(vaiseau.id)) document.getElementById("favorite-button").classList.add("filled");
    document.getElementById('favorite-button').addEventListener('click', () => {
        toggleFavorite(vaiseau.id);
    });
}

export async function hideDetails() {
    document.getElementById('details').innerHTML = '';
}