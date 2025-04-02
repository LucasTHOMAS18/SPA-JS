export function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]:not(.observed)');
  
    images.forEach(img => {
        img.classList.add('observed');
        lazyObserver.observe(img);
    });
}

const lazyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
});

const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.matches && node.matches('img[data-src]:not(.observed)')) {
                    node.classList.add('observed');
                    lazyObserver.observe(node);
                } else {
                    node.querySelectorAll && node.querySelectorAll('img[data-src]:not(.observed)').forEach(img => {
                        img.classList.add('observed');
                        lazyObserver.observe(img);
                    });
                }
            }
        });
    });
});

mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
});
