import axios from 'axios';
import { cleanAndValidate } from '../helpers.js';

export async function downloadLogo(domain) {
  const clearbitUrl = `https://logo.clearbit.com/${domain}`;

  try {
    const response = await axios.get(clearbitUrl, {
      responseType: 'arraybuffer'
    });

    return Promise.resolve(response?.data);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}
