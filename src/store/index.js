import { createSlice, createAsyncThunk, configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";

const initialState = {
  movies: [],
  genresLoaded: false,
  genres: [],
  dataLoading: false,
  searchResults: [],
};

// Thunk to get genres from TMDB
export const getGenres = createAsyncThunk("netflix/genres", async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    return response.data.genres;
  } catch (error) {
    console.error("Failed to fetch genres:", error);
    throw error;
  }
});

const createArrayFromRawData = (array, moviesArray, genres) => {
  array.forEach((movie) => {
    const movieGenres = movie.genre_ids.map((genreId) => {
      const genre = genres.find(({ id }) => id === genreId);
      return genre ? genre.name : null;
    }).filter(Boolean);
    if (movie.poster_path) {
      moviesArray.push({
        id: movie.id,
        name: movie.original_name || movie.original_title,
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        genres: movieGenres.slice(0, 3),
      });
    }
  });
};

const getRawData = async (api, genres, paging = false) => {
  const moviesArray = [];
  for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
    const { data } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
    createArrayFromRawData(data.results, moviesArray, genres);
  }
  return moviesArray;
};

// Thunk to fetch movies by genre
export const fetchDataByGenre = createAsyncThunk("netflix/genre", async ({ genre, type }, thunkAPI) => {
  const { netflix: { genres } } = thunkAPI.getState();
  const genreId = genres.find(({ name }) => name.toLowerCase() === genre.toLowerCase())?.id;
  if (!genreId) return [];
  return getRawData(`${TMDB_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genreId}`, genres);
});

// Thunk to fetch trending movies or TV shows
export const fetchMovies = createAsyncThunk("netflix/trending", async ({ type }, thunkAPI) => {
  const { netflix: { genres } } = thunkAPI.getState();
  return getRawData(`${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`, genres, true);
});

// Thunk to get user's liked movies
export const getUsersLikedMovies = createAsyncThunk("netflix/getLiked", async (email) => {
  const { data: { movies } } = await axios.get(`http://localhost:5000/api/user/liked/${email}`);
  return movies;
});

// Thunk to remove movie from user's liked list
export const removeMovieFromLiked = createAsyncThunk("netflix/deleteLiked", async ({ movieId, email }) => {
  const { data: { movies } } = await axios.put("http://localhost:5000/api/user/remove", {
    email,
    movieId,
  });
  return movies;
});

// Thunk to fetch search results
export const fetchSearchResults = createAsyncThunk("netflix/search", async (query) => {
  const response = await axios.get(`${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
  return response.data.results.map((movie) => ({
    id: movie.id,
    name: movie.original_name || movie.original_title,
    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  }));
});

const netflixSlice = createSlice({
  name: "Netflix",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    });
    builder.addCase(fetchMovies.pending, (state) => {
      state.dataLoading = true;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
      state.dataLoading = false;
    });
    builder.addCase(fetchMovies.rejected, (state) => {
      state.dataLoading = false;
    });
    builder.addCase(fetchDataByGenre.pending, (state) => {
      state.dataLoading = true;
    });
    builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
      state.movies = action.payload;
      state.dataLoading = false;
    });
    builder.addCase(fetchDataByGenre.rejected, (state) => {
      state.dataLoading = false;
    });
    builder.addCase(getUsersLikedMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(removeMovieFromLiked.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(fetchSearchResults.fulfilled, (state, action) => {
      state.searchResults = action.payload;
    });
  },
});

export const store = configureStore({
  reducer: {
    netflix: netflixSlice.reducer,
  },
});

export const { setGenres, setMovies } = netflixSlice.actions;
export const selectSearchResults = (state) => state.netflix.searchResults;
