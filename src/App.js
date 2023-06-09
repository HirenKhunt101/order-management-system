import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [responseData, setResponseData] = useState([]); // Used for store data which is fetch from api
  const [searchTerm, setSearchTerm] = useState(''); // Store search string

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://631945908e51a64d2be10770.mockapi.io/api/v1/allOrders');
        const jsonResponse = await response.json();
        setResponseData(jsonResponse);
        console.log(jsonResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // This function is used calculate the percentage of the apparel
  const calculateApparelPercentage = (item) => {
    let totalItem = 0;
    totalItem += item.countOfItemTypes.apparel ? item.countOfItemTypes.apparel : 0;
    totalItem += item.countOfItemTypes.grocery ? item.countOfItemTypes.grocery : 0;
    if (totalItem === 0) return 0;
    const percentage = (item.countOfItemTypes.apparel / totalItem) * 100;
    return percentage.toFixed(2);
  };

  // This function is used set search string to searchTerm state
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue); 
  };

  // searchProducts used to store the data which searched by user
  const searchedProducts = responseData.filter((item) =>
    item.orderDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // handleDelete function is delete complete row when user clicks on delete button of any row
  const handleDelete = (order) => {
    const updatedData = responseData.filter((item) => item !== order);
    setResponseData(updatedData);
  };

  return (
    <div className="App">
      <div className="header">
        <div className="header-name">
          <h2>Order Management System</h2>
        </div>
        <div className="searchContainer">
          <input
            className="header-search"
            type="text"
            placeholder="Search By Order Description"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="itemContainer">
        {Array.isArray(searchedProducts) ? (
          <table className="item-table">
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Order Description</th>
                <th>Count of item Types included in Order</th>
                <th>% of items in apparel</th>
                <th>Created By</th>
                <th>Created Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchedProducts.map((item) => (
                <tr>
                  <td>{Number(item.id) < 10 ? '0' + item.id : item.id}</td>
                  <td>{item.orderDescription}</td>
                  <td>
                    <span>
                      Apparel {item.countOfItemTypes.apparel ? item.countOfItemTypes.apparel : 0} Grocery{' '}
                      {item.countOfItemTypes.grocery ? item.countOfItemTypes.grocery : 0}
                    </span>
                  </td>
                  <td>{calculateApparelPercentage(item)}%</td>
                  <td>{item.createdBy}</td>
                  <td>{item.createdAt}</td>
                  <td>
                  <button onClick={() => handleDelete(item)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default App;
