// Movie data store (in-memory)
let movies = [
  {
    id: "1",
    name: "The Shawshank Redemption",
    director_name: "Frank Darabont",
    production_house: "Castle Rock Entertainment",
    release_date: "1994-09-23",
    rating: 9.3
  },
  {
    id: "2",
    name: "The Godfather",
    director_name: "Francis Ford Coppola",
    production_house: "Paramount Pictures",
    release_date: "1972-03-24",
    rating: 9.2
  },
  {
    id: "3",
    name: "The Dark Knight",
    director_name: "Christopher Nolan",
    production_house: "Warner Bros",
    release_date: "2008-07-18",
    rating: 9.0
  },
  {
    id: "4",
    name: "Inception",
    director_name: "Christopher Nolan",
    production_house: "Warner Bros",
    release_date: "2010-07-16",
    rating: 8.8
  },
  {
    id: "5",
    name: "Pulp Fiction",
    director_name: "Quentin Tarantino",
    production_house: "Miramax Films",
    release_date: "1994-10-14",
    rating: 8.9
  }
];

// Generate next ID
let nextId = 6;

// Movie class with static methods
class Movie {
  constructor(data) {
    this.id = data.id || String(nextId++);
    this.name = data.name;
    this.director_name = data.director_name;
    this.production_house = data.production_house;
    this.release_date = data.release_date;
    this.rating = data.rating;
  }

  // Get all movies
  static getAllMovies() {
    return movies;
  }

  // Get movie by ID
  static getMovieById(id) {
    return movies.find(movie => movie.id === id);
  }

  // Get movies by director name (static method)
  static getMoviesByDirector(directorName) {
    return movies.filter(movie =>
      movie.director_name.toLowerCase().includes(directorName.toLowerCase())
    );
  }

  // Add a new movie
  static addMovie(movieData) {
    const newMovie = new Movie(movieData);
    const movie = {
      id: newMovie.id,
      name: newMovie.name,
      director_name: newMovie.director_name,
      production_house: newMovie.production_house,
      release_date: newMovie.release_date,
      rating: newMovie.rating
    };
    movies.push(movie);
    return movie;
  }

  // Update a movie by ID
  static updateMovie(id, updateData) {
    const index = movies.findIndex(movie => movie.id === id);
    if (index === -1) {
      return null;
    }

    movies[index] = {
      ...movies[index],
      ...updateData,
      id: id // Ensure ID doesn't change
    };

    return movies[index];
  }

  // Delete a movie by ID
  static deleteMovie(id) {
    const index = movies.findIndex(movie => movie.id === id);
    if (index === -1) {
      return null;
    }

    const deletedMovie = movies[index];
    movies.splice(index, 1);
    return deletedMovie;
  }
}

module.exports = Movie;
