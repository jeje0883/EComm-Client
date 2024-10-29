import { useState, useEffect, useContext } from 'react';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import { Table, Button,  Spinner } from 'react-bootstrap';
import 'notyf/notyf.min.css';

export default function OrdersCard() {
  const { user } = useContext(UserContext);
  const notyf = new Notyf();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

 


  useEffect(() => {
    const fetchUrl = `${process.env.REACT_APP_BASE_URL}/orders/all-orders`;
 

    fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.orders && data.orders.length > 0) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        notyf.error('Failed to fetch orders.');
        setLoading(false);
      });
  }, [user.isAdmin]);


  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h4 className="text-center mb-4">{user.isAdmin ? 'All Orders' : 'My Orders'}</h4>
      {orders.length === 0 ? (
        <div className="text-center">
          <h5>No orders found.</h5>
          {!user.isAdmin && (
            <Button onClick={() => navigate('/products')}>Start Shopping</Button>
          )}
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="table-striped">
            <thead className="bg-dark text-white">
              <tr>
                <th>Order ID</th>
                {/* <th>User Email</th> */}
                <th>Ordered On</th>
                <th>Products Ordered</th>
                <th>Total Price</th>
                <th>Status</th>
           
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  {/* <td>{order.userId.email}</td> */}
                  <td>{new Date(order.orderedOn).toLocaleDateString()}</td>
                  <td>
                    <ul>
                      {order.productsOrdered.map((product) => (
                        <li key={product._id}>
                          {product.productId
                            ? `${product.productId.name} (x${product.quantity})`
                            : `Unknown Product (x${product.quantity})`}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    ₱
                    {order.totalPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>{order.status}</td>

                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}


    </div>
  );
}
