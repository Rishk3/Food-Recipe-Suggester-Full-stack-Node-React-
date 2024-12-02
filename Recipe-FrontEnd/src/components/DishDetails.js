import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AXIOS_API from '../utils/api';

const DishDetails = () => {
  const { name } = useParams();
  const [dish, setDish] = useState(null);

  useEffect(() => {
    const fetchDishDetails = async () => {
      try {
        const response = await AXIOS_API.get(`/dishes/${name}`);
        setDish(response.data);
      } catch (error) {
        console.error('Error fetching the dish details:', error);
      }
    };
    fetchDishDetails();
  }, [name]);

  if (!dish) return <p>Loading...</p>;

  return (
    <div className="dish_details">
      <h3>{dish.name}</h3>
      <p>Ingredients: {dish.ingredients}</p>
      <p>Diet: {dish.diet}</p>
      <p>Prep Time: {dish.prep_time} mins</p>
      <p>Cook Time: {dish.cook_time} mins</p>
      <p>Flavor: {dish.flavor_profile}</p>
      <p>Course: {dish.course}</p>
      <p>State: {dish.state}</p>
      <p>Region: {dish.region}</p>
    </div>
  );
};

export default DishDetails;
