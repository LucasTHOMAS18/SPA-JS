import { ENDPOINT } from './config.js';

export async function getVaisseaux() {
    const response = await fetch(`${ENDPOINT}/vaisseaux`);
    return response.json();
}

export async function getVaisseau(id) {
    const response = await fetch(`${ENDPOINT}/vaisseaux/${id}`);
    return response.json();
}

export async function searchVaisseaux(query) {
    query = query.toLowerCase()
    const response = await fetch(`${ENDPOINT}/vaisseaux?nom_like=${query}`);
    const vaisseaux = await response.json();
    return vaisseaux;
}

export async function getFabricants() {
    const response = await fetch(`${ENDPOINT}/fabricants`);
    return response.json();
}

export async function getFabricant(id) {
    const response = await fetch(`${ENDPOINT}/fabricants/${id}`);
    return response.json();
}

export async function getRoles() {
    const response = await fetch(`${ENDPOINT}/roles`);
    return response.json();
}

export async function getRole(id) {
    const response = await fetch(`${ENDPOINT}/roles/${id}`);
    return response.json();
}

export let NUMBER_OF_SHIPS = null;
export async function getNumberOfShips() {
    if (NUMBER_OF_SHIPS) return NUMBER_OF_SHIPS;

    const response = await fetch(`${ENDPOINT}/vaisseaux`);
    const ships = await response.json();
    NUMBER_OF_SHIPS = ships.length;
    return NUMBER_OF_SHIPS;
}