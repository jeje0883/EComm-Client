
import './App.css';
import { useEffect, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserContext } from './context/UserContext'; // Import UserContext
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Error from './pages/Error';
import Profile from './pages/Profile';
import ProductView from './pages/ProductView';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Users from './pages/Users';

function App() {
  // Use context to get user functions

  console.log(`Connecting to API: `,process.env.REACT_APP_API_URL);

  const { user, setUser, unsetUser } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user.id) {
      fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser({
              id: data.user._id,
              isAdmin: data.user.isAdmin,
            });
          } else {
            unsetUser();
          }
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
          unsetUser();
        });
    }
  }, [user.id, setUser, unsetUser]); // Add dependencies

  return (
    // <UserProvider>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<ProductView />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<Users />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    // </UserProvider>
  );
}

export default App;
