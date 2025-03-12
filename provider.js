import { ENDPOINT, SHIPS_PER_PAGE } from './config.js';

export async function getVaisseaux(start=0, limit=SHIPS_PER_PAGE) {
    const response = await fetch(`${ENDPOINT}/vaisseaux?_start=${start}&_limit=${limit}`);
    return response.json();
}

export async function getVaisseau(id) {
    const response = await fetch(`${ENDPOINT}/vaisseaux/${id}`);
    return response.json();
}

export async function searchVaisseaux(query) {
    query = query.toLowerCase()
    let vaisseaux = await getVaisseaux(); 
    return vaisseaux.filter((vaisseau) => vaisseau.nom.toLowerCase().includes(query))
}

export async function getFabricants() {
    const response = await fetch(`${ENDPOINT}/fabricants`);
    return response.json();
}

export async function getFabricant(id) {
    const response = await fetch(`${ENDPOINT}/fabricants/${id}`);
    return response.json();
}

export const NUMBER_OF_SHIPS = 500; // Valeur par défaut
