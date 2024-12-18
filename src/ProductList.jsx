import React, { useEffect, useState } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Gửi yêu cầu đến API của backend
    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;