const searcheParentEl = document.querySelector(".search");
const inputSearch = document.querySelector(".search__field");
const searchBtn = document.querySelector(".search__btn");
const headerResult = document.querySelector(".header-result");
const searchWarning = document.querySelector(".search-warning");

const getData = async function (artistName) {
  const response =
    await fetchJsonp(`https://itunes.apple.com/search?term=${artistName}&media=music&entity=album&attribute=artistTerm&limit=200
  `);
  const albumData = await response.json();
  return albumData.results;
};

// getData("gaga");

function generatealbumCard(album) {
  return `<div class="result_card">
  <img
    src="${album.artworkUrl100}"
    alt="${album.collectionName}"
    class="result_card--img"
  />
  <p class="result-card--title">${album.collectionName}</p>
</div>`;
}

function generateCardsList(albums) {
  return albums.map((album) => generatealbumCard(album)).join("");
}

function renderalbumCards(movies) {
  const albumContainer = document.querySelector(".search-result");
  const ele = albumContainer;
  const tmp = generateCardsList(movies);
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
  await getData(query).then((albumData) => {
    albums = albumData;
    renderalbumCards(albums);
    headerResult.innerHTML = `Found ${query}'s ${albumData.length} albums`;
    console.log(albums);
  });
}

//handle scorllbar
window.addEventListener("scroll", this.handleScroll, true);
handleScroll = (e) => {
  if (e.target.classList.contains("on-scrollbar") === false) {
    e.target.classList.add("on-scrollbar");
  }
};

searcheParentEl.addEventListener("submit", function (e) {
  e.preventDefault();
  const query = inputSearch.value;
  renderSpinner();
  if (!query) {
    headerResult.innerHTML = `Pleae enter artist's name`;
    // searchWarning.classList.remove("hidden");
    return;
  }

  loadSearchResult(query);
  //   headerResult.classList.remove("spinner");
  inputSearch.value = "";
});
