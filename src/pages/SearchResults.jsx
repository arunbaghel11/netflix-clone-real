import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { selectSearchResults } from "../store";

export default function SearchResults() {
  const searchResults = useSelector(selectSearchResults);

  return (
    <Container>
      <h1>Search Results</h1>
      <div className="results">
        {searchResults.map((movie) => (
          <div key={movie.id} className="movie">
            <img src={movie.image} alt={movie.name} />
            <h2>{movie.name}</h2>
          </div>
        ))}
      </div>
    </Container>
  );
}

const Container = styled.div`
  padding: 2rem;
  .results {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    .movie {
      img {
        width: 200px;
        height: 300px;
        object-fit: cover;
      }
      h2 {
        text-align: center;
        color: white;
      }
    }
  }
`;
