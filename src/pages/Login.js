import { useState, useContext, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function Login() {
    const notyf = new Notyf();
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    function authenticate(e) {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.access) {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
                notyf.success('Login successful');
                setEmail('');
                setPassword('');
            } else {
                notyf.error(data.message || 'Login failed. Please try again.');
            }
        });
    }

    function retrieveUserDetails(token) {
        fetch(`${process.env.REACT_APP_BASE_URL}/users/details`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.user && data.user._id) {
                setUser({ id: data.user._id, isAdmin: data.user.isAdmin });
            } else {
                notyf.error('Failed to retrieve user details.');
            }
        });
    }

    useEffect(() => {
        if (email !== '' && password !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);

    if (user.id !== null) {
        return <Navigate to="/products" />;
    }

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h1 className="text-center mb-4">Login</h1>
                    <Form onSubmit={authenticate} className="p-4 border rounded bg-light">
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Enter email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={!isActive}>
                            Login
                        </Button>
                        <div className="mt-3">
                            Don't have an account yet? <Link to="/register">Register here</Link>.
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
