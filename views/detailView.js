import { getVaisseau } from '../provider.js';

export async function loadDetail(id) {
    let vaiseau = await getVaisseau(id);

    document.getElementById("app").innerHTML = `<h1>${vaiseau.nom}</h1>`
    + `<p>Classe: ${vaiseau.classe}</p>`
}