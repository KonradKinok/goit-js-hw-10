'use strict';
//Import
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import * as catsMethod from './cat-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const optionsNotify = {
  timeout: 6000,
};

const comboboxTag = document.querySelector('select#combobox');
const loaderTag = document.querySelector('p.loader');
const errorTag = document.querySelector('p.error');
const catInfoTag = document.querySelector('div.cat-info');
const combobox = null;

//combobox setting
const settingSlimSelect = {
  openPosition: 'auto', // 'auto', 'up' or 'down'
  placeholderText: 'Choose a cat breed',
  allowDeselect: true,
  disabled: false,
  selected: true,
  showSearch: false,
  showOptionTooltips: true,
  hideSelected: false,
};

getPromiseCats(combobox);

/**getPromiseCats
 *
 * @param {object} combobox
 */
function getPromiseCats(combobox) {
  addClass(comboboxTag);
  addClass(errorTag);

  catsMethod
    .fetchBreeds()
    .then(catsBreeds => {
      removeClass(comboboxTag);
      //Add combobox
      combobox = new SlimSelect({
        select: '#combobox',
        settings: {
          ...settingSlimSelect,
        },
        events: {
          error: function (err) {
            console.error(err);
          },
          afterChange: newVal => {
            catInfoTag.innerHTML = null;
            const selectedCat = newVal[0].value;
            getPromiseCat(selectedCat);
          },
        },
      });
      addClass(loaderTag);
      combobox.setData(catsBreeds);
    })
    .catch(error => {
      Notify.failure(`${error}`, optionsNotify);
      addClass(loaderTag);
      removeClass(errorTag);
    });
}

/**getPromiseCat
 *
 * @param {string} selectedCat
 */
function getPromiseCat(selectedCat) {
  if (selectedCat && selectedCat.trim() !== '') {
    removeClass(loaderTag);

    catsMethod
      .fetchCatByBreed(selectedCat)
      .then(dataCat => {
        if (dataCat.length > 0) {
          renderCat(dataCat);
        } else {
          Notify.failure(`No data. Try another cat.`, optionsNotify);
        }
      })
      .catch(error => {
        Notify.failure(`${error}`, optionsNotify);
        removeClass(errorTag);
      });
    addClass(loaderTag);
  }
}

/**renderCat
 *
 * @param {object} dataCat
 */
function renderCat(dataCat) {
  const markup = dataCat.map(({ breeds, url }) => {
    const { name, description, temperament } = breeds[0];
    return ` <div class="image-container">
      <img src="${url}" alt="${name}" />
    </div>
    <div class="text-container">
      <h2 class="heading-text">${name}
      </h2>
      <p class="text-description">${description}</p>
      <p class="text-temperament"><span class="span-text">Temperament: </span>${temperament}</p>
    </div>`;
  });

  catInfoTag.insertAdjacentHTML('beforeend', markup);
}

/**addClass default: hidden
 *
 * @param {object} nameTag
 * @param {string} className
 */
function addClass(nameTag, className = 'hidden') {
  if (!nameTag.classList.contains(className)) {
    nameTag.classList.add(className);
  }
}

/**removeClass default: hidden
 *
 * @param {object} nameTag
 * @param {string} className
 */
function removeClass(nameTag, className = 'hidden') {
  if (nameTag.classList.contains(className)) {
    nameTag.classList.remove(className);
  }
}
