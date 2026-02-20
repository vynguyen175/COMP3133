const typeDefs = `#graphql
  # Movie type definition
  type Movie {
    id: ID!
    name: String!
    director_name: String!
    production_house: String!
    release_date: String!
    rating: Float!
  }

  # Input type for creating a new movie
  input MovieInput {
    name: String!
    director_name: String!
    production_house: String!
    release_date: String!
    rating: Float!
  }

  # Input type for updating a movie (all fields optional)
  input MovieUpdateInput {
    name: String
    director_name: String
    production_house: String
    release_date: String
    rating: Float
  }

  # Query type - all read operations
  type Query {
    # Get all movies
    movies: [Movie]

    # Get a single movie by ID
    movie(id: ID!): Movie

    # Get movies by director name
    moviesByDirector(director_name: String!): [Movie]
  }

  # Mutation type - all write operations
  type Mutation {
    # Add a new movie
    addMovie(input: MovieInput!): Movie

    # Update an existing movie by ID
    updateMovie(id: ID!, input: MovieUpdateInput!): Movie

    # Delete a movie by ID
    deleteMovie(id: ID!): Movie
  }
`;

module.exports = typeDefs;
