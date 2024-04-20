'use strict';
//Import
import axios from 'axios';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
//Notify
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const optionsNotify = {
  timeout: 6000,
};

export const apiKey =
  'live_CxkNmiyyb6IlYY7a06bc6CPiONxdV78sZd9uarhcRkpu9pj6qYequ5IHvIxpkRWC';
// axios.defaults.headers.common['x-api-key'] = apiKey;

//tablica danych combobox
let comboboxData = [];
const combobox = new SlimSelect({
  select: '#combobox',
  settings: {
    openPosition: 'auto', // 'auto', 'up' or 'down'
    placeholderText: 'No data1',
    allowDeselect: true,
    disabled: false,
    selected: true,
    showSearch: false,
    showOptionTooltips: true,
    hideSelected: false,
  },
});
// function fetchBreeds() {}
fetchBreeds();
async function fetchBreeds() {
  try {
    const allDataCats = await getAllDataCats();
    const arrNameOfCats = addCatsToTable(allDataCats);
    const comboboxData = [{ text: '', placeholder: true }, ...arrNameOfCats];
    // comboboxData.forEach(element => {
    //   console.log(element.text);
    // });
  } catch (error) {
    Notify.failure(`${error}`, optionsNotify);
    console.log(error);
  }
}

async function getAllDataCats() {
  const params = new URLSearchParams({
    // _limit: perPage_s1a4,
    // _page: page_s1a4,
  });

  const response = await axios.get(`https://api.thecatapi.com/v1/breeds`);
  return response.data;
}

/**
 *
 * @param {*} cats
 * @returns Array
 */
function addCatsToTable(cats) {
  const tempTable = cats.map(({ id, name }) => {
    return { text: `${name}`, value: `${id}` };
  });

  return tempTable;
}

// data.push({ text: '', placeholder: true });
// comboboxData.push({ text: 'Option 4', value: 'option4' });
// comboboxData.push({ text: 'Option 14', value: 'option14' });
