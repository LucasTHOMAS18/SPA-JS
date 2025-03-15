import { getFabricant, getRole, getVaisseau } from '../lib/provider.js';
import { getHashAndParams, removeHashParam } from '../lib/utils.js';
import { isFavorited, toggleFavorite } from '../services/favorisService.js';
import { GenericView } from './genericView.js';
import { listingView } from './listingView.js';

class DetailView extends GenericView {
    async render(id) {
        const vaisseau = await getVaisseau(id);
        const fabricant = (await getFabricant(vaisseau.fabricantId)).nom;
        const roles = await Promise.all(vaisseau.rolesIds.map(async (roleId) => {
            return " " + (await getRole(roleId)).nom;
        }));

        document.getElementById("details").innerHTML =
            `<div>
                <span onclick="removeHashParam('detail');" class='close-button material-symbols-rounded'>close</span>
                <img src="${vaisseau.image}">
                <section>
                    <h1>${vaisseau.nom} <span id='favorite-button' class='material-symbols-rounded'>star</span></h1>
                    
                    <p><strong>Fabricant:</strong> ${fabricant}</p>
                    <p><strong>Roles:</strong> ${roles}</p>
                </section>
            </div>`;

        if (isFavorited(vaisseau.id)) document.getElementById("favorite-button").classList.add("filled");
        document.getElementById('favorite-button').addEventListener('click', () => {
            const added = toggleFavorite(vaisseau.id);

            if (added) {
                document.getElementById("favorite-button").classList.add("filled");
            } else {
                document.getElementById("favorite-button").classList.remove("filled")
                if (getHashAndParams().hash === 'favorites') {
                    this.hide();
                    document.getElementById(vaisseau.id).remove();
                    listingView.ships.splice(listingView.ships.findIndex(ship => ship.id === vaisseau.id), 1);
                    listingView.render();
                }
            }
        });
    }

    async hide() {
        removeHashParam('detail');
        document.getElementById('details').innerHTML = '';
    }
}

export const detailView = new DetailView();
window.showDetails = detailView.render;
window.hideDetails = detailView.hide;
