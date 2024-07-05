import axios from 'axios';
const API_URL = 'https://api.github.com/orgs/mozilla/members?page=1'

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