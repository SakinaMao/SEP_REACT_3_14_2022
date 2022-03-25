const carouselContainer = document.querySelector(".movie_container");

const btnLeft = document.querySelector(".btn--left");
const btnRight = document.querySelector(".btn--right");
const slider = document.querySelector(".movie_container");

// const getMovieData = async function () {
//   try {
//     const fetchMovie = await fetch("http://localhost:3000/movies");
//     const movieData = await fetchMovie.json();

//     console.log(movieData);

//     return movieData;
//   } catch (err) {
//     console.log(err);
//   }
// };

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
          <p class="carousel_card--title">${movie.name}</p>
          <p class="carousel_card--info">
           ${movie.outlineInfo}
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
  console.log(slides);
  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
  let curSlide = 0;
  const maxSlide = slides.length;

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
  };
  const preSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
  };

  const init = function () {
    goToSlide(0);
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
