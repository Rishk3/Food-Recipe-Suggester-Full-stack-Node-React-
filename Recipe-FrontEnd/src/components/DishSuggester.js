import React, { useState, useEffect, useMemo } from 'react';
import AXIOS_API from '../utils/api';

const DishSuggesterPage = () => {
  const [availableIngredients, setAvailableIngredients] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [suggestedDishes, setSuggestedDishes] = useState([]);
  const [ingredientSuggestions, setIngredientSuggestions] = useState([]);

  useEffect(() => {
    // Fetch all ingredients on initial load
    const fetchIngredients = async () => {
      try {
        const response = await AXIOS_API.get('/ingredients'); // Adjust endpoint for all available ingredients
        setIngredientSuggestions(response.data); // Populate available ingredient suggestions
      } catch (error) {
        console.error('Error fetching ingredient suggestions:', error);
      }
    };
    fetchIngredients();
  }, []);

  // Handle adding ingredients to the selected list
  const handleAddIngredient = () => {
    const trimmedIngredient = availableIngredients.trim();
    if (trimmedIngredient && !selectedIngredients.includes(trimmedIngredient)) {
      setSelectedIngredients((prev) => [...prev, trimmedIngredient]);
      setAvailableIngredients('');
    }
  };

  // Handle removing ingredients from the selected list
  const handleRemoveIngredient = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.filter((item) => item !== ingredient)
    );
  };

  // Fetch suggested dishes based on selected ingredients
  const handleSuggest = async () => {
    if (selectedIngredients.length === 0) return;

    try {
      const response = await AXIOS_API.get('/dishes/filter/by-ingredients', {
        params: { ingredients: selectedIngredients.join(',') },
      });
      setSuggestedDishes(response.data);
    } catch (error) {
      console.error('Error fetching suggested dishes:', error);
    }
  };

  // Memoize filtered ingredient suggestions to optimize performance
  const filteredSuggestions = useMemo(
    () =>
      ingredientSuggestions.filter((ingredient) =>
        ingredient.toLowerCase().includes(availableIngredients.toLowerCase())
      ),
    [availableIngredients, ingredientSuggestions]
  );

  return (
    <div className="recipe-suggester">
      <div>
        <input
          type="text"
          value={availableIngredients}
          onChange={(e) => setAvailableIngredients(e.target.value)}
          placeholder="Enter an ingredient"
        />
        <button onClick={handleAddIngredient}>Add Ingredient</button>

        {/* Ingredient suggestions dropdown */}
        {availableIngredients.length > 1 && (
          <ul>
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => setAvailableIngredients(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3>Selected Ingredients:</h3>
        <ul>
          {selectedIngredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient}{' '}
              <button onClick={() => handleRemoveIngredient(ingredient)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleSuggest}>Suggest Dishes</button>

      <div>
        <h3>Suggested Dishes:</h3>
        <ul>
          {suggestedDishes.length > 0 ? (
            suggestedDishes.map((dish) => (
              <li key={dish.name}>
                {dish.name} - {dish.ingredients}
              </li>
            ))
          ) : (
            <li>No dishes found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DishSuggesterPage;
