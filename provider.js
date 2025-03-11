import { ENDPOINT } from './config.js';

export async function getVaisseaux() {
    const response = await fetch(`${ENDPOINT}/vaisseaux/`);
    return response.json();
}

export async function getVaisseau(id) {
    const response = await fetch(`${ENDPOINT}/vaisseaux/${id}`);
    return response.json();
}

export async function getFabricants() {
    const response = await fetch(`${ENDPOINT}/fabricants`);
    return response.json();
}

export async function getFabricant(id) {
    const response = await fetch(`${ENDPOINT}/fabricants/${id}`);
    return response.json();
}
