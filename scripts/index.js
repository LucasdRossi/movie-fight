const getData = async queryParams => {
  const { data } = await axios.get("http://www.omdbapi.com/", {
    params: {
      ...queryParams,
      apikey: "a96f05c2"
    }
  });
  if (data.Response === "True") {
    return data;
  }
  return false;
};

const movieTemplate = movie => {
  const boxOffice = parseInt(
    movie.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metaScore = parseInt(movie.Metascore);
  const imdbRating = parseFloat(movie.imdbRating);
  const imdbVotes = parseInt(movie.imdbVotes.replace(/,/g, ""));
  const awards = movie.Awards.split(" ").reduce(
    (total, curr) => (parseInt(curr) ? parseInt(curr) + total : total),
    0
  );

  return `
    <div class="movie-header">
      <img src="${movie.Poster === "N/A" ? "" : movie.Poster}" />
      <div class="movie-header-text">
        <h3>${movie.Title} (${movie.Year})</h3>
        <h4>${movie.Genre}</h4>
        <p>${movie.Plot !== "N/A" ? movie.Plot : ""}</p>
      </div>
    </div>
    <div class="movie-stats">
      <div data-value=${awards} class="movie-card">
        <div>
          <h4>Awards</h4>
        </div>
        <p>${movie.Awards !== "N/A" ? movie.Awards : "None"}</p>
      </div>
      <div data-value=${boxOffice} class="movie-card">
        <div>
          <h4>Box Office</h4>
        </div>
        <p>${movie.BoxOffice !== "N/A" ? movie.BoxOffice : "None"}</p>
      </div>
      <div data-value=${metaScore} class="movie-card">
        <div>  
          <h4>Metascore</h4>
        </div>
        <p>${movie.Metascore !== "N/A" ? movie.Metascore : "None"}</p>
      </div>
      <div data-value=${imdbRating} class="movie-card">
        <div>
          <h4>Imbd Rating</h4>
        </div>
        <p>${movie.imdbRating !== "N/A" ? movie.imdbRating : "None"}</p>
      </div>
      <div data-value=${imdbVotes} class="movie-card">
        <div>
          <h4>Imbd Votes</h4>
        </div>
        <p>${movie.imdbVotes !== "N/A" ? movie.imdbVotes : "None"}</p>
      </div>
    </div>
  `;
};

class autoCompleteConfig {
  constructor(root) {
    this.root = root;
    this.wins = 0;
  }
  renderItem = movie => {
    return `
          <img class="drop-img" src="${
            movie.Poster === "N/A" ? "" : movie.Poster
          }"/>
          <p class="drop-text">${movie.Title} (${movie.Year})</p>
          `;
  };
  fetchData = async movie => {
    const response = await getData({ s: movie });
    return response.Search;
  };
  onItemSelect = async movie => {
    const movieDetails = await getData({ i: movie.imdbID });
    const tutorial = document.querySelector("#tutorial-wrapper");
    tutorial.innerHTML = "<img src='images/VS.png' />";
    this.movie = this.root.querySelector(".movie");
    this.movie.innerHTML = movieTemplate(movieDetails);

    runComparision();
  };
  putStar = element => {
    const star = document.createElement("i");
    const div = element.querySelector("div");
    star.setAttribute("class", "fas fa-star star");
    div.appendChild(star);
  };
  removeStar = element => {
    const div = element.querySelector("div");
    const star = div.querySelector("i");
    if (star) div.removeChild(star);
  };
  makeConfig = () => {
    const { root, renderItem, fetchData, onItemSelect } = this;
    return {
      root,
      renderItem,
      fetchData,
      onItemSelect
    };
  };
}

const left = new autoCompleteConfig(document.querySelector("#left"));
const right = new autoCompleteConfig(document.querySelector("#right"));

createAutoComplete(left.makeConfig());
createAutoComplete(right.makeConfig());

const runComparision = () => {
  if (left.movie && right.movie) {
    leftMovies = left.movie.querySelectorAll(".movie-card");
    rightMovies = right.movie.querySelectorAll(".movie-card");

    leftMovies.forEach((leftMovie, index) => {
      let rightMovie = rightMovies[index];
      left.removeStar(leftMovie);
      right.removeStar(rightMovie);

      let leftValue = parseFloat(leftMovie.dataset.value);
      let rightValue = parseFloat(rightMovie.dataset.value);

      if (leftValue > rightValue) {
        left.putStar(leftMovie);
        left.wins += 1;
      } else {
        right.putStar(rightMovie);
        right.wins += 1;
      }
    });

    // if (left.wins > right.wins) {
    //   left.putMedal();
    // } else if (left.wins < right.wins) {
    //   right.putMedal();
    // }
  }
};
