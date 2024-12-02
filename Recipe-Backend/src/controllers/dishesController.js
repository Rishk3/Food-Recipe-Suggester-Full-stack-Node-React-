const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

// Path to the CSV file
const csvFilePath = path.join(__dirname, '../../data/indian_food.csv');

// Function to load CSV and convert to JSON
const loadDishesFromCsv = () => {
  return new Promise((resolve, reject) => {
    const dishes = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Map row data to ensure proper defaults
        const rowData = {
          name: row.name || 'N/A',
          ingredients: row.ingredients || 'N/A',
          diet: row.diet || 'N/A',
          prep_time:
            row.prep_time && row.prep_time !== '-1' ? row.prep_time : 'N/A',
          cook_time:
            row.cook_time && row.cook_time !== '-1' ? row.cook_time : 'N/A',
          flavor_profile: row.flavor_profile || 'N/A',
          course: row.course || 'N/A',
          state: row.state && row.state !== '-1' ? row.state : 'N/A',
          region: row.region && row.region !== '-1' ? row.region : 'N/A',
        };
        dishes.push(rowData);
      })
      .on('end', () => resolve(dishes))
      .on('error', (err) => reject(err));
  });
};

// Search functionality: Search by name, ingredients, or region
exports.searchDishes = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ message: 'Please provide a search query' });

    const dishes = await loadDishesFromCsv();
    const searchQuery = query.toLowerCase(); // Case-insensitive search

    // Filter dishes based on name, ingredients, or region
    const filteredDishes = dishes.filter(
      (dish) =>
        dish.name.toLowerCase().includes(searchQuery) ||
        dish.ingredients.toLowerCase().includes(searchQuery) ||
        dish.state.toLowerCase().includes(searchQuery)
    );

    res.status(200).json(filteredDishes);
  } catch (error) {
    res.status(500).json({ message: 'Error searching dishes', error });
  }
};

// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await loadDishesFromCsv();
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'Error loading dishes', error });
  }
};

// Get a specific dish by name
exports.getDishByName = async (req, res) => {
  try {
    const { name } = req.params;
    const dishes = await loadDishesFromCsv();
    const dish = dishes.find(
      (dish) => dish.name.toLowerCase() === name.toLowerCase()
    );

    if (dish) {
      res.status(200).json(dish);
    } else {
      res.status(404).json({ message: 'Dish not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error });
  }
};

// Get dishes by ingredients
exports.getDishesByIngredients = async (req, res) => {
  try {
    const { ingredients } = req.query;
    if (!ingredients)
      return res.status(400).json({ message: 'Please provide ingredients' });

    const inputIngredients = ingredients
      .split(',')
      .map((ing) => ing.trim().toLowerCase());
    const dishes = await loadDishesFromCsv();

    // Filter dishes that match all provided ingredients
    const matchedDishes = dishes.filter((dish) =>
      inputIngredients.every((ing) =>
        dish.ingredients.toLowerCase().includes(ing)
      )
    );

    res.status(200).json(matchedDishes);
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error });
  }
};

// Get all ingredients (distinct list from all dishes)
exports.getAllIngredients = async (req, res) => {
  try {
    const dishes = await loadDishesFromCsv();
    const ingredients = [
      ...new Set(dishes.flatMap((dish) => dish.ingredients.split(','))),
    ].filter(Boolean);
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ingredients', error });
  }
};
