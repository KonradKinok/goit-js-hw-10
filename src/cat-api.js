'use strict';
//Import
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const optionsNotify = {
  timeout: 6000,
};

//ApiKey
const apiKey =
  'live_CxkNmiyyb6IlYY7a06bc6CPiONxdV78sZd9uarhcRkpu9pj6qYequ5IHvIxpkRWC';

//Axios header - api key
axios.defaults.headers.common['x-api-key'] = apiKey;

//Functions
/**fetchBreeds
 *
 * @returns object
 */
export async function fetchBreeds() {
  try {
    const allDataCats = await getAllBreedsCats();
    const arrNameOfCats = addCatsToTable(allDataCats);
    const arrCombobox = [{ text: '', placeholder: true }, ...arrNameOfCats];
    return arrCombobox;
  } catch (error) {
    Notify.failure(`${error}`, optionsNotify);
  }
}

/**getAllBreedsCats
 *
 * @returns object
 */
async function getAllBreedsCats() {
  const response = await axios.get(`https://api.thecatapi.com/v1/breeds`);
  return response.data;
}

/**fetchCatByBreed
 *
 * @param {string} breedId
 * @returns object
 */
export async function fetchCatByBreed(breedId) {
  const searchParams = new URLSearchParams({
    breed_ids: breedId,
  });
  const url = `https://api.thecatapi.com/v1/images/search?${searchParams}`;
  const response = await axios.get(url);
  return response.data;
}

/**addCatsToTable
 *
 * @param {object} cats
 * @returns object
 */
function addCatsToTable(cats) {
  const arr = cats.map(({ id, name }) => {
    return { text: `${name}`, value: `${id}` };
  });
  return arr;
}
