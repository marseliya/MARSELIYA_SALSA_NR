// FILM & SERIES

const apiKey = '8fa6e9d2c43306860f86299f63eaf5b0'; // API Key dari TMDb

let pageInt = 1

let movieList = []

let startIdx = 0

// const page = document.querySelector('.page')
const main = document.querySelector('.main')

document.addEventListener("DOMContentLoaded", function() {
  let pilih = localStorage.getItem("pilih");
  if (pilih === 'movie') {
    fetchMovies();
  } 
  else if (pilih === 'series') {
    fetchSeries();
  }
  else if (pilih === 'artis'){
    fetchActress();
  }
});


function clearMain() {
  // const main = document.querySelector('.main');
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
}



// FETCH MOVIE

function fetchMovies() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZmE2ZTlkMmM0MzMwNjg2MGY4NjI5OWY2M2VhZjViMCIsIm5iZiI6MTcyMTM5ODM5Ny4wNzAzMTEsInN1YiI6IjY2OGU1MzQ0YjdlN2E2YjkxZWQ1YWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3BYiLdDvHyR6msqqsVE7vtyfPo4ACdyJpgVplgx7mP8'
  }
  };

  fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${pageInt}&sort_by=popularity.desc`, options)
    .then(response => response.json())
    .then(response => {
      clearMain()
      movieList = response.results;
        startIdx = 0; // meriset startIdx saat ada data baru masuk
        card(startIdx, 'movie');
        console.log(response);
    })
    .catch(err => console.error(err));
}

//  FETCH SERIES

function fetchSeries() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZmE2ZTlkMmM0MzMwNjg2MGY4NjI5OWY2M2VhZjViMCIsIm5iZiI6MTcyMTM5ODM5Ny4wNzAzMTEsInN1YiI6IjY2OGU1MzQ0YjdlN2E2YjkxZWQ1YWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3BYiLdDvHyR6msqqsVE7vtyfPo4ACdyJpgVplgx7mP8`
    }
  };

  fetch(`https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pageInt}&sort_by=popularity.desc`, options)
  .then(response => response.json())
    .then(response => {
      clearMain()
      movieList = response.results;
        startIdx = 0; // meriset startIdx saat ada data baru masuk
        card(startIdx, 'series');
        console.log(response);
    })
    .catch(err => console.error(err));
}

// FUNCTION UNTUK MOVIE DAN SERIES, PEMBEDA NYA ADA DI TYPE

function card(data, type) {
  clearMain()
  // membersihkan layar sebelum menampilkan 20 film lainnya
  const endIdx = Math.min(startIdx + 20, movieList.length)
  // membuat elemen endIdx dengan panjang 20, jd dr movielist yg ditampilkan 20
  // math.min (Tidak perlu diimpor atau diinisialisasi karena tersedia di JavaScript)
  
  for (let i = startIdx; i< endIdx; i++){

    const data = movieList[i]

    const main = document.querySelector('.main');
    const figure = document.createElement('figure');
    const figcaption = document.createElement('figcaption');
    
    const a = document.createElement('a');
    a.setAttribute('href', "../html/detail.html");
    const img = document.createElement('img');
    img.setAttribute('src', `https://image.tmdb.org/t/p/w500${data.poster_path}`);
    
    const h3 = document.createElement('h3');
    if (type === 'movie') {
      h3.textContent = data.title || data.original_title;
    } else if (type === 'series') {
      h3.textContent = data.name || data.original_name;
    }
    
    const h4 = document.createElement('h4');
    h4.textContent = type === 'movie' ? data.release_date : data.first_air_date;
    
    const h5 = document.createElement('h5');
    h5.textContent = data.overview;
    h5.classList = 'overview';
    
    figcaption.appendChild(h3);
    figcaption.appendChild(h4);
    figcaption.appendChild(h5);
    figure.appendChild(a);
    a.appendChild(img);
    figure.appendChild(figcaption);
    main.appendChild(figure);
    
    img.addEventListener('click', () => {
      localStorage.setItem('selectedMovie', JSON.stringify(data));
    });
  }
}




// FETCH DAN FUNCTION UNTUK  ARTIS



function fetchActress() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZmE2ZTlkMmM0MzMwNjg2MGY4NjI5OWY2M2VhZjViMCIsIm5iZiI6MTcyMTM5ODM5Ny4wNzAzMTEsInN1YiI6IjY2OGU1MzQ0YjdlN2E2YjkxZWQ1YWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3BYiLdDvHyR6msqqsVE7vtyfPo4ACdyJpgVplgx7mP8'
    }
  };
  
  fetch(`https://api.themoviedb.org/3/person/popular?language=en-US&page=${pageInt}`, options)
    .then(response => response.json())
    .then(response => {
      clearMain()
      movieList = response.results;
        startIdx = 0; // meriset startIdx saat ada data baru masuk
        cardActress(startIdx);
        console.log(response);
    })
    .catch(err => console.error(err));
}

function cardActress(data) {

  clearMain()
  // membersihkan layar sebelum menampilkan 20 film lainnya
  const endIdx = Math.min(startIdx + 20, movieList.length)
  // membuat elemen endIdx dengan panjang 20, jd dr movielist yg ditampilkan 20
  // math.min (Tidak perlu diimpor atau diinisialisasi karena tersedia di JavaScript)
  
  for (let i = startIdx; i< endIdx; i++){

    const data = movieList[i]
    const main = document.querySelector('.main');
    const figure = document.createElement('figure');
    const figcaption = document.createElement('figcaption');
    
    const a = document.createElement('a');
    a.setAttribute('href', "../html/detail.html");
    const img = document.createElement('img');
    img.setAttribute('src', `https://image.tmdb.org/t/p/w500${data.profile_path}`);
    
    const h3 = document.createElement('h3');
    h3.textContent = data.name;
    
    const h4 = document.createElement('h4');
    h4.textContent = `Original name: ${data.original_name}`;
    h4.classList = 'overview';
    
    const h5 = document.createElement('h5');
    h5.textContent = data.gender === 2 ? 'Gender: Male' : 'Gender: Female';
    h5.classList = 'overview';
    
    const p = document.createElement('p');
    const h6 = data.known_for.map(item => item.original_title || item.name).join(', ');
    p.textContent = `Known for: ${h6}`;
    p.classList = 'overview';
    
    a.appendChild(img);
    figure.appendChild(a);
    figure.appendChild(figcaption);
    figcaption.appendChild(h3);
    figcaption.appendChild(h4);
    figcaption.appendChild(h5);
    figcaption.appendChild(p);
    main.appendChild(figure);
    
    figure.addEventListener('click', () => {
      localStorage.setItem('selectedPerson', JSON.stringify(data));
    });
  }
}



// ARROW UNTUK SEMUA


const prev = document.querySelector(".ph-arrow-circle-left")
const next = document.querySelector(".ph-arrow-circle-right")

if (prev) {
  prev.addEventListener("click", () => {
    if (startIdx > 0) {
      startIdx -= 20;
      card(startIdx, localStorage.getItem("pilih"));
      cardActress(startIdx)
    } else if (pageInt > 1) {
      pageInt--;
      if (localStorage.getItem("pilih") === 'movie') {
        fetchMovies();
      } else if (localStorage.getItem("pilih") === 'series') {
        fetchSeries();
      }
      else if (localStorage.getItem("pilih" ) === 'artis'){
        fetchActress()
      }
    }
  });
}

if (next) {
  next.addEventListener("click", () => {
    if (startIdx + 20 < movieList.length) {
      startIdx += 20;
      card(startIdx, localStorage.getItem("pilih"));
      cardActress(startIdx)
    } 
    else if (pageInt < 500) { // TMDb max pages limit
      pageInt++;
      if (localStorage.getItem("pilih") === 'movie') {
        fetchMovies();
      } else if (localStorage.getItem("pilih") === 'series') {
        fetchSeries();
      }
      else if (localStorage.getItem("pilih") === 'artis') {
        fetchActress()
      }
    }
  });
}

