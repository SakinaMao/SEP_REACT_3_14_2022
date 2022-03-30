"use strict";

const searcheParentEl = document.querySelector(".search");
const inputSearch = document.querySelector(".search__field");
const searchBtn = document.querySelector(".search__btn");
const headerResult = document.querySelector(".header-result");
const searchWarning = document.querySelector(".search-warning");

const search = {};
const state = {
  album: {},
  search: { query: "", results: [], resultsPerPage: 50, page: 1 },
};
const getData = async function (artistName) {
  const response =
    await fetchJsonp(`https://itunes.apple.com/search?term=${artistName}&media=music&entity=album&attribute=artistTerm&limit=200
  `);
  const albumData = await response.json();
  const album = await albumData.results;

  state.album = album.map((album) => {
    return {
      collectionId: album.collectionId,
      collectionName: album.collectionName,
      artistName: album.artistName,
      albumUrl: album.collectionViewUrl,
      albumCover: album.artworkUrl100,
      artistUrl: album.artistViewUrl,
    };
  });

  // return albumData.results;
};

function generatealbumCard(album) {
  return `<div class="result_card"><a href="${album.albumUrl}" target="_blank" class="result_card--link">
  <img
    src="${album.albumCover}"
    alt="${album.collectionName}"
    class="result_card--img"
  />
  <p class="result-card--title">${album.collectionName}</p></a>
</div>`;
}

function generateCardsList(albums) {
  return albums.map((album) => generatealbumCard(album)).join("");
}

function renderalbumCards(albums) {
  const albumContainer = document.querySelector(".search-result");
  const ele = albumContainer;
  const tmp = generateCardsList(albums);
  render(ele, tmp);
}

function render(element, template) {
  element.insertAdjacentHTML("afterbegin", template);
}

function renderSpinner() {
  headerResult.innerHTML = "loading";
  const markup = `<div class="spinner"></div>`;
  headerResult.innerHTML = "";
  headerResult.insertAdjacentHTML("afterbegin", markup);
}

async function loadSearchResult(query) {
  // await getData(query).then((albumData) => {
  //   albums = albumData;
  //   renderalbumCards(albums);
  //   headerResult.innerHTML = `Found ${query}'s ${albumData.length} albums`;

  //   renderPagination(albums);
  // });
  state.search.query = query;
  await getData(query);
  state.search.results = state.album.map((rec) => rec);
  // console.log(state.album, state.search);
  // console.log(albumData);
  renderalbumCards(state.album);
  headerResult.innerHTML = `Found ${query}'s ${state.album.length} albums`;
}

searcheParentEl.addEventListener("submit", function (e) {
  e.preventDefault();
  const query = inputSearch.value;
  renderSpinner();
  if (!query) {
    headerResult.innerHTML = `Pleae enter artist's name`;
    return;
  }
  loadSearchResult(query);

  inputSearch.value = "";
});
