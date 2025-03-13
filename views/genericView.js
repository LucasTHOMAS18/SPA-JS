export class GenericView {
    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.app = document.getElementById('app');
            this.details = document.getElementById('details');
            this.footer = document.getElementById('footer');
        });
    }

    async handleRouting(hash, params) {this.render();}

    async render() {}

    async hide() {
        this.app.innerHTML = '';
        this.details.innerHTML = '';
        this.footer.innerHTML = '';
    }
}