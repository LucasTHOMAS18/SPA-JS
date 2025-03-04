import { getFabricant, getVaisseau } from '../provider.js';

export async function loadDetail(id) {
    let vaiseau = await getVaisseau(id);

    document.getElementById("details").innerHTML = 
    `<span onclick="router('listing');" class='close-button material-symbols-rounded'>close</span>`
    + `<img src="${vaiseau.image}">`
    + "<section>"
    + `<h1>${vaiseau.nom}</h1>`
    + `<p><strong>Fabricant:</strong> ${(await getFabricant(vaiseau.fabricant)).nom}</p>`
    + `<p><strong>Roles:</strong> ${await vaiseau.roles}</p>`
    + "</section>";
}