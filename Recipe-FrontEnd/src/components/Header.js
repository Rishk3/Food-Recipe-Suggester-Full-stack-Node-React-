import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AXIOS_API from '../utils/api';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();

  // Debounce function to delay the search request
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 100);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length > 1) {
      const fetchSuggestions = async () => {
        try {
          const response = await AXIOS_API.get('/dishes/common/search', {
            params: { query: debouncedQuery },
          });
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching search suggestions:', error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]); // Clear suggestions when query is too short
    }
  }, [debouncedQuery]);

  const handleSelect = (name) => {
    navigate(`/dish/${name}`);
    setQuery('');
    setSuggestions([]);
  };

  return (
    <header className="header">
      <nav>
        <NavLink to="/" exact activeClassName="active-link">
          Home
        </NavLink>

        <div className="search-container">
          <input
            type="text"
            value={query}
            placeholder="Search by name, ingredients, and origin..."
            onChange={(e) => setQuery(e.target.value)}
          />
          {suggestions.length > 0 ? (
            <ul className="suggestions">
              {suggestions.map((dish) => (
                <li key={dish.name} onClick={() => handleSelect(dish.name)}>
                  {dish.name}
                </li>
              ))}
            </ul>
          ) : (
            query && (
              <ul className="suggestions">
                <li>No items found...</li>
              </ul>
            )
          )}
        </div>

        <NavLink to="/suggester" activeClassName="active-link">
          Dish Suggester
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
