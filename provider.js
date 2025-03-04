import { ENDPOINT } from './config.js';

export async function getVaisseaux() {
    const response = await fetch(ENDPOINT);
    return response.json();
}

export async function getVaisseau(id) {
    const response = await fetch(`${ENDPOINT}/${id}`);
    return response.json();
}

export async function getMarques() {
    const response = await fetch('http://localhost:3000/marques');
    return response.json();
}

export async function getMarque(id) {
    const response = await fetch(`http://localhost:3000/marques/${id}`);
    return response.json();
}

export async function getArmes() {
    const response = await fetch('http://localhost:3000/armes');
    return response.json();
}

export async function getArme(id) {
    const response = await fetch(`http://localhost:3000/armes/${id}`);
    return response.json();
}