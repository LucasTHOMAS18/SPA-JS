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
        const shipsWithPrice = ships.filter(ship => ship.prix !== undefined && ship.prix !== null);
        
        const randomIndexes = new Set();
        while(randomIndexes.size < 2) {
            randomIndexes.add(Math.floor(Math.random() * shipsWithPrice.length));
        }
        this.currentShips = Array.from(randomIndexes).map(i => shipsWithPrice[i]);
    }

    async getNewRightShip() {
        const ships = await getVaisseaux();
        const shipsWithPrice = ships.filter(ship => ship.prix && ship.prix > 0);
        const availableShips = shipsWithPrice.filter(ship => ship.id !== this.currentShips[0]?.id);
        return availableShips[Math.floor(Math.random() * availableShips.length)];
    }

    async showResult(isCorrect) {
        const [leftShip, rightShip] = this.currentShips;
        const resultElement = document.createElement('div');
        resultElement.className = `game-result ${isCorrect ? 'correct' : 'incorrect'}`;
        
        const priceElement = document.createElement('div');
        priceElement.className = 'price-reveal';
        this.animatePrice(priceElement, rightShip.prix);

        resultElement.innerHTML = `
            ${isCorrect ? '✅ Correct !' : '❌ Incorrect !'}
            <div class="comparison">
                <div>${leftShip.nom}<br>${leftShip.prix.toLocaleString()} €</div>
                <div class="vs">VS</div>
                ${priceElement.outerHTML}
            </div>
            <button class="continue-btn">Continuer →</button>
        `;

        this.app.appendChild(resultElement);
        
        resultElement.querySelector('.continue-btn').addEventListener('click', () => {
            resultElement.remove();
            this.currentShips = [rightShip, null];
            this.render();
        });
    }

    animatePrice(element, targetPrice) {
        let current = 0;
        const increment = Math.ceil(targetPrice / 50);
        const animation = () => {
            current += increment;
            if(current >= targetPrice) {
                element.innerHTML = `${targetPrice.toLocaleString()} €`;
                return;
            }
            element.innerHTML = `${current.toLocaleString()} €`;
            requestAnimationFrame(animation);
        };
        requestAnimationFrame(animation);
    }

    async render() {
        this.footer.innerHTML = '';

        if (!this.currentShips.length || !this.currentShips[1]) {
            const newRightShip = await this.getNewRightShip();
            this.currentShips = [
                this.currentShips[0] || await this.getNewRightShip(),
                newRightShip
            ];
        }

        const [leftShip, rightShip] = this.currentShips;

        this.app.innerHTML = `
            <h1>Devinez le prix</h1>
            <div class="game-container">
                <div class="ship-card">
                    <h2>${leftShip.nom}</h2>
                    <img src="${leftShip.image}">
                    <p class="price">${leftShip.prix.toLocaleString()} €</p>
                </div>

                <div class="ship-card mystery">
                    <h2>${rightShip.nom}</h2>
                    <img src="${rightShip.image}">
                    <p class="price">???</p>
                    <div class="guess-buttons">
                        <button class="guess-btn higher">+ Cher</button>
                        <button class="guess-btn lower">- Cher</button>
                    </div>
                </div>
            </div>
            <div class="score-container">Score: ${this.score}</div>
        `;

        document.querySelector('.higher').addEventListener('click', () => {
            const isCorrect = leftShip.prix < rightShip.prix;
            if(isCorrect) this.score++;
            this.showResult(isCorrect);
        });

        document.querySelector('.lower').addEventListener('click', () => {
            const isCorrect = leftShip.prix > rightShip.prix;
            if(isCorrect) this.score++;
            this.showResult(isCorrect);
        });
    }
}

export const gameView = new GameView();