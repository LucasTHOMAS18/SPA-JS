import { GenericView } from './genericView.js';

class NotFoundView extends GenericView {
  constructor() {
    super();
  }

  async render() {
    this.footer.innerHTML = '';
    this.details.innerHTML = '';

    this.app.innerHTML = `
      <h1>404</h1>
      <p>La page demandée n'existe pas.</p>
    `;
  }
}

export const notFoundView = new NotFoundView();
