import { getFabricant, getRole, getVaisseau } from '../lib/provider.js';
import { getHashAndParams, removeHashParam } from '../lib/utils.js';
import { isFavorited, toggleFavorite } from '../services/favorisService.js';
import { dislike, isDisliked, isLiked, like } from '../services/voteService.js';
import { GenericView } from './genericView.js';
import { listingView } from './listingView.js';

class DetailView extends GenericView {
    async render(id) {
        // Loading animation
        document.getElementById('details').innerHTML = `
            <div>
                <span onclick="removeHashParam('detail');" class='close-button material-symbols-rounded'>close</span>

                <div class="loading-image"> </div>

                <section>
                    <div class="loading-text"> </div>
                    <div class="small-loading-text"> </div>
                    <div class="small-loading-text"> </div>
                </section>
            </div>
        `;

        // Detail rendering
        const vaisseau = await getVaisseau(id);
        const fabricant = (await getFabricant(vaisseau.fabricantId)).nom;

        const roles = await Promise.all(vaisseau.rolesIds.map(async (roleId) => {
            const role = await getRole(roleId);
            return `<span class="clickable-role" onclick="location.hash='role?roleId=${roleId}'">${role.nom}</span>`;
        }));

        document.getElementById("details").innerHTML = `
            <div>
                <span onclick="removeHashParam('detail');" class='close-button material-symbols-rounded'>close</span>
                
                ${vaisseau.trailer_url ? `
                    <iframe 
                        src="https://www.youtube-nocookie.com/embed/${vaisseau.trailer_url}?autoplay=1&controls=1&mute=1&loop=1&modestbranding=1&rel=0&disablekb=1" 
                        frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope"
                        allowfullscreen>
                    </iframe>` : 
                `<img src="${vaisseau.image}">`}
                
                <section>
                    <div class="details-header">
                        <h1>${vaisseau.nom}</h1>

                        <div class="interaction-section">
                            <span id="favorite-button" class='material-symbols-rounded'>star</span>
                            <div class='vote-section'>
                                <span id='like' class='material-symbols-rounded'>thumb_up</span>
                                <p id='score'>${vaisseau.score}</p>
                                <span id='dislike' class='material-symbols-rounded'>thumb_down</span>
                            </div>
                        </div>
                    </div>
                    
                    <p><strong>Fabricant:</strong> <span class="clickable-fabricant" onclick="location.hash='manufacturer?fabricantId=${vaisseau.fabricantId}'; window.scrollTo({top: 0, behavior: 'smooth'});">${fabricant}</span></p>
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

        if (await isLiked(vaisseau.id)) document.getElementById('like').classList.add('filled');
        if (await isDisliked(vaisseau.id)) document.getElementById('dislike').classList.add('filled');

        document.getElementById('like').addEventListener('click', async () => {
            const response = await like(vaisseau.id);
            if (response) {
                document.getElementById('dislike').classList.remove('filled');
                document.getElementById('like').classList.remove('filled');

                if (await isLiked(vaisseau.id)) document.getElementById('like').classList.add('filled');
                if (await isDisliked(vaisseau.id)) document.getElementById('dislike').classList.add('filled');

                document.getElementById('score').innerText = response.currentScore;
            }
        });

        document.getElementById('dislike').addEventListener('click', async () => {
            const response = await dislike(vaisseau.id);
            if (response) {

                document.getElementById('dislike').classList.remove('filled');
                document.getElementById('like').classList.remove('filled');

                if (await isLiked(vaisseau.id)) document.getElementById('like').classList.add('filled');
                if (await isDisliked(vaisseau.id)) document.getElementById('dislike').classList.add('filled');

                document.getElementById('score').innerText = response.currentScore;
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
