document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "c9ee16d63e6fc68fe4b8f2e4b7aedf5a";
  const apiUrl = "https://api.themoviedb.org/3/search/multi";
  // URL to search data from TMDB; 'multi' means it can search by artist name, movie name, or series name
  const keyword = localStorage.getItem("keyword");
  // Retrieve the keyword from localStorage and store it in the variable 'keyword'

  if (keyword) {
    fetch(
      `${apiUrl}?api_key=${apiKey}&query=${keyword}&include_adult=false&language=en-US&page=1`
    )
      .then((response) => response.json())
      .then((data) => displayResults(data.results))
      .catch((error) => console.error("Error fetching data:", error));
  }
});

function displayResults(results) {
  const main = document.querySelector(".main");

  if (!results || results.length === 0) {
    const noResultsMessage = document.createElement("p");
    noResultsMessage.textContent = "No results found.";
    // If no data is found, display this message
    main.appendChild(noResultsMessage);
    return;
  }

  results.forEach((data) => {
    const figure = document.createElement("figure");
    const figcaption = document.createElement("figcaption");
    const a = document.createElement("a");
    a.setAttribute("href", "../html/detail.html");

    let img = document.createElement("img");
    let h3 = document.createElement("h3");
    let h4 = document.createElement("h4");

    if (data.media_type === "person") {
      img.setAttribute("src", `https://image.tmdb.org/t/p/w500${data.profile_path}`);
      h3.textContent = data.name; 
      h4.textContent = "Artist";
    } else {
      img.setAttribute("src", `https://image.tmdb.org/t/p/w500${data.poster_path}`);
      h3.textContent = data.title || data.original_title || data.name || data.original_name;
      h4.textContent = data.release_date || data.first_air_date;
    }

    const h5 = document.createElement("h5");
    h5.textContent = data.overview || "";
    h5.classList.add("overview");

    figcaption.appendChild(h3);
    figcaption.appendChild(h4);
    figcaption.appendChild(h5);
    figure.appendChild(a);
    a.appendChild(img);
    figure.appendChild(figcaption);
    main.appendChild(figure);

    img.addEventListener('click', () => {
      const contentType = data.media_type === "person" ? 'artis' : (data.release_date ? 'movie' : 'series');
      localStorage.setItem('pilih', contentType);
      localStorage.setItem('selectedMovie', JSON.stringify(data));
      localStorage.setItem('selectedPerson', JSON.stringify(data));
    });
  });
}
