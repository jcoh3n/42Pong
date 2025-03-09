import axios from 'axios';

export async function get42UserData(accessToken: string) {
  try {
    const response = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching 42 user data:', error);
    throw error;
  }
} 