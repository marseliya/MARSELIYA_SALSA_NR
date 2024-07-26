document.addEventListener("DOMContentLoaded", () => {
  loadData();
});


function loadData() {
  const dataaa = localStorage.getItem("pilih");
  // mengambil data dari local storage, lalu memeriksa apakah movie, series atau artis
  // awalnya movie dan series di gabung, tetapi karna cast dan trailernya ternyata berbeda jadi dipisah
  if (dataaa === "movie") {
    clearMain();
    loadFilmData();
  } else if (dataaa === "artis") {
    clearMain();
    loadArtisData();
  }
  else if ( dataaa === 'series'){
    clearMain()
    loadSeriesData()
  }
}


function loadFilmData() {
  const filmData = JSON.parse(localStorage.getItem("selectedMovie"));
  if (filmData) {
    cardFilm(filmData);
    console.log(filmData);
  } else {
    console.log("No film data found in localStorage");
  }
}

function loadArtisData() {
  const artisData = JSON.parse(localStorage.getItem("selectedPerson"));
  if (artisData) {
    cardArtis(artisData);
    console.log(artisData);
  } else {
    console.log("No artist data found in localStorage");
  }
}

function loadSeriesData(){
  const filmData = JSON.parse(localStorage.getItem("selectedMovie"));
  if (filmData) {
    cardSeries(filmData);
    console.log(filmData);
  } else {
    console.log("No film data found in localStorage");
  }
} 

// film dan series sama2 'selected Movie' karna perbedaannya terletak pada key 'pilih' di localstorage

function clearMain() {
  const main = document.querySelector(".main");
  while (main.firstChild) {
    // selama main masih berisi seuatu, akan terus di remove
    main.removeChild(main.firstChild);
  }
}

function cardFilm(data) {
  const main = document.querySelector(".main");
  const figure = document.createElement("figure");
  const figcaption = document.createElement("figcaption");

  const img = document.createElement("img");
  img.setAttribute("src", `https://image.tmdb.org/t/p/w500${data.poster_path}`);

  const h1 = document.createElement("h1");
  h1.textContent = `Title: ${data.original_title || data.original_name}`;

  const h2 = document.createElement("h2");
  h2.textContent = `Original Language: ${data.original_language}`;

  const h3 = document.createElement("h3");
  h3.textContent = `Release Date: ${data.release_date || data.first_air_date}`;

  const h4 = document.createElement("h4");
  h4.textContent = `Overview: ${data.overview}`;

  const h5 = document.createElement("h5");
  h5.textContent = `Popularity: ${data.popularity}`;

  const h6 = document.createElement("h6");
  h6.textContent = `Vote Count: ${data.vote_count}`;

  const castListContainer = document.createElement("div");
  castListContainer.className = "castContainer";

  const h7 = document.createElement("h7");
  h7.textContent = "Watch Trailer";
  h7.className = "trailer";

  const trailerContainer = document.createElement("div");
  trailerContainer.className = "trailerContainer";

  const h8 = document.createElement("h8");
  h8.textContent = "Similiar";
  h8.className = "trailer";

  const similarMoviesContainer = document.createElement("div");
  similarMoviesContainer.className = "similarMoviesContainer";


  const apiKey = "8fa6e9d2c43306860f86299f63eaf5b0";
  let url;
  // mendeklarasi variabel kosong untuk kemudian di isi


  // FETCH CAST

  // untuk memastikan yang ditekan itu movie atau series
  if (data.release_date) {
    url = `https://api.themoviedb.org/3/movie/${data.id}/credits?api_key=${apiKey}`;
  } else if (data.first_air_date) {
    url = `https://api.themoviedb.org/3/tv/${data.id}/credits?api_key=${apiKey}`;
  }

  // lalu di fetch untuk mendapatkan list cast nya
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const cast = data.cast;
      const castList = document.createElement("ul");
      castList.className = "castList";

      cast.forEach((member) => {

        const listItem = document.createElement("li");
        listItem.className = "listItem";

        const memberImg = document.createElement("img");
        memberImg.className = "castImg";

        memberImg.setAttribute(
          "src",
          `https://image.tmdb.org/t/p/w500${member.profile_path}`
        );

        const memberText = document.createTextNode(
          `${member.name} as ${member.character}`
        );

        listItem.appendChild(memberImg);
        listItem.appendChild(memberText);
        castList.appendChild(listItem);
      });
      castListContainer.appendChild(castList);
    })
    .catch((error) => console.error("Error fetching cast:", error));


  // FETCH TRAILER

  const trailerUrl = `https://api.themoviedb.org/3/movie/${data.id}/videos?api_key=${apiKey}&language=en-US`;
  fetch(trailerUrl)
    .then((response) => response.json())
    .then((response) => {
      const trailers = response.results.filter(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailers.length > 0) {
        const trailer = trailers[0];
        const iframe = document.createElement("iframe");
        iframe.className = "iframe";
        iframe.setAttribute(
          "src",
          `https://www.youtube.com/embed/${trailer.key}`
        );
        iframe.setAttribute("allow", "picture-in-picture");
        iframe.setAttribute("allowfullscreen", true);
        trailerContainer.appendChild(iframe);
      } else {
        console.log("Trailer not found");
      }
    })
    .catch((error) => console.error("Error fetching trailer:", error));


// FETCH SIMILAR MOVIES

const similarUrl = `https://api.themoviedb.org/3/movie/${data.id}/similar?api_key=${apiKey}&language=en-US&page=1`;

fetch(similarUrl)
.then((response) => response.json())
.then(data => {
  data.results.forEach(movie => {
    if (movie.poster_path) {
        
        const a = document.createElement('a')
        a.setAttribute('href',"../html/detail.html")
        const moviePoster = document.createElement("img");
        moviePoster.className = "moviePoster";
        moviePoster.setAttribute("src", `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
        
        a.addEventListener('click', () => {
          localStorage.setItem('selectedMovie', JSON.stringify(movie));
        });
        a.appendChild(moviePoster)
        similarMoviesContainer.appendChild(a);
      }
    });

  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
  
  

  // MEMBUAT BACKGROUND BLUR

  const bgUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  document.body.style.backgroundImage = `url(${bgUrl})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";

  const style = document.createElement("style");
  style.textContent = `
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: inherit;
      filter: blur(10px); 
      z-index: -1; 
    }`
  ;
  document.head.appendChild(style);
  // content: ''  ->  Menentukan bahwa pseudo-elemen tidak akan memiliki konten teks apa pun. Ini diperlukan untuk menampilkan pseudo-elemen ::before.
  // bacjground inherit  ->  digunakan untuk memastikan bahwa pseudo-elemen ::before yang berada di belakang semua konten utama memiliki latar belakang yang sama dengan body.

  figcaption.appendChild(h1);
  figcaption.appendChild(h2);
  figcaption.appendChild(h3);
  figcaption.appendChild(h5);
  figcaption.appendChild(h6);
  figcaption.appendChild(h4);
  figure.appendChild(img);
  figure.appendChild(figcaption);
  trailerContainer.appendChild(h7);
  main.appendChild(figure);
  main.appendChild(castListContainer);
  main.appendChild(trailerContainer);
  main.appendChild(h8)
  main.appendChild(similarMoviesContainer);

}




// SERIES

function cardSeries(data) {
  const main = document.querySelector(".main");
  const figure = document.createElement("figure");
  const figcaption = document.createElement("figcaption");

  const img = document.createElement("img");
  img.setAttribute("src", `https://image.tmdb.org/t/p/w500${data.poster_path}`);

  const h1 = document.createElement("h1");
  h1.textContent = `Title: ${data.original_title || data.original_name}`;

  const h2 = document.createElement("h2");
  h2.textContent = `Original Language: ${data.original_language}`;

  const h3 = document.createElement("h3");
  h3.textContent = `First air date: ${data.release_date || data.first_air_date}`;

  const h4 = document.createElement("h4");
  h4.textContent = `Overview: ${data.overview}`;

  const h5 = document.createElement("h5");
  h5.textContent = `Popularity: ${data.popularity}`;

  const h6 = document.createElement("h6");
  h6.textContent = `Vote Count: ${data.vote_count}`;

  const castListContainer = document.createElement("div");
  castListContainer.className = "castContainer";

  const h7 = document.createElement("h7");
  h7.textContent = "Watch Trailer";
  h7.className = "trailer";

  const trailerContainer = document.createElement("div");
  trailerContainer.className = "trailerContainer";

  const h8 = document.createElement("h8");
  h8.textContent = "Similiar";
  h8.className = "trailer";

  const similarMoviesContainer = document.createElement("div");
  similarMoviesContainer.className = "similarMoviesContainer";


  const apiKey = "8fa6e9d2c43306860f86299f63eaf5b0";
  let url;
  // mendeklarasi variabel kosong untuk kemudian di isi


  // FETCH CAST

  // untuk memastikan yang ditekan itu movie atau series
  if (data.release_date) {
    url = `https://api.themoviedb.org/3/movie/${data.id}/credits?api_key=${apiKey}`;
  } else if (data.first_air_date) {
    url = `https://api.themoviedb.org/3/tv/${data.id}/credits?api_key=${apiKey}`;
  }

  // lalu di fetch untuk mendapatkan list cast nya
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const cast = data.cast;
      const castList = document.createElement("ul");
      castList.className = "castList";

      cast.forEach((member) => {

        const listItem = document.createElement("li");
        listItem.className = "listItem";

        const memberImg = document.createElement("img");
        memberImg.className = "castImg";

        memberImg.setAttribute(
          "src",
          `https://image.tmdb.org/t/p/w500${member.profile_path}`
        );

        const memberText = document.createTextNode(
          `${member.name} as ${member.character}`
        );

        listItem.appendChild(memberImg);
        listItem.appendChild(memberText);
        castList.appendChild(listItem);
      });
      castListContainer.appendChild(castList);
    })
    .catch((error) => console.error("Error fetching cast:", error));


  // FETCH TRAILER

  const seriesTrailerUrl = `https://api.themoviedb.org/3/tv/${data.id}/videos?api_key=${apiKey}&language=en-US`;
  fetch(seriesTrailerUrl)
    .then((response) => response.json())
    .then((response) => {
      const trailers = response.results.filter(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailers.length > 0) {
        const trailer = trailers[0];
        const iframe = document.createElement("iframe");
        iframe.className = "iframe";
        iframe.setAttribute(
          "src",
          `https://www.youtube.com/embed/${trailer.key}`
        );
        iframe.setAttribute("allow", "picture-in-picture");
        iframe.setAttribute("allowfullscreen", true);
        trailerContainer.appendChild(iframe);
      } else {
        console.log("Trailer not found");
        const noResultsMessage = document.createElement("p");
        noResultsMessage.textContent = "No trailer found.";
        main.appendChild(noResultsMessage);
    
      }
    })
    .catch((error) => console.error("Error fetching series trailer:", error));
    
// FETCH SIMILAR MOVIES

const similarUrl = `https://api.themoviedb.org/3/tv/${data.id}/similar?api_key=${apiKey}&language=en-US&page=1`;

fetch(similarUrl)
.then((response) => response.json())
.then(data => {
  data.results.forEach(movie => {
    if (movie.poster_path) {
        
        const a = document.createElement('a')
        a.setAttribute('href',"../html/detail.html")
        const moviePoster = document.createElement("img");
        moviePoster.className = "moviePoster";
        moviePoster.setAttribute("src", `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
        
        a.addEventListener('click', () => {
          localStorage.setItem('selectedMovie', JSON.stringify(movie));
        });
        a.appendChild(moviePoster)
        similarMoviesContainer.appendChild(a);
      }
    });

  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

  // MEMBUAT BACKGROUND BLUR

  const bgUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  document.body.style.backgroundImage = `url(${bgUrl})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";

  const style = document.createElement("style");
  style.textContent = `
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: inherit;
      filter: blur(10px); 
      z-index: -1; 
    }
  `;
  document.head.appendChild(style);
  // content: ''  ->  Menentukan bahwa pseudo-elemen tidak akan memiliki konten teks apa pun. Ini diperlukan untuk menampilkan pseudo-elemen ::before.
  // bacjground inherit  ->  digunakan untuk memastikan bahwa pseudo-elemen ::before yang berada di belakang semua konten utama memiliki latar belakang yang sama dengan body.


  figcaption.appendChild(h1);
  figcaption.appendChild(h2);
  figcaption.appendChild(h3);
  figcaption.appendChild(h5);
  figcaption.appendChild(h6);
  figcaption.appendChild(h4);
  figure.appendChild(img);
  figure.appendChild(figcaption);
  trailerContainer.appendChild(h7);
  main.appendChild(figure);
  main.appendChild(castListContainer);
  main.appendChild(trailerContainer);
  main.appendChild(h8)
  main.appendChild(similarMoviesContainer);

}





// ARTIS

function cardArtis(data) {
  const main = document.querySelector(".main");
  const figure = document.createElement("figure");
  const figcaption = document.createElement("figcaption");
  const a = document.createElement("a");
  a.setAttribute("href", "../html/detail.html");
  const img = document.createElement("img");
  img.setAttribute(
    "src",
    `https://image.tmdb.org/t/p/w500${data.profile_path}`
  );
  const h3 = document.createElement("h3");
  h3.textContent = data.name;
  const h4 = document.createElement("h4");
  h4.textContent = `Original name: ${data.original_name}`;
  h4.classList = "overview";
  const h5 = document.createElement("h5");
  h5.textContent = data.gender === 2 ? `Gender: Male` : `Gender: Female`;
  h5.classList = "overview";  
  
  const knownFor = document.createElement('div')
  knownFor.className = 'knownFor'

  data.known_for.forEach((item) => {
    const itemDiv = document.createElement("div");
    
    const p = document.createElement("p");
    p.textContent = item.original_title || item.name;
    p.classList = 'ket'
  
    const image = document.createElement('img');
    image.setAttribute('src',`https://image.tmdb.org/t/p/w200${item.poster_path}`)
    image.className = 'kfImg'
  
    itemDiv.appendChild(image);
    itemDiv.appendChild(p);
    knownFor.appendChild(itemDiv);
  });

  const bgUrl = `https://image.tmdb.org/t/p/w500${data.profile_path}`;
  document.body.style.backgroundImage = `url(${bgUrl})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";

  const style = document.createElement("style");
  style.textContent = `
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: inherit;
      filter: blur(10px); 
      z-index: -1; 
    }
  `;
  document.head.appendChild(style);
  // content: ''  ->  Menentukan bahwa pseudo-elemen tidak akan memiliki konten teks apa pun. Ini diperlukan untuk menampilkan pseudo-elemen ::before.
  // bacjground inherit  ->  digunakan untuk memastikan bahwa pseudo-elemen ::before yang berada di belakang semua konten utama memiliki latar belakang yang sama dengan body.

  a.appendChild(img);
  figure.appendChild(a);
  figure.appendChild(figcaption);
  figcaption.appendChild(h3);
  figcaption.appendChild(h4);
  figcaption.appendChild(h5);
  figcaption.appendChild(knownFor)
  main.appendChild(figure);
}
