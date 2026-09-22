import { useState, useEffect } from 'react';
import './App.css';

const API_KEY = 'e5ca12ff';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm.trim() === '') {
      setMovies([]);
      return;
    }

    async function fetchMovies() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${debouncedSearchTerm}`
        );
        const data = await response.json();
        if (data.Response === 'False') {
          setMovies([]);
          setError(data.Error);
        } else {
          setMovies(data.Search);
        }
      } catch (err) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [debouncedSearchTerm]);

  return (
    <div className="app">
      <h1>Movie Search</h1>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a movie..."
      />

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="results">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x220?text=No+Image'}
              alt={movie.Title}
            />
            <p>{movie.Title}</p>
            <span>{movie.Year}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;