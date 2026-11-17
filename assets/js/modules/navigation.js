export function initNavigation() {
    const header = document.querySelector('[data-site-header]');
    const toggle = document.querySelector('[data-navigation-toggle]');
    const navigation = document.querySelector('[data-navigation]');
    const label = document.querySelector('[data-navigation-label]');
    if (!header || !toggle || !navigation || !label) return;

    const mobileQuery = window.matchMedia('(max-width: 1100px)');

    function setOpen(isOpen, returnFocus = false) {
        toggle.setAttribute('aria-expanded', String(isOpen));
        label.textContent = isOpen
            ? 'Закрыть меню сайта'
            : 'Открыть меню сайта';
        header.classList.toggle('is-open', isOpen);
        navigation.hidden = mobileQuery.matches && !isOpen;
        if (returnFocus) toggle.focus();
    }

    function syncViewport() {
        const wasInside = navigation.contains(document.activeElement);
        toggle.hidden = !mobileQuery.matches;
        setOpen(false, mobileQuery.matches && wasInside);
    }

    toggle.addEventListener('click', () => {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    navigation.addEventListener('click', (event) => {
        if (!mobileQuery.matches || !event.target.closest('a')) return;
        const destination = document.querySelector(
            event.target.closest('a').hash,
        );
        setOpen(false);
        if (destination) {
            destination.setAttribute('tabindex', '-1');
            destination.focus({ preventScroll: true });
        }
    });
    document.addEventListener('keydown', (event) => {
        if (
            event.key === 'Escape' &&
            toggle.getAttribute('aria-expanded') === 'true'
        ) {
            setOpen(false, true);
        }
    });
    document.addEventListener('click', (event) => {
        if (mobileQuery.matches && !header.contains(event.target))
            setOpen(false);
    });
    mobileQuery.addEventListener('change', syncViewport);
    syncViewport();
}
