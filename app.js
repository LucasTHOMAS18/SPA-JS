import { loadDetail } from './views/detailView.js';
import { loadListing } from './views/listingView.js';

export function router(view, id = null) {
    if (view === 'listing') loadListing();
    if (view === 'detail' && id) loadDetail(id);
}

router('listing');
