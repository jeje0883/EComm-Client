
import { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  // const [showPrice, setShowPrice] = useState(true);

  const handleSearchByName = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products/search-by-name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: searchQuery }),
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching for products:', error);
    }
  };

  const handleSearchByPrice = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products/search-by-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          minPrice: minPrice,
          maxPrice: maxPrice,
        }),
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching for products:', error);
    }
  };

  const clearEntries = () => {
    setSearchQuery('');
    setSearchResults([]);
    setMinPrice(0);
    setMaxPrice(100000);
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Search Products</h2>
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group controlId="productName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="minPrice">
            <Form.Label>Min Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter min price"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="maxPrice">
            <Form.Label>Max Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter max price"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="text-center">
        <Col>
          <Button variant="primary" className="me-2" onClick={handleSearchByName}>
            Search by Name
          </Button>
          <Button variant="primary" className="me-2" onClick={handleSearchByPrice}>
            Search by Price
          </Button>
          <Button variant="danger" onClick={clearEntries}>
            Clear
          </Button>
        </Col>
      </Row>

      <h3 className="text-center mt-4">Search Results</h3>
      {searchResults.length === 0 ? (
        <p className="text-center text-muted">No matching products found.</p>
      ) : (
        <ol className="list-unstyled">
          {searchResults.map((product) => (
            <li key={product._id} className="mb-2">
              <Link to={`/products/${product._id}`} className="text-decoration-none">
                {product.name} - ₱{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </Container>
  );
};

export default ProductSearch;
