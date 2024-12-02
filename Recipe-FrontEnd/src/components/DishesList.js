import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AXIOS_API from '../utils/api';

const DishesList = () => {
  const [dishes, setDishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState('none');
  const [sortOrder, setSortOrder] = useState('none');
  const [filters, setFilters] = useState({ diet: '', state: '', flavor: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await AXIOS_API.get('/dishes');
        setDishes(response.data);
      } catch (error) {
        console.error('Error fetching the dishes data:', error);
      }
    };
    fetchDishes();
  }, []);

  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(order);

    setDishes((prevDishes) =>
      [...prevDishes].sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];

        if (valueA === 'N/A') return 1;
        if (valueB === 'N/A') return -1;

        const numA = Number(valueA);
        const numB = Number(valueB);

        if (!isNaN(numA) && !isNaN(numB)) {
          return order === 'asc' ? numA - numB : numB - numA;
        }

        return order === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      })
    );
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1); // Reset pagination on filter change
  };

  const filteredDishes = useMemo(() => {
    return dishes
      .filter((dish) => !filters.diet || dish.diet === filters.diet)
      .filter((dish) => !filters.state || dish.state === filters.state)
      .filter(
        (dish) => !filters.flavor || dish.flavor_profile === filters.flavor
      )
      .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [dishes, filters, currentPage, rowsPerPage]);

  const uniqueOptions = useMemo(
    () => (key) =>
      [
        ...new Set(
          dishes
            .map((dish) => dish[key])
            .filter((value) => value && value !== 'N/A' && value !== '-1')
        ),
      ],
    [dishes]
  );

  return (
    <div>
      <h2>All Dishes</h2>

      {/* Filter Controls */}
      <div className="filters">
        <select
          value={filters.diet}
          onChange={(e) => handleFilterChange('diet', e.target.value)}
        >
          <option value="">All Diets</option>
          {uniqueOptions('diet').map((diet) => (
            <option key={diet} value={diet}>
              {diet}
            </option>
          ))}
        </select>

        <select
          value={filters.state}
          onChange={(e) => handleFilterChange('state', e.target.value)}
        >
          <option value="">All States</option>
          {uniqueOptions('state').map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          value={filters.flavor}
          onChange={(e) => handleFilterChange('flavor', e.target.value)}
        >
          <option value="">All Flavors</option>
          {uniqueOptions('flavor_profile').map((flavor) => (
            <option key={flavor} value={flavor}>
              {flavor}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Name {sortKey === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th>Diet</th>
            <th onClick={() => handleSort('prep_time')}>
              Prep Time{' '}
              {sortKey === 'prep_time' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('cook_time')}>
              Cook Time{' '}
              {sortKey === 'cook_time' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredDishes.map((dish) => (
            <tr key={dish.name} onClick={() => navigate(`/dish/${dish.name}`)}>
              <td>{dish.name}</td>
              <td>{dish.diet}</td>
              <td>{dish.prep_time} mins</td>
              <td>{dish.cook_time} mins</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          &lt; Prev
        </button>

        <span>
          Page {currentPage} of {Math.ceil(dishes.length / rowsPerPage)}
        </span>

        <button
          disabled={currentPage * rowsPerPage >= dishes.length}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
};

export default DishesList;
