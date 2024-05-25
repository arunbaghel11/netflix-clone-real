import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { firebaseAuth } from "../utils/firebase-config";
import { FaPowerOff, FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { fetchSearchResults } from "../store";

export default function Navbar({ isScrolled }) {
  const [showSearch, setShowSearch] = useState(false);
  const [inputHover, setInputHover] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(fetchSearchResults(searchQuery));
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const links = [
    { name: "Home", link: "/" },
    { name: "TV Shows", link: "/tv" },
    { name: "Movies", link: "/movies" },
    { name: "My List", link: "/mylist" },
  ];

  return (
    <Container>
      <nav className={`${isScrolled ? "scrolled" : ""} flex`}>
        <div className="left flex a-center">
          <div className="brand flex a-center j-center">
            <img src={logo} alt="Logo" />
          </div>
          <ul className="links flex">
            {links.map(({ name, link }) => (
              <li key={name}>
                <Link to={link}>{name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="right flex a-center">
          <div className={`search ${showSearch ? "show-search" : ""}`}>
            <button
              onFocus={() => setShowSearch(true)}
              onBlur={() => {
                if (!inputHover) {
                  setShowSearch(false);
                }
              }}
              onClick={() => setShowSearch((prev) => !prev)}
            >
              <FaSearch />
            </button>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onMouseEnter={() => setInputHover(true)}
                onMouseLeave={() => setInputHover(false)}
                onBlur={() => {
                  setShowSearch(false);
                  setInputHover(false);
                }}
              />
            </form>
          </div>
          <button onClick={() => signOut(firebaseAuth)}>
            <FaPowerOff />
          </button>
        </div>
      </nav>
    </Container>
  );
}

const Container = styled.div`
  .scrolled {
    background-color: black;
  }
  nav {
    position: sticky;
    top: 0;
    height: 6.5rem;
    width: 100%;
    justify-content: space-between;
    position: fixed;
    top: 0;
    z-index: 2;
    padding: 0 4rem;
    align-items: center;
    transition: 0.3s ease-in-out;
    .left {
      gap: 2rem;
      .brand {
        img {
          height: 4rem;
        }
      }
      .links {
        list-style-type: none;
        gap: 2rem;
        li {
          a {
            color: white;
            text-decoration: none;
          }
        }
      }
    }
    .right {
      gap: 1rem;
      button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        svg {
          color: #fff;
          font-size: 1.2rem;
        }
      }
      .search {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.2rem 0.4rem;
        border: 1px solid transparent;
        transition: border 0.3s ease-in-out;
        form {
          display: flex;
          align-items: center;
        }
        input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 1rem;
          padding: 0.2rem;
          width: 0;
          transition: width 0.3s ease-in-out;
        }
        button {
          border: none;
          background: transparent;
          cursor: pointer;
          outline: none;
          svg {
            color: white;
            font-size: 1.2rem;
          }
        }
      }
      .show-search {
        border: 1px solid white;
        input {
          width: 10rem;
          padding-left: 0.4rem;
        }
      }
    }
  }
`;
