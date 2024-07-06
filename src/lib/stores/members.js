
import { writable } from 'svelte/store';

/**
 * Represents a writable store for managing members data.
 *
 * @typedef {Object} Members
 * @property {Array} allMembers - An array of all members.
 * @property {Array} filteredMembers - An array of filtered members based on user search. If search is empty,
 * filtered members array will be same as user array
 * @property {Array} usersImageData - An array of objects which has two keys, user(userID) and image(base64 downloaded version of image)
 * We need this because the urls provided by the api are crossOrigin and can't be converted to data url for export feature
 */
const members = writable({
  allMembers: [],
  filteredMembers: [],
  usersImageData: []
});

export default members