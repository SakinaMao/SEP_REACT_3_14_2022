const carouselContainer = document.querySelector(".movie_container");

const btnLeft = document.querySelector(".btn--left");
const btnRight = document.querySelector(".btn--right");
const slider = document.querySelector(".movie_container");

function getMovies() {
  return fetch("http://localhost:3000/movies").then((response) =>
    response.json()
  );
}

function genernateCarouselCard(movie) {
  return `<div class="movie_carousel_card slide--${movie.id}">
          <img
            src="${movie.imgUrl}" class="carousel_card--image"
          />
          <p class="carousel_card--title">Movie: ${movie.name}</p>
          <p class="carousel_card--info">
           Info: ${movie.outlineInfo}
          </p>
        </div>`;
}

function generateCardsList(movies) {
  return movies.map((movie) => genernateCarouselCard(movie)).join("");
}

function renderCarouselCards(movies) {
  const ele = carouselContainer;
  const tmp = generateCardsList(movies);
  render(ele, tmp);
}

function render(element, template) {
  element.insertAdjacentHTML("afterbegin", template);
}

function renderCarouselSlide() {
  const slides = document.querySelectorAll(".movie_carousel_card");

  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
  let curSlide = 0;
  const maxSlide = slides.length;

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 4) {
      btnRight.classList.add("hidden");
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    curSlide === maxSlide - 4 ? btnRight.classList.add("hidden") : curSlide;
    btnLeft.classList.remove("hidden");
  };

  const preSlide = function () {
    if (curSlide === 0) {
      btnLeft.classList.add("hidden");
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    curSlide === 0 ? btnLeft.classList.add("hidden") : curSlide;
    btnRight.classList.remove("hidden");
  };

  const init = function () {
    goToSlide(0);
    if (curSlide === 0) btnLeft.classList.add("hidden");
  };
  init();

  btnRight.addEventListener("click", nextSlide);

  btnLeft.addEventListener("click", preSlide);
  document.addEventListener("keydown", function (e) {
    e.key === "ArrowRight" && nextSlide();
    e.key === "ArrowLeft" && preSlide();
  });
}

getMovies().then((moviesData) => {
  movies = moviesData;
  renderCarouselCards(movies);
  renderCarouselSlide();
});
