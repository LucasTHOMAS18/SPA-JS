import { ENDPOINT } from "../lib/config.js";

export async function like(shipId) {
    const response = await fetch(`${ENDPOINT}/like?id=${shipId}`, {
        method: 'POST',
    });
    return response.json();
}

export async function dislike(shipId) {
    const response = await fetch(`${ENDPOINT}/dislike?id=${shipId}`, {
        method: 'POST',
    });
    return response.json();
}

export async function isLiked(shipId) {
    const response = await fetch(`${ENDPOINT}/vote-status?id=${shipId}`);
    let liked = false;
    await response.json().then(data => {
        liked = data.voteType === 'like';
    });

    return liked;
}

export async function isDisliked(shipId) {
    const response = await fetch(`${ENDPOINT}/vote-status?id=${shipId}`);
    let disliked = false;
    await response.json().then(data => {
        disliked = data.voteType === 'dislike';
    });

    return disliked;
}