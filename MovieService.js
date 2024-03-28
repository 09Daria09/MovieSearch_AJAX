export class MovieService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "http://www.omdbapi.com/";
    }

    async search(title, type, page) {
        const url = `${this.baseUrl}?s=${title}&type=${type}&page=${page}&apikey=${this.apiKey}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Problem fetching data');
        return response.json();
    }

    async getMovie(movieId) {
        const url = `${this.baseUrl}?i=${movieId}&apikey=${this.apiKey}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Problem fetching movie details');
        return response.json();
    }
}
