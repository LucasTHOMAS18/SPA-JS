import { ENDPOINT } from './config.js';

export async function getPersonnages() {
    const response = await fetch(ENDPOINT);
    return response.json();
}

export async function getPersonnage(id) {
    const response = await fetch(`${ENDPOINT}/${id}`);
    return response.json();
}
