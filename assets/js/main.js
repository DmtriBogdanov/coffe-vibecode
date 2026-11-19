import { initNavigation } from './modules/navigation.js';
import { initMenuTabs } from './modules/menu-tabs.js';
import { initCustomizer } from './modules/customizer.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMenuTabs();
    initCustomizer();
});
