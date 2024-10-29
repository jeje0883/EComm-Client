
import { useState, useEffect, useContext } from 'react';
import UserContext from '../context/UserContext';
import { Link } from 'react-router-dom';
import { Container, ListGroup, Card, Spinner } from 'react-bootstrap';

export default function OrdersCard() {
  const { user } = useContext(UserContext); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUrl =`${process.env.REACT_APP_BASE_URL}/orders/my-orders`;

    fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`orders: ${JSON.stringify(data.orders)}`);
        if (data.orders && data.orders.length > 0) {
          setOrders(data.orders);
        }
        setLoading(false); 
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        setLoading(false); 
      });
  }, [user.isAdmin]); // Add user.isAdmin as a dependency to ensure the effect runs when it changes

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }


  return (
    <Container className="my-5">
      {orders.length === 0 ? (
        <div className="text-center">
          <h4>No orders placed yet! <Link to='/products'>Start shopping</Link></h4>
        </div>
      ) : (
        <>
          <h4 className="mb-4 text-center">Orders History</h4>
          {orders.map((order, index) => (
            <Card key={order._id} className="mb-4 shadow-sm">
              <Card.Header className="bg-secondary text-light">
                Order #{index + 1} - Purchased on: {new Date(order.orderedOn).toLocaleDateString()}
              </Card.Header>
              <Card.Body>
                <h6>Items:</h6>
                <ListGroup variant="flush">
                    {order.productsOrdered.map((product) => (
                      <ListGroup.Item key={product._id}>
                        {product.productId ? (
                          <>
                            {product.productId.name} - Quantity: {product.quantity}
                          </>
                        ) : (
                          <>Unknown Product - Quantity: {product.quantity}</>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                <h6 className="mt-3">Total: ₱{order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h6>
              </Card.Body>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
}
