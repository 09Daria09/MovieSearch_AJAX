export function displayMovies(movies) {
    const movieContainer = document.getElementById('movies');
    movieContainer.innerHTML = movies.map(movie => `
        <div class="movie">
            <h3>${movie.Title} (${movie.Year})</h3>
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'img/placeholder.png'}" alt="Poster for ${movie.Title}" style="width: 200px; height: auto;">
            <button class="details-button" data-imdbid="${movie.imdbID}" onclick="showMovieDetails('${movie.imdbID}')">Details</button>
        </div>
    `).join('');
}




export function createPagination(pages, searchText, type, searchMoviesCallback) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.addEventListener('click', () => {
            searchMoviesCallback(searchText, type, i);
        });
        paginationContainer.appendChild(btn);
    }
}

export async function showDetails(movieService, imdbID) {
    const modal = document.getElementById('myModal');
    const detailsContainer = document.getElementById('movieDetails'); 
    const span = document.getElementsByClassName('close')[0]; 

    try {
        const data = await movieService.getMovie(imdbID);
        detailsContainer.innerHTML = `
            <div class="movie-details-container">
                <img src="${data.Poster}" alt="Poster for ${data.Title}" class="movie-details-poster">
                <div class="movie-details-info">
                    <h2>${data.Title} (${data.Year})</h2>
                    <p><b>Released:</b> ${data.Released}</p>
                    <p><b>Runtime:</b> ${data.Runtime}</p>
                    <p><b>Genre:</b> ${data.Genre}</p>
                    <p><b>Director:</b> ${data.Director}</p>
                    <p><b>Writer:</b> ${data.Writer}</p>
                    <p><b>Actors:</b> ${data.Actors}</p>
                    <p><b>Plot:</b> ${data.Plot}</p>
                    <p><b>Language:</b> ${data.Language}</p>
                    <p><b>Country:</b> ${data.Country}</p>
                    <p><b>Ratings:</b> ${data.Ratings.map(rating => `${rating.Source}: ${rating.Value}`).join(', ')}</p>
                    <p><b>IMDB Rating:</b> ${data.imdbRating}</p>
                    <p><b>Box Office:</b> ${data.BoxOffice}</p>
                </div>
            </div>
        `;

        modal.style.display = "block"; 
        span.onclick = function() {
            modal.style.display = "none";
        };

        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    } catch (error) {
        console.error('Error fetching movie details:', error);
        detailsContainer.innerHTML = `<p class="error-message">Error loading movie details. Please try again later.</p>`;
    }
}


export async function searchMovies(movieService, searchText, type, page) {
    showLoadingIndicator();
    try {
        const data = await movieService.search(searchText, type, page);
        if (data.Response === "True") {
            displayMovies(data.Search);
            if (data.totalResults > 10) {
                createPagination(Math.ceil(data.totalResults / 10), searchText, type, (text, type, page) => searchMovies(movieService, text, type, page));
            } else {
                document.getElementById('pagination').innerHTML = ''; 
            }
        } else {
            document.getElementById('movies').innerHTML = '<p>Movie not found! ( ͡> ︵ ͡<)</p>';
            document.getElementById('pagination').innerHTML = ''; 
        }
    } catch (error) {
        console.error('Error fetching or displaying movies:', error);
        document.getElementById('movies').innerHTML = '<p>Error loading movies. Please try again later.</p>';
    }finally {
        hideLoadingIndicator();
    }

}

function showLoadingIndicator() {
    document.getElementById('loadingIndicator').style.display = 'block';
}
function hideLoadingIndicator() {
    document.getElementById('loadingIndicator').style.display = 'none';
}
