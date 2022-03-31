"use strict";

const searcheParentEl = document.querySelector(".search");
const inputSearch = document.querySelector(".search__field");
const searchBtn = document.querySelector(".search__btn");
const headerResult = document.querySelector(".header-result");
const searchWarning = document.querySelector(".search-warning");

const search = {};
const state = {
  album: {},
  search: { query: "", results: [], resultsPerPage: 20, page: 1 },
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
  // renderalbumCards(state.album);

  state.search.results = state.album.map((rec) => rec);
  // console.log(state.album, state.search);
  // console.log(albumData);
}

//pagination

function generatePaginationResult(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
}

function generatePaginationMarup() {
  const currentPage = state.search.page;
  const numPages = Math.ceil(
    state.search.results.length / state.search.resultsPerPage
  );
  console.log(currentPage, numPages);

  //page 1 , and there are other pages
  if (currentPage === 1 && numPages > 1) {
    return `
    <button data-goto="${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${currentPage + 1}</span>   
    </button>`;
  }

  //last page
  if (currentPage === numPages && numPages > 1) {
    return `
    <button data-goto="${
      currentPage - 1
    }" class="btn--inline pagination__btn--prev">      
      <span>Page ${currentPage - 1}</span>
    </button>`;
  }
  //other page
  if (currentPage < numPages) {
    return `
    <button data-goto="${
      currentPage - 1
    }" class="btn--inline pagination__btn--prev">     
      <span>Page ${currentPage - 1}</span>
    </button>
    <button data-goto="${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${currentPage + 1}</span>    
  </button>`;
  }

  //page 1 , and NO there are other pages
}

function renderPatination() {
  const paginationContainer = document.querySelector(".pagination");
  const ele = paginationContainer;
  const tmp = generatePaginationMarup();
  render(ele, tmp);
}

function controlPagination(gotoPage) {
  const paginationResults = generatePaginationResult(gotoPage);
  console.log(paginationResults);
  renderalbumCards(paginationResults);
  renderPatination();
}

function controlPaginationGoto() {
  const paginationContainer = document.querySelector(".pagination");

  paginationContainer.addEventListener("click", function (e) {
    const gotoButton = e.target.closest(".btn--inline");
    if (!gotoButton) {
      return;
    }
    paginationContainer.innerHTML = "";
    const albumContainer = document.querySelector(".search-result");
    albumContainer.innerHTML = "";
    // console.log(gotoButton);
    const gotoPage = +gotoButton.dataset.goto;
    controlPagination(gotoPage);
  });
}

searcheParentEl.addEventListener("submit", async function (e) {
  e.preventDefault();
  const query = inputSearch.value;
  renderSpinner();
  if (!query) {
    headerResult.innerHTML = `Pleae enter artist's name`;
    return;
  }
  await loadSearchResult(query);
  headerResult.innerHTML = `Found ${query}'s ${state.album.length} albums`;
  const paginationContainer = document.querySelector(".pagination");
  state.search.page = 1;
  paginationContainer.innerHTML = "";
  const paginationResults = generatePaginationResult();
  renderalbumCards(paginationResults);
  renderPatination();
  controlPaginationGoto();
  inputSearch.value = "";
});
