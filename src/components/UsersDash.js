

import { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import UserContext from '../context/UserContext';

export default function UsersDash() {
    const notyf = new Notyf();
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); 
    const { user } = useContext(UserContext);

    // Fetch users once on component mount
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URL}/users/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
        .then(response => response.json())
        .then(data => setAllUsers(data))
        .catch(error => console.error('Error fetching users:', error));
    }, []); // Empty dependency array ensures this runs only once on mount

    // Function to handle role change and send API call
    const handleRoleChange = (id) => {
        // Update the role on the server
        fetch(`${process.env.REACT_APP_BASE_URL}/users/${id}/set-as-admin`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
        .then(res => {
            // Log the raw response object
            console.log('Response status:', res.status);
            console.log('Response body:', res.dob);
            return res.json();
        })
        .then((data) => {
            console.log('Response data:', data); // Log the data received
    
            if (data.message === 'User updated successfully') {
                notyf.success(data.message);
    
                // Update the allUsers state to reflect the role change
                setAllUsers(prevUsers =>
                    prevUsers.map(user =>
                        user._id === id ? { ...user, isAdmin: true } : user // Update the specific user
                    )
                );
            } else {
                notyf.error('Failed to update the user role.');
            }
        })
        .catch(error => {
            console.error('Error updating role:', error);
            notyf.error('An error occurred while updating the role.');
        });
    };
    
    const filteredUsers = allUsers.filter((user) => {
        return (
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        user && user.isAdmin ? ( // Check if users exists and isAdmin is true
            <div className="container mt-5">
                <h4 className="mb-4">Users Dashboard</h4>
    
                {/* Search box to update search term */}
                <input 
                    type="text" 
                    className="form-control mb-4" 
                    placeholder="Search users..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
                />
    
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.sort((a, b) => {
                                // Sort by role first (admin first, then user), then by last name
                                if (a.isAdmin === b.isAdmin) {
                                    return a.lastName.localeCompare(b.lastName);
                                } else {
                                    return a.isAdmin ? -1 : 1;
                                }
                            })
                            .map((user, index) => (
                                <tr key={user._id}>  {/* Provide a unique key */}
                                    <td>{index + 1}</td> {/* Adjust index to start from 1 */}
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.mobileNo}</td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-outline-primary"
                                            disabled={user.isAdmin}
                                            onClick={() => handleRoleChange(user._id)}
                                        >
                                            {user.isAdmin ? 'Admin' : 'User'} 
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        ) : null // Return null if users.isAdmin is false
    );
}