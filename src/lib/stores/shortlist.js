
import { writable } from 'svelte/store';

/**
 * Represents a writable store for managing shortlisted members' data
 *
 * @typedef {Object} Shortlist
 * @property {Array} members - An array of ids of all shortlisted members
 * @property {Array} imageDataURLs - An array of converted dataUrls from the canvas to display to user as Image
 * @property {number} count - The count of current shortlisted members
 */
const shortlist = writable({
  members: [],
  imageDataURLs: [],
  count: 0
})

export default shortlist