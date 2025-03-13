export class GenericView {
    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.app = document.getElementById('app');
            this.details = document.getElementById('details');
            this.footer = document.getElementById('footer');
        });
    }

    handleRouting(hash, params) {}

    render() {}
}