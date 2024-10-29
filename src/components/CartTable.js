import { useEffect, useContext, useState } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import UserContext from '../context/UserContext';
import { Link } from 'react-router-dom';
import { Table, Button, Form, Container, Spinner } from 'react-bootstrap';

export default function CartTable() {
    // const { user } = useContext(UserContext);
    const notyf = new Notyf();
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [tempQuantities, setTempQuantities] = useState({});
    const [loading, setLoading] = useState(true); //

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${process.env.REACT_APP_BASE_URL}/cart/get-cart`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.cart.cartItems) {
                        setCart(data.cart.cartItems);
                        setTempQuantities(
                            data.cart.cartItems.reduce((acc, item) => {
                                acc[item.productId._id] = item.quantity;
                                return acc;
                            }, {})
                        );
                        calculateTotal(data.cart.cartItems);
                    } else {
                        notyf.error("Your cart is empty.");
                    }
                    setLoading(false); // Stop loading after data is fetched
                })
                .catch((error) => {
                    // console.error('Error fetching cart:', error);
                    // notyf.error("Failed to fetch cart.");
                    setLoading(false); // Stop loading on error
                });
        }
    }, []);

    const calculateTotal = (cartItems) => {
        const totalAmount = cartItems.reduce((acc, item) => acc + item.quantity * item.productId.price, 0);
        setTotal(totalAmount);
    };

    const handleInputChange = (event, productId) => {
        const value = event.target.value;
        setTempQuantities({
            ...tempQuantities,
            [productId]: value,
        });
    };

    const handleInputBlur = (event, productId) => {
        let newQuantity = parseInt(event.target.value, 10);
        if (isNaN(newQuantity) || newQuantity <= 0) {
            notyf.error('Please enter a valid quantity.');
            newQuantity = 1;
        }

        const updatedCart = cart.map(item => {
            if (item.productId._id === productId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        setCart(updatedCart);
        setTempQuantities({ ...tempQuantities, [productId]: newQuantity });
        calculateTotal(updatedCart);
        updateCartQuantity(productId, newQuantity);
    };

    const updateCartQuantity = (productId, newQuantity) => {
        const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_BASE_URL}/cart/update-cart-quantity`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, newQuantity }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === 'Item quantity updated successfully') {
                    notyf.success('Cart updated successfully.');
                } else {
                    notyf.error(data.error || 'Failed to update cart.');
                }
            })
            .catch((error) => {
                console.error('Error updating cart:', error);
                notyf.error('Failed to update cart.');
            });
    };

    const handleCheckOut = (event) => {
        event.preventDefault();
        fetch(`${process.env.REACT_APP_BASE_URL}/orders/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(res => res.json())
        .then((data) => {
            if (data.message === 'Ordered Successfully') {
                notyf.success('Order placed successfully.');
                setCart([]);
                setTotal(0);
            } else {
                notyf.error(data.error || 'Failed to place order.');
            }
        });
    };

    const handleRemoveItem = (event, id) => {
        fetch(`${process.env.REACT_APP_BASE_URL}/cart/${id}/remove-from-cart`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'Item removed from cart successfully') {
                notyf.success('Item removed successfully.');
                const updatedCart = cart.filter(item => item.productId._id !== id);
                setCart(updatedCart);
                calculateTotal(updatedCart);
            } else {
                notyf.error(data.error || 'Failed to remove item.');
            }
        })
        .catch(error => {
            console.error('Error removing item from cart:', error);
            notyf.error('Failed to remove item.');
        });
    };

    const handleClearCart = () => {
        fetch(`${process.env.REACT_APP_BASE_URL}/cart/clear-cart`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'Cart cleared successfully') {
                notyf.success('Cart cleared successfully.');
                setCart([]);
                setTempQuantities({});
                calculateTotal([]);
            } else {
                notyf.error(data.error || 'Failed to clear cart.');
            }
        });
    };

    if (loading) {
        return (
          <Container className="d-flex justify-content-center mt-5">
            <Spinner animation="border" variant="primary" />
          </Container>
        );
      }

    return (
        <>
        { cart.length === 0 ? (
            <div className='text-center'>
                <h4>Your cart is empty! <Link to='/products'>Start shopping</Link></h4>
            </div>
        ) : (
            <>
                <h3>Your Shopping Cart</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map(product => (
                            <tr key={product.productId._id}
                                style={{ 
                                        backgroundImage: `url(${product.productId.imageLink})`, 
                                        backgroundSize: 'cover', 
                                        backgroundPosition: 'center' 
                                    }}>
                                <td><Link to={`/products/${product.productId._id}`}>{product.productId.name}</Link></td>
                                <td>₱{product.productId.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={tempQuantities[product.productId._id] || ''}
                                        onChange={(e) => handleInputChange(e, product.productId._id)}
                                        onBlur={(e) => handleInputBlur(e, product.productId._id)}
                                    />
                                </td>
                                <td>₱{(product.quantity * product.productId.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td>
                                    <Button variant="danger" onClick={(e) => handleRemoveItem(e, product.productId._id)}>
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="3"></td>
                            <td>Total: ₱{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td>
                                <Button variant="success" onClick={handleCheckOut}>
                                    Checkout
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <Button variant="danger" onClick={handleClearCart}>
                    Clear Cart
                </Button>
            </>
        )}
        </>
    );
}
