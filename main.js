import { MovieService } from './MovieService.js';
import * as ui from './WorkDOM.js';
const movieService = new MovieService('6d36d181&');
window.movieService = movieService;
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const searchText = document.getElementById('searchText').value.trim();
    const type = document.getElementById('type').value;
    ui.searchMovies(movieService, searchText, type, 1);
});
window.showMovieDetails = async (imdbID) => {
    try {
        await ui.showDetails(movieService, imdbID);
    } catch (error) {
        console.error('Error showing movie details:', error);
    }
};

