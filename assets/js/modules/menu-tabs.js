export function initMenuTabs() {
    const menu = document.querySelector('[data-menu]');
    if (!menu) return;
    const tabList = menu.querySelector('[data-menu-tabs]');
    const tabs = [...menu.querySelectorAll('[data-menu-tab]')];
    const panels = [...menu.querySelectorAll('[data-menu-panel]')];
    if (!tabList || !tabs.length || tabs.length !== panels.length) return;

    function activateTab(selectedTab, moveFocus = false) {
        tabs.forEach((tab) => {
            const isSelected = tab === selectedTab;
            tab.setAttribute('aria-selected', String(isSelected));
            tab.tabIndex = isSelected ? 0 : -1;
            tab.classList.toggle('is-active', isSelected);
        });
        panels.forEach((panel) => {
            panel.hidden =
                panel.dataset.menuPanel !== selectedTab.dataset.menuTab;
        });
        if (moveFocus) selectedTab.focus();
    }

    tabList.setAttribute('role', 'tablist');
    tabList.setAttribute('aria-label', 'Категории меню напитков и еды');
    tabs.forEach((tab) => {
        const panel = panels.find(
            (item) => item.dataset.menuPanel === tab.dataset.menuTab,
        );
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        panel.tabIndex = 0;
        tab.addEventListener('click', () => activateTab(tab));
        tab.addEventListener('keydown', (event) => {
            const currentIndex = tabs.indexOf(tab);
            let nextIndex;
            if (event.key === 'ArrowRight')
                nextIndex = (currentIndex + 1) % tabs.length;
            if (event.key === 'ArrowLeft')
                nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            if (event.key === 'Home') nextIndex = 0;
            if (event.key === 'End') nextIndex = tabs.length - 1;
            if (nextIndex === undefined) return;
            event.preventDefault();
            activateTab(tabs[nextIndex], true);
        });
    });
    activateTab(tabs[0]);
    tabList.hidden = false;
}
