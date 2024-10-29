import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Row, Col, Form, Carousel, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function ProductView(){

    const notyf = new Notyf();

    const { productId } = useParams();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [imageLinks, setImageLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`${process.env.REACT_APP_BASE_URL}/products/${productId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
                setImageLinks(data.imageLinks || []);
            }
            setLoading(false);
        })
        .catch(err => {
            setError('Failed to fetch product data');
            setLoading(false);
        });
    }, [productId]);

    useEffect(() => {
        setTotalPrice(price * quantity);
    }, [price, quantity]);

    const handleQuantityChange = (e) => {
        const qty = parseInt(e.target.value, 10);
        if (isNaN(qty) || qty < 1) {
            notyf.error('Quantity must be at least 1');
            setQuantity(1);
        } else {
            setQuantity(qty);
        }
    };

    function addToCart(productId){
        const token = localStorage.getItem('token');
        if (!token) {
            notyf.error('You must be logged in to add to cart');
            navigate('/login');
            return;
        }
        if (quantity < 1) {
            notyf.error('Quantity must be at least 1');
            return;
        }
        fetch(`${process.env.REACT_APP_BASE_URL}/cart/add-to-cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ token }`
            },
            body: JSON.stringify({
                productId:  productId,
                price: price,
                quantity: quantity,
                subtotal: price * quantity,
                totalPrice: totalPrice
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error){
                notyf.error(data.error);
            } else if (data.message === 'Item added to cart successfully') {
                notyf.success("Item added to cart successfully");
                navigate("/products");
            } else {
                notyf.error("Internal Server Error. Notify System Admin.");
            }
        })
        .catch(err => {
            notyf.error('Failed to add item to cart');
        });
    }

    if (loading) {
        return (
            <Container className="d-flex justify-content-center mt-5">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col lg={{ span: 6, offset: 3}}>
                    <Card>
                        <Card.Body className="text-start">
                            <Card.Title>{name}</Card.Title>
                            <Card.Subtitle>Description:</Card.Subtitle>
                            <Card.Text>{description}</Card.Text>
                            <Card.Subtitle>Price:</Card.Subtitle>
                            <Card.Text>
                                ₱{price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Card.Text>

                            {/* Carousel for Images */}
                            {imageLinks.length > 0 ? (
                                <>
                                    <Card.Subtitle>Images:</Card.Subtitle>
                                    <Carousel>
                                        {imageLinks.map((image, index) => (
                                            <Carousel.Item key={index}>
                                            <img
                                                    className="d-block"
                                                    src={image}
                                                    alt={`Slide ${index}`}
                                                    style={{ height: '300px', objectFit: 'contain', margin: '0 auto' }}
                                                />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                </>
                            ) : (
                                <p>No images available.</p>
                            )}

                            <Form.Group className="mt-3">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    placeholder="Enter Quantity" 
                                    required
                                    min="1"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                />
                            </Form.Group>
                            <p>Total Price: ₱{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            { user && user.id ?
                            <Button variant="primary" className="mt-3" onClick={()=> addToCart(productId)}>
                                Add to cart
                            </Button>
                            :
                            <Link className="btn btn-warning mt-3" to="/login">Login to Add to Cart</Link>
                            }

                            <br></br>


                        </Card.Body>      
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
