
import { writable } from 'svelte/store';

const shortlist = writable({
  members: [],
  imageDataURLs: [],
  count: 0
})

export default shortlist