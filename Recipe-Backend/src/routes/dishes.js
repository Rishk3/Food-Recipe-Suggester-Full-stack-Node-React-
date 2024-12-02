const express = require('express');
const router = express.Router();
const {
  getAllDishes,
  getDishByName,
  getDishesByIngredients,
  getAllIngredients,
  searchDishes,
} = require('../controllers/dishesController');

router.get('/', getAllDishes);
router.get('/:name', getDishByName);
router.get('/filter/by-ingredients', getDishesByIngredients);
router.get('/ingredients', getAllIngredients);
router.get('/common/search', searchDishes);

module.exports = router;
