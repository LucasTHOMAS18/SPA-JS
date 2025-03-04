import { ENDPOINT } from './config.js';

export async function getVaisseaux() {
    const response = await fetch(ENDPOINT);
    return response.json();
}

export async function getVaisseau(id) {
    const response = await fetch(`${ENDPOINT}/${id}`);
    return response.json();
}

export async function getFabricants() {
    const response = await fetch('http://localhost:3000/fabricants');
    return response.json();
}

export async function getFabricant(id) {
    const response = await fetch(`http://localhost:3000/fabricants/${id}`);
    return response.json();
}
