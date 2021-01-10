import './styles.css';
import debounce from 'lodash.debounce';
import apiService from './js/apiService';
import ImageCard from './templates/ImageCard.hbs';
import * as Toastr from 'toastr';
import '../node_modules/toastr/build/toastr.css';

const body = document.querySelector('body');
let page = 1;
const baseUrl = 'https://pixabay.com/';
const keyAPI = '19750325-769cba3e08dc3fabd5e207521';
let inputValue;
let markup;
let topPosition = 0;

body.insertAdjacentHTML(
  'beforeend',
  '<form class="search-form" id="search-form"><input type = "text" name = "query" autocomplete = "off" placeholder = "Search images..."/></form><ul class="gallery"></ul>',
);

const refs = {
  galleryContainer: body.querySelector('.gallery'),
  searchForm: body.querySelector('#search-form'),
};

function request() {
  return `api/?image_type=photo&orientation=horizontal&q=${inputValue}&page=${page}&per_page=12&key=${keyAPI}`;
}
refs.searchForm.addEventListener('input', debounce(inputSearch, 500));
function inputSearch(event) {
  event.preventDefault();
  page = 1;
  topPosition = 0;
  inputValue = refs.searchForm.elements.query.value;
  request();
  refs.galleryContainer.innerHTML = '';
  apiService(baseUrl + request()).then(updateImagesMarkup);
  return inputValue;
}

Toastr.options.timeout = 1000; //Change the settings

function updateImagesMarkup(images) {
  if (images.length === 0) {
    Toastr.error('по вашему запросу ничего не найдено');
  }
  markup = ImageCard(images);
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  window.scrollTo({
    left: 0,
    top: topPosition,
    behavior: 'smooth',
  });
}
body.insertAdjacentHTML(
  'beforeend',
  '<button class="button">Load more</button>',
);
const button = body.querySelector('.button');
button.addEventListener('click', pageValue);
function pageValue() {
  page += 1;
  apiService(baseUrl + request()).then(updateImagesMarkup);
  console.log(refs.galleryContainer.scrollHeight);
  console.log(button.offsetHeight);
  topPosition = refs.galleryContainer.scrollHeight + button.offsetHeight;
}
