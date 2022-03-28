const searcheParentEl = document.querySelector(".search");
const inputSearch = document.querySelector(".search__field");
const searchBtn = document.querySelector(".search__btn");
const headerResult = document.querySelector(".header-result");

const getData = async function (artistName) {
  const response =
    await fetchJsonp(`https://itunes.apple.com/search?term=${artistName}&media=music&entity=album&attribute=artistTerm&limit=200
  `);
  const ablumData = await response.json();
  return ablumData.results;
};

// getData("gaga");

function generateAblumCard(ablum) {
  return `<div class="result_card">
  <img
    src="${ablum.artworkUrl100}"
    alt="${ablum.collectionName}"
    class="result_card--img"
  />
  <p class="result-card--title">${ablum.collectionName}</p>
</div>`;
}

function generateCardsList(ablums) {
  return ablums.map((ablum) => generateAblumCard(ablum)).join("");
}

function renderAblumCards(movies) {
  const ablumContainer = document.querySelector(".search-result");
  const ele = ablumContainer;
  const tmp = generateCardsList(movies);
  render(ele, tmp);
}

function render(element, template) {
  element.insertAdjacentHTML("afterbegin", template);
}

function renderSpinner() {
  headerResult.innerHTML = "loading...";
}

async function loadSearchResult(query) {
  await getData(query).then((ablumData) => {
    ablums = ablumData;
    renderAblumCards(ablums);
    headerResult.innerHTML = `${ablumData.length} ablums found`;
    // console.log(ablums);
  });
}

searcheParentEl.addEventListener("submit", function (e) {
  e.preventDefault();
  const query = inputSearch.value;
  renderSpinner();
  if (!query) {
    headerResult.innerHTML = `Pleae enter artist's name`;
    return;
  }
  inputSearch.value = "";
  loadSearchResult(query);
});
