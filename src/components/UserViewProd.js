


import { useState, useEffect } from 'react'; 
import ProductCard from './ProductCard';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
// import ProductSearch from './ProductSearch';

export default function UserViewProd({ productsData }) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [filters, setFilters] = useState({
    searchQuery: '',
    minPrice: '',
    maxPrice: '',
    // Add other filters here
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10); // Default to 10 products per page

  useEffect(() => {
    // Initially set the filtered products
    setFilteredProducts(productsData.filter(product => product.isActive));
  }, [productsData]);

  useEffect(() => {
    // Apply filters and sorting whenever filters or sortOption changes
    let updatedProducts = productsData.filter(product => product.isActive);

    // Apply search filter (includes description)
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      updatedProducts = updatedProducts.filter(product =>
        (product.name && product.name.toLowerCase().includes(searchLower)) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply price range filter
    if (filters.minPrice !== '' || filters.maxPrice !== '') {
      updatedProducts = updatedProducts.filter(product => {
        const price = product.price;
        const minPrice = parseFloat(filters.minPrice);
        const maxPrice = parseFloat(filters.maxPrice);

        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
          return price >= minPrice && price <= maxPrice;
        } else if (!isNaN(minPrice)) {
          return price >= minPrice;
        } else if (!isNaN(maxPrice)) {
          return price <= maxPrice;
        } else {
          return true;
        }
      });
    }

    // Apply other filters if any

    // Apply sorting
    if (sortOption === 'priceAsc') {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'nameAsc') {
      updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'nameDesc') {
      updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(updatedProducts);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, sortOption, productsData]);

  // Get current products based on pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleProductsPerPageChange = (e) => {
    setProductsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when products per page changes
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const productCards = currentProducts.map(product => (
    <Col xl={3} lg={4} md={6} sm={12} xs={12} key={product._id} className="mb-4">
      <ProductCard productProp={product} />
    </Col>
  ));

  return (
    <Container fluid>
      {/* <ProductSearch /> */}
      <h3 className="text-center p-5">Our Products</h3>
      <Form className="mb-4">
        <Row>
          <Col md={3} className="mb-2">
            <Form.Control
              type="text"
              placeholder="Search products..."
              name="searchQuery"
              value={filters.searchQuery}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2} className="mb-2">
            <Form.Control
              type="number"
              placeholder="Min Price"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2} className="mb-2">
            <Form.Control
              type="number"
              placeholder="Max Price"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2} className="mb-2">
            <Form.Control as="select" value={sortOption} onChange={handleSortChange}>
              <option value="">Sort By</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A to Z</option>
              <option value="nameDesc">Name: Z to A</option>
            </Form.Control>
          </Col>
          <Col md={2} className="mb-2">
            <Form.Control as="select" value={productsPerPage} onChange={handleProductsPerPageChange}>
              <option value="10">Show 10</option>
              <option value="20">Show 20</option>
              <option value="50">Show 50</option>
            </Form.Control>
          </Col>
        </Row>
      </Form>
      <Row>{productCards}</Row>
      {/* Pagination */}
      {totalPages > 1 && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <ul className="pagination">
              {pageNumbers.map(number => (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                  <Button variant="link" className="page-link" onClick={() => paginate(number)}>
                    {number}
                  </Button>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      )}
    </Container>
  );
}
