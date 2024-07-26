// WELCOME LOGIN  

document.addEventListener("DOMContentLoaded", function() {
  const body = document.body;
  const prompt = document.getElementById("prompt");
  const inputName = document.getElementById("inputName");
  const submitName = document.getElementById("submitName");

  const storedName = localStorage.getItem("username");
  // mengecek apakah username di local storage sudah ada isi nya
  if (storedName) { // kalau sudah
    prompt.style.display = "none"; // prompt atau login yang pertama itu akan disembunyikan
    body.classList.remove("loading"); // main konten akan ditampilkan
    document.getElementById("welcomeMessage").textContent = "Welcome back,"+ storedName + "!";
    // lalu teks welcome akan ditambah dengan kata 'back'
  } else {
    const style = document.createElement('style');
    style.textContent = `
      body{
        overflow-y : hidden
      }
    `
    document.head.appendChild(style)
    body.classList.add("loading"); // jika tidak ada maka main konten akan disembunyikan
    // lalu harus mgisi usernama lagi 
    prompt.style.display = 'flex'
  }

  // SAAT MENG INPUT PERTAMA KALI
  submitName.addEventListener("click", function() {
    // bila meng klik submit
    const username = inputName.value.trim();
    // menghapus bila ada spasi di awal atau di akhir inputan
    if (username) {
      localStorage.setItem('username', username)
      // memasukan username ke local storage
      prompt.style.display = "none"; // menyembunyikan prompt
      body.classList.remove("loading"); // menampilkan konten utama 
      const style = document.createElement('style');
      style.textContent = `
        body{
          overflow-y : auto
        }`
        document.head.appendChild(style);
      document.getElementById("welcomeMessage").textContent = "Welcome,"+ username + "!";
      // menampilkan pesan selamat datang
    } else {
      alert("Please enter your name."); // jika inputan nama kosong akan ada alert ini
    }
  });
});

// UNTUK LOG OUT
function list1(){
  localStorage.removeItem('username')
}

// UNTUK MENU DI ATAS
function list(){
  localStorage.setItem("pilih", 'movie')
  // mengganti isian pilih dg movie
}
function listt(){
  localStorage.setItem("pilih", 'series')
  // mengganti isian pilih dg series
}
function listtt(){
  localStorage.setItem("pilih", 'artis')
  // mengganti isian pilih dg artis
}




// FITUR SEARCH

document.getElementById('form-search').addEventListener('submit', (e) => {
  e.preventDefault();
  // mencegah default submit
  // kalau hanya submit kan langsung, ini ada pengecekan dulu
  let input = document.getElementById('keyword').value;
  if (input) {
      localStorage.setItem('keyword', input);
      window.location.href = "../html/result.html";
  } else {
      alert('Please enter a name');
  }
});



// MENU ATAS

const menu = document.getElementById("menu")
const nav = document.getElementById("nav")

menu.addEventListener('click', () => {
    nav.classList.toggle("hidden")
    // saat menu di klik, toggle akan menambahkan class pd nav jika tidak ada, dan menghapusnya jika ada
    // ini digunakan hanya saat layar diperkecil
})




// NOW PLAYING IN CINEMA

let pageInt = 1;

let movieList = [];
// array untuk menyimpan semua film dr api

let startIdx = 0;
// melacak index film pertma yang ditampilkan

const page = document.querySelector('.page')
const now =document.querySelector('.now')

const options = {
    method: 'GET',
    // mengambil data dr server
    headers: {
      // mengirim informasi tambahan (authorization)
      // menentukan jenis content yang di terima (accept)
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZmE2ZTlkMmM0MzMwNjg2MGY4NjI5OWY2M2VhZjViMCIsIm5iZiI6MTcyMTA1NTYxMi44MTIzODUsInN1YiI6IjY2OGU1MzQ0YjdlN2E2YjkxZWQ1YWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GU_shBt3T5I2SraOE30PmPQ15RcksNzdiLS7KFcwru8'
    }
};

function getMovie() {
    fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${pageInt}`, options)
    // mengambil (fetch) data dr api     
    .then(response => response.json())
    // menerima data dalam bentuk json
    .then(response => {
        movieList = response.results;
        startIdx = 0; // meriset startIdx saat ada data baru masuk
        displayMovies(startIdx);
        console.log(response);
    })
  .catch(err => console.error(err));
}

function clearMovies() {
    while (now.firstChild) {
        now.removeChild(now.firstChild);
        // mengecek apakah elemen now masih menampilkan / memiliki 
        // elemen didalamnya sebelum menampilkan halamn lain
    }
}

function displayMovies(startIdx){
    clearMovies();
    // membersihkan layar sebelum menampilkan 3 film lainnya
    const endIdx = Math.min(startIdx + 3, movieList.length)
    // membuat elemen endIdx dengan panjang 3, jd dr movielist yg ditampilkan 3
    // math.min (Tidak perlu diimpor atau diinisialisasi karena tersedia di JavaScript)
    for (let i = startIdx; i < endIdx; i++) {
        const movie = movieList[i];
        const movieDiv = document.createElement("div");
        movieDiv.className = 'movieDiv';
        const movieTitle = document.createElement("h3");
        movieTitle.className = 'movieTitle'
        const moviePoster = document.createElement("img");
        moviePoster.className = 'moviePoster'
        const a = document.createElement('a')
        
        a.setAttribute('href',"../html/detail.html")
  
        movieTitle.textContent = movie.original_title;
        moviePoster.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
        moviePoster.alt = movie.title;

        a.appendChild(moviePoster)
        movieDiv.appendChild(a);
        now.appendChild(movieDiv);
        movieDiv.appendChild(movieTitle);

        moviePoster.addEventListener('click',() => {
          localStorage.setItem('pilih', 'movie')
          localStorage.setItem('selectedMovie',JSON.stringify(movie))
        })
      }
}

const prev = document.querySelector(".ph-arrow-circle-left")
const next = document.querySelector(".ph-arrow-circle-right")

if (prev) {
    prev.addEventListener("click", () => {
      // memastikan tidak bisa klik prev bila ada di awal konten
        if (startIdx > 0) {
            startIdx -= 3;
            // dikurang 3 untuk menamplkan 3 film sebelumnya
            displayMovies(startIdx);
            // menjalankan function
        } 
        else if (pageInt > 1) {
            pageInt--;
            getMovie();
            // else if memastikan bahwa jika sudah berada di awal konten (startIdx <= 0), 
            // tetapi masih ada halaman sebelumnya (pageInt > 1), halaman sebelumnya diambil.
        }
    });
}

if (next) {
    next.addEventListener("click", () => {
        if (startIdx + 3 < movieList.length) {
            // mengecek apakah startidx = 3 masih kurang dr panjang film (bkn list terakhir)
            startIdx += 3;
            displayMovies(startIdx);
            // maka ditambah 3 untuk menjalankan fungsi ini
        } else if (pageInt < 10) {
            pageInt++;
            getMovie();
            // else if memastikan bahwa jika sudah berada di akhir konten (startIdx + 3 >= movieList.length), 
            // tetapi masih ada halaman berikutnya (pageInt < 10), halaman berikutnya diambil.
        }
    });
}
getMovie();



// const API_KEY = '8fa6e9d2c43306860f86299f63eaf5b0';


// AIRING TODAY SERIES


const API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZmE2ZTlkMmM0MzMwNjg2MGY4NjI5OWY2M2VhZjViMCIsIm5iZiI6MTcyMTEzNzQ1Ni40MzgwMjksInN1YiI6IjY2OGU1MzQ0YjdlN2E2YjkxZWQ1YWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CyMD7BOSZx8JctvLgdqeeNH1BcFgKYYoRlIOqgfjdeQ';
const url = 'https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=1';

const options2 = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: API_KEY
  }
};

fetch(url, options2)
  .then(response => response.json())
  .then(response => {
    console.log(response);
    tdy(response.results);
  })
  .catch(err => console.error('Fetch error: ', err));

function tdy(shows) {
  const today = document.querySelector('.today');

  shows.forEach(show => {
    const figDay = document.createElement('figure');
    figDay.className = 'figDay';
    
    const a = document.createElement('a')
    a.setAttribute('href',"../html/detail.html")
    const imgDay = document.createElement('img');
    imgDay.className = 'imgDay';
    imgDay.setAttribute('src', `https://image.tmdb.org/t/p/w200${show.poster_path}`);
    imgDay.setAttribute('alt', show.name); 

    a.appendChild(imgDay)
    figDay.appendChild(a);
    today.appendChild(figDay);

    imgDay.addEventListener('click',() => {
      localStorage.setItem('pilih', 'movie')
      localStorage.setItem('selectedMovie',JSON.stringify(show))

      // bila meng klik salah satu image, maka akan menyimpan data di local storage
    })
  });
}


// FILM POPULER


const options3 = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZmE2ZTlkMmM0MzMwNjg2MGY4NjI5OWY2M2VhZjViMCIsIm5iZiI6MTcyMTA1NTYxMi44MTIzODUsInN1YiI6IjY2OGU1MzQ0YjdlN2E2YjkxZWQ1YWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GU_shBt3T5I2SraOE30PmPQ15RcksNzdiLS7KFcwru8'
    }
  };
  
  fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc', options3)
    .then(response => response.json())
    .then(response => {
        populer(response.results)
        console.log(response)
    })
    .catch(err => console.error(err));

    function populer(shows) {
      const popular = document.querySelector('.popMovie');
        shows.forEach(show => {
          const figure = document.createElement('figure');
          figure.className = 'figPop';
          const a = document.createElement('a')
          a.setAttribute('href',"../html/detail.html")
    
          const img = document.createElement('img');
          img.className = 'imgPop';
          img.setAttribute('src', `https://image.tmdb.org/t/p/w200${show.poster_path}`);
          img.setAttribute('alt', show.name); 
      
          a.appendChild(img)
          figure.appendChild(a);
          popular.appendChild(figure);

          img.addEventListener('click',() => {
            localStorage.setItem('pilih', 'movie')
            localStorage.setItem('selectedMovie',JSON.stringify(show))
          })
        });
      }
      


    //   TRAILER


    const apiKey = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZmE2ZTlkMmM0MzMwNjg2MGY4NjI5OWY2M2VhZjViMCIsIm5iZiI6MTcyMTEzNzQ1Ni40MzgwMjksInN1YiI6IjY2OGU1MzQ0YjdlN2E2YjkxZWQ1YWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CyMD7BOSZx8JctvLgdqeeNH1BcFgKYYoRlIOqgfjdeQ';
    const urlT = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';

    const options4 = {
    method: 'GET',  
    headers: {
        accept: 'application/json',
        Authorization: apiKey
    }    
    };

    fetch(urlT, options4)
    .then(response => response.json())
    .then(response => {
        console.log('Total movies:', response.results.length);
        fetchTrailers(response.results);
    })
    .catch(err => console.error('Fetch error: ', err));

    // fetch pertama ini untuk mengambil data dari movie yang tayang saat ini

    function fetchTrailers(movies) {
    movies.forEach(movie => {
        const trailerUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`;
        fetch(trailerUrl, options4)
        .then(response => response.json())
        .then(response => {
          // lalu dalam fetch ini, setiap id dari daftar movie di fetch pertama akan dicari trailer nya

            const trailers = response.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube');
            // lalu saat mencari video akan di filter untuk hanya berupa trailer dan diambil dari youtube
            if (trailers.length > 0) {
            const trailer = trailers[0];
            // jika ditemukan lebih dari satu trailer (indeks dimulai dr nol), maka yg ditampilkan tetap trailer pertama yang ditemukan
            displayTrailer(trailer);
            }
        })
        .catch(err => console.error(`Fetch trailer error for movie ID ${movie.id}: `, err));
    });
    }

    function displayTrailer(data) {
      const trailer = document.querySelector('.trailer'); 
      // Menyimpan elemen dengan class 'trailer' ke dalam variabel 'trailer'
      const iframe = document.createElement('iframe'); 
      // Membuat elemen iframe baru
      iframe.className = 'iframe'; 
      // Menambahkan class 'iframe' ke elemen iframe
      iframe.setAttribute('src', `https://www.youtube.com/embed/${data.key}`); 
      // Mengatur atribut src iframe ke URL embed YouTube dengan menggunakan key dari data. key ini parameter dinamis
      iframe.setAttribute('allow', 'picture-in-picture'); 
      // Mengizinkan mode picture-in-picture pada iframe
      iframe.setAttribute('allowfullscreen', true); 
      // Mengizinkan tampilan layar penuh pada iframe
  
      trailer.appendChild(iframe); // Menambahkan iframe sebagai child dari elemen 'trailer'
  }
  


