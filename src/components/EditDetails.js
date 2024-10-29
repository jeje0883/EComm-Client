import React, { useState, useContext, useEffect } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';


const EditUserDetails = () => {
  const API_URL = process.env.REACT_APP_BASE_URL;

  const notyf = new Notyf();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [message, setMessage] = useState('');


  useEffect(() => {
    fetch(`${API_URL}/users/details`, {
        headers: {
            Authorization: `Bearer ${ localStorage.getItem('token') }`
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        // Set the user states values with the user details upon successful login.
        if (typeof data !== undefined) {
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setMobileNo(data.mobileNo);

        } else if (data.error === "User not found") {
            notyf.error("User not found.")
        } else {
            notyf.error("Something Went Wrong. Contact Your System Admin.")
        }
    });
}, [])


  const handleEditDetails = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Replace with your actual JWT token
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName, mobileNo }),
      });

      if (response.ok) {
        setMessage('Details updated successfully');
        // Optionally, fetch updated user details here
      } else {
        const errorData = await response.json();
        setMessage(errorData.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Edit Details</h2>
      <form onSubmit={handleEditDetails}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="mobileNo" className="form-label">
            Mobile No
          </label>
          <input
            type="text"
            className="form-control"
            id="mobileNo"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            required
          />
        </div>
        {message && <div className="alert alert-danger">{message}</div>}
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditUserDetails;
