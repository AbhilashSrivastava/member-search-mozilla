
import { writable } from 'svelte/store';

const members = writable({
  allMembers: [],
  filteredMembers: [],
  usersImageData: []
})

export default members