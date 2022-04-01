"use strict";

const searcheParentEl = document.querySelector(".search");
const inputSearch = document.querySelector(".search__field");
const searchBtn = document.querySelector(".search__btn");
const headerResult = document.querySelector(".header-result");
const searchWarning = document.querySelector(".search-warning");
const albumContainer = document.querySelector(".search-result");
const paginationTitleContainer = document.querySelector(".pagination--title");
const resultsPerPage = document.querySelector(".results-per-page-wrapper");
const paginationContainer = document.querySelector(".pagination");

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
  const ele = albumContainer;
  const tmp = generateCardsList(albums);
  render(ele, tmp);
}

function render(element, template) {
  // element.insertAdjacentHTML("afterbegin", template);
  element.innerHTML = template;
}

function generatePaginationTitle(start, results) {
  return `<p>view ${start} to ${start + results.length} of ${
    state.search.results.length
  } results</p>  `;
}

function generateResultsPerPage(numberOfResults) {
  return `<p>view <button class="btn-results-per-page btn-20">20</button> <button class="btn-results-per-page btn-50">50</button>  albums per page </p>  `;
}

function renderResultsPerPage(numberOfResults) {
  const ele = resultsPerPage;
  const tmp = generateResultsPerPage(numberOfResults);

  render(ele, tmp);
}

function controlResultPerPage() {
  const numberOfResultsEl = document.querySelector(".results-per-page-wrapper");
  numberOfResultsEl.addEventListener("click", function (e) {
    const numberOfResultsBtn = e.target.closest(".btn-results-per-page");
    if (!numberOfResultsBtn) return;
    if (numberOfResultsBtn.classList.contains("btn-20")) {
      state.search.resultsPerPage = 20;
      renderNewResult();
    }
    if (numberOfResultsBtn.classList.contains("btn-50")) {
      state.search.resultsPerPage = 50;
      renderNewResult();
    }
  });
}

function renderPagiTitle(start, results) {
  const ele = paginationTitleContainer;
  const tmp = generatePaginationTitle(start, results);
  render(ele, tmp);
}
function renderSpinner() {
  headerResult.innerHTML = "loading";
  const markup = `<div class="spinner"></div>`;
  headerResult.innerHTML = "";
  headerResult.insertAdjacentHTML("afterbegin", markup);
}

async function loadSearchResult(query) {
  state.search.query = query;
  await getData(query);

  state.search.results = state.album.map((rec) => rec);
}

//pagination

function generatePaginationResult(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  const results = state.search.results.slice(start, end);
  renderPagiTitle(start, results);
  return results;
}

function generatePaginationMarup() {
  const currentPage = state.search.page;
  const numPages = Math.ceil(
    state.search.results.length / state.search.resultsPerPage
  );

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

function clearPreviousResult() {
  paginationTitleContainer.innerHTML = "";
  paginationContainer.innerHTML = "";
  albumContainer.innerHTML = "";
}

function renderPagination() {
  const paginationContainer = document.querySelector(".pagination");
  const ele = paginationContainer;
  const tmp = generatePaginationMarup();
  render(ele, tmp);
}

function controlPagination(gotoPage) {
  const paginationResults = generatePaginationResult(gotoPage);

  renderalbumCards(paginationResults);

  renderPagination();
}

function controlPaginationGoto() {
  paginationContainer.addEventListener("click", function (e) {
    const gotoButton = e.target.closest(".btn--inline");
    if (!gotoButton) {
      return;
    }

    const albumContainer = document.querySelector(".search-result");
    // clearPreviousResult();

    const gotoPage = +gotoButton.dataset.goto;
    controlPagination(gotoPage);
  });
}

function renderNewResult() {
  state.search.page = 1;
  const paginationResults = generatePaginationResult();

  renderalbumCards(paginationResults);
  renderPagination();
  controlPaginationGoto();
  renderResultsPerPage(state.search.resultsPerPage);
  controlResultPerPage();
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
  renderNewResult();
  inputSearch.value = "";
});
