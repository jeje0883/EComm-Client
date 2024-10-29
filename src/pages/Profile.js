import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import ResetPassword from '../components/ResetPassword';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function Profile() {

    const notyf = new Notyf();
    const { user } = useContext(UserContext);
    const [details, setDetails] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [isEditing, setIsEditing] = useState(false); 
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNo: '',
    }); 

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data && data.user) {
                    setDetails(data.user);
                    setFormData({
                        firstName: data.user.firstName,
                        lastName: data.user.lastName,
                        email: data.user.email,
                        mobileNo: data.user.mobileNo,
                    });
                } else {
                    notyf.error(data.error || 'Failed to retrieve user details.');
                }
                setLoading(false);
            })
            .catch((error) => {
                notyf.error('Something went wrong. Please contact your system admin.');
                setLoading(false);
            });
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false); 
       
        setFormData({
            firstName: details.firstName,
            lastName: details.lastName,
            mobileNo: details.mobileNo,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === 'Profile updated successfully') {
                    notyf.success('Profile updated successfully.');
                    setDetails({
                        ...details,
                        ...formData,
                    });
                    setIsEditing(false);
                } else {
                    notyf.error(data.error || 'Failed to update profile.');
                }
            })
            .catch((error) => {
                notyf.error('Something went wrong while updating your profile.');
            });
    };


    if (user.id === null) {
        return <Navigate to="/login" />;
    }


    if (loading) {
        return (
          <Container className="d-flex justify-content-center mt-5">
            <Spinner animation="border" variant="primary" />
          </Container>
        );
      }

    return (
        <Container className="mt-5 p-5 bg-light text-dark">
            <Row>
                <Col className="p-5 bg-white shadow-sm rounded">
                    <h1 className="my-5">Profile</h1>
                    {isEditing ? (
                        // Edit Profile Form
                        <Form onSubmit={handleSaveChanges}>
                            <Form.Group>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Mobile No</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="mobileNo"
                                    value={formData.mobileNo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="success" type="submit" className="mt-3">
                                Save Changes
                            </Button>
                            <Button variant="secondary" className="mt-3 ml-2" onClick={handleCancelEdit}>
                                Cancel
                            </Button>
                        </Form>
                    ) : (
    
                        <>
                            <h2 className="mt-3">{`${details.firstName} ${details.lastName}`}</h2>
                            <hr />
                            <h4>Contacts</h4>
                            <ul>
                                <li>Email: {details.email}</li>
                                <li>Mobile No: {details.mobileNo}</li>
                            </ul>
                            <Button variant="primary" onClick={handleEditClick}>
                                Edit Profile
                            </Button>
                        </>
                    )}
                </Col>
            </Row>
            <Row className="pt-4 mt-4">
                <Col>
                    <ResetPassword />
                </Col>
            </Row>
        </Container>
    );
}
