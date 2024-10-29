import { useState, useEffect, useContext } from 'react';
// import AdminView from '../components/AdminView';
import UserViewProd from '../components/UserViewProd';
import UserContext from '../context/UserContext';
import AdminDashboard from '../components/AdminDashboard';
import { Container, Spinner } from 'react-bootstrap';

export default function Products() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    fetch(`${process.env.REACT_APP_BASE_URL}/products/active`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      {user.isAdmin === true ? (
        <AdminDashboard productsData={products} />
      ) : (
        <UserViewProd productsData={products} />
      )}
    </Container>
  );
}
