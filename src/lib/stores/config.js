import { writable } from 'svelte/store';


/**
 * Represents the configuration object for the application.
 *
 * @typedef {Object} Config
 * @property {boolean} isSidebarVisible - Indicates whether the sidebar is visible or not(depends on user selection)
 * @property {boolean} isZoomPanEnabled - Indicates whether zoom and pan functionality is enabled or not(depends on user selection)
 */
const config = writable({
  isSidebarVisible: false,
  isZoomPanEnabled: false,
});

export default config
