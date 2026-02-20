const Movie = require('../models/Movie');

const resolvers = {
  Query: {
    // Get all movies
    movies: () => {
      return Movie.getAllMovies();
    },

    // Get movie by ID
    movie: (_, { id }) => {
      return Movie.getMovieById(id);
    },

    // Get movies by director name (using static method)
    moviesByDirector: (_, { director_name }) => {
      return Movie.getMoviesByDirector(director_name);
    }
  },

  Mutation: {
    // Add a new movie
    addMovie: (_, { input }) => {
      return Movie.addMovie(input);
    },

    // Update an existing movie
    updateMovie: (_, { id, input }) => {
      const updatedMovie = Movie.updateMovie(id, input);
      if (!updatedMovie) {
        throw new Error(`Movie with ID ${id} not found`);
      }
      return updatedMovie;
    },

    // Delete a movie by ID
    deleteMovie: (_, { id }) => {
      const deletedMovie = Movie.deleteMovie(id);
      if (!deletedMovie) {
        throw new Error(`Movie with ID ${id} not found`);
      }
      return deletedMovie;
    }
  }
};

module.exports = resolvers;
