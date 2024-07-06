import axios from 'axios';
const API_URL = 'https://api.github.com/orgs/mozilla/members?page=1' // Currently we have written it here, we will move it to env.


/**
 * Fetches members from the API and converts their image data.
 * @returns {Promise} An object containing the fetched users and their converted image data.
 */
export const fetchMembers = async () => {
  try {
    const response = await axios.get(API_URL);
    const usersImageData = await convertImageData(response.data)
    return {
      users: response.data,
      usersImageData,
    }
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
};

/**
 * Fetches an image from the given URL and returns it as a base64 encoded string.
 * @param {string} url - The URL of the image to fetch.
 * @returns {Promise} A promise that resolves with the base64 encoded image string.
 */
async function fetchImageAsBase64(url) {
  try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
      });
  } catch (error) {
      console.error('Error fetching image:', error);
  }
}

/**
 * Converts user avatar images to base64 format.
 * WHY?? Well, since the images are crossOrigin, we can export them. Hence we need to render
 * it on the canvas using this base64 string data, which will enable us to use toDataURL eventually.
 */
export const convertImageData = async (users) => {
  try {
    const imagesToUserMap = users.map(async (user) => {
      return {
        user: user.id,
        image: await fetchImageAsBase64(user.avatar_url)
      }
    })
    
    const response = await Promise.all(imagesToUserMap)
    return response
  } catch(error) {
    return []
  }
}