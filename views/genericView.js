export class GenericView {
    static previousHash = '';
    static previousParams = new URLSearchParams();

    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.app = document.getElementById('app');
            this.details = document.getElementById('details');
            this.footer = document.getElementById('footer');
        });
    }

    async handleRouting(hash, params) {
        GenericView.previousParams = params;
        GenericView.previousHash = hash
    }

    async render() {}

    async hide() {
        this.app.innerHTML = '';
        this.details.innerHTML = '';
        this.footer.innerHTML = '';
    }
}