import { getVaisseaux } from '../lib/provider.js';
import { GenericView } from './genericView.js';

class GameView extends GenericView {
    constructor() {
        super();
        this.score = 0;
        this.currentShips = [];
    }

    getBestScore() {
        const bestScore = localStorage.getItem('bestScore');
        return bestScore ? parseInt(bestScore) : 0;
    }

    setBestScore(score) {
        localStorage.setItem('bestScore', score);
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
        const guessButtons = document.querySelectorAll('.guess-buttons button');
        guessButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.pointerEvents = 'none';
        });
        
        const [leftShip, rightShip] = this.currentShips;
        const resultElement = document.createElement('div');
        resultElement.className = `game-result ${isCorrect ? 'correct' : 'incorrect'}`;
        
        resultElement.innerHTML = `
            <div class="popup-header ${isCorrect ? 'correct' : 'incorrect'}">
                <h2>${isCorrect ? 'Bien joué !' : 'Raté !'}</h2>
            </div>
            <div class="popup-body">
                <div class="ship-info">
                    <h3>${leftShip.nom}</h3>
                    <p>${Number(leftShip.prix).toLocaleString()} €</p>
                </div>
                <div class="separator"></div>
                <div class="ship-info">
                    <h3>${rightShip.nom}</h3>
                    <div class="price-reveal"></div>
                </div>
            </div>
            <div class="popup-footer">
                <button class="continue-btn">Continuer</button>
            </div>
        `;
        
        const priceRevealElement = resultElement.querySelector('.price-reveal');
        this.animatePrice(priceRevealElement, Number(rightShip.prix));

        resultElement.querySelector('.continue-btn').addEventListener('click', async () => {
            resultElement.remove();
            this.currentShips[0] = rightShip;
            this.currentShips[1] = await this.getNewRightShip();
            this.render();
        });

        this.app.appendChild(resultElement);
        if (this.score > this.getBestScore()) {
            this.setBestScore(this.score);
        }
    }

    animatePrice(element, targetPrice) {
        let current = 0;
        const increment = Math.ceil(targetPrice / 50);
        const animation = () => {
            current += increment;
            if (current >= targetPrice) {
                element.innerHTML = `${targetPrice.toLocaleString()} €`;
                return;
            }
            element.innerHTML = `${current.toLocaleString()} €`;
            requestAnimationFrame(animation);
        };
        requestAnimationFrame(animation);
    }

    async render() {
        this.footer.innerHTML = "";

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
                    <img src="${leftShip.image}">
                    <h2>${leftShip.nom}</h2>
                    <p class="price">${Number(leftShip.prix).toLocaleString()} €</p>
                </div>

                <div class="vs-container">
                    <h1>VS</h1>
                </div>

                <div class="ship-card mystery">
                    <img src="${rightShip.image}">
                    <h2>${rightShip.nom}</h2>
                    <p class="price">???</p>
                    <div class="guess-buttons">
                        <button class="guess-btn higher"><span class="material-symbols-rounded">trending_up</span>Plus cher</button>
                        <button class="guess-btn lower"><span class="material-symbols-rounded">trending_down</span>Moins cher</button>
                    </div>
                </div>
            </div>
            <div class="score-container">
                <div>Score: ${this.score}</div>
                <div>Meilleur score: ${this.getBestScore()}</div>
            </div>
        `;

        document.querySelector('.higher').addEventListener('click', () => {
            const leftPrice = Number(leftShip.prix);
            const rightPrice = Number(rightShip.prix);
            const isCorrect = leftPrice < rightPrice;
            if (isCorrect) {
                this.score++;
            } else {
                this.score = 0; 
            }
            this.showResult(isCorrect);
        });

        document.querySelector('.lower').addEventListener('click', () => {
            const leftPrice = Number(leftShip.prix);
            const rightPrice = Number(rightShip.prix);
            const isCorrect = leftPrice > rightPrice;
            if (isCorrect) {
                this.score++;
            } else {
                this.score = 0; 
            }
            this.showResult(isCorrect);
        });
    }
}

export const gameView = new GameView();