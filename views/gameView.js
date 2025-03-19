import { GenericView } from './genericView.js';
import { getVaisseaux } from '../lib/provider.js';

class GameView extends GenericView {
    constructor() {
        super();
        this.score = 0;
        this.currentShips = [];
    }

    async handleRouting() {
        this.render();
    }

    async getRandomShips() {
        const ships = await getVaisseaux();
        const randomIndexes = new Set();
        while(randomIndexes.size < 2) {
            randomIndexes.add(Math.floor(Math.random() * ships.length));
        }
        this.currentShips = Array.from(randomIndexes).map(i => ships[i]);
    }

    async showResult(isCorrect) {
        const [leftShip, rightShip] = this.currentShips;
        this.app.innerHTML += `
            <div class="game-result ${isCorrect ? 'correct' : 'incorrect'}">
                ${isCorrect ? 'Correct !' : 'Incorrect !'}
                <p>${rightShip.nom} : ${rightShip.prix} UEC</p>
                <button onclick="location.reload()">Continuer</button>
            </div>
        `;
    }

    async render() {
        await this.getRandomShips();
        const [leftShip, rightShip] = this.currentShips;

        this.app.innerHTML = `
            <h1>Devinez le prix</h1>
            <div class="game-container">
                <div class="ship-card">
                    <h2>${leftShip.nom}</h2>
                    <img src="${leftShip.image}">
                    <p class="price">${leftShip.prix} UEC</p>
                </div>
                
                <div class="vs-container">
                    <h2>VS</h2>
                    <div class="buttons">
                        <button class="guess-btn higher">+ Cher</button>
                        <button class="guess-btn lower">- Cher</button>
                    </div>
                    <p class="score">Score: ${this.score}</p>
                </div>

                <div class="ship-card">
                    <h2>${rightShip.nom}</h2>
                    <img src="${rightShip.image}">
                    <p class="price">???</p>
                </div>
            </div>
        `;

        document.querySelector('.higher').addEventListener('click', () => {
            const isCorrect = leftShip.prix > rightShip.prix;
            if(isCorrect) this.score++;
            this.showResult(isCorrect);
        });

        document.querySelector('.lower').addEventListener('click', () => {
            const isCorrect = leftShip.prix < rightShip.prix;
            if(isCorrect) this.score++;
            this.showResult(isCorrect);
        });
    }
}

export const gameView = new GameView();