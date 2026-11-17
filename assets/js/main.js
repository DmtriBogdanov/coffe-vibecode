import { initNavigation } from './modules/navigation.js';
import { initMenuTabs } from './modules/menu-tabs.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMenuTabs();
});
