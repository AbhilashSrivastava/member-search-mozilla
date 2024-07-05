
import { writable } from 'svelte/store';

const config = writable({
  isSidebarVisible: false,
  isZoomPanEnabled: false,
})



export default config