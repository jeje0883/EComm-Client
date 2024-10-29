
import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PreviewProducts(props) {
  const { breakPoint, data } = props;
  const { _id, name, description, price, imageLinks } = data;

  const trimmedDescription = description.slice(0, 120) + '...';

  // Use the first image from imageLinks or a placeholder
  const productImage =
    imageLinks && imageLinks.length > 0
      ? imageLinks[0]
      : 'https://via.placeholder.com/300';

  return (
    <Col xs={12} md={breakPoint} className="mb-4">
      <Card className="h-100 shadow-sm hover-shadow">
        <Card.Img
          variant="top"
          src={productImage}
          alt={name}
          style={{ height: '200px', objectFit: 'cover' }}
          loading="lazy"
        />
        <Card.Body>
          <Card.Title className="text-center">
            <Link to={`/products/${_id}`} className="text-decoration-none text-dark">
              {name}
            </Link>
          </Card.Title>
          <Card.Text className="text-muted">
            {trimmedDescription}
          </Card.Text>
        </Card.Body>
        <Card.Footer className="bg-white">
          <h5 className="text-center text-primary">
            ₱{price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h5>
          <Link className="btn btn-outline-primary d-block mt-2" to={`/products/${_id}`}>
            View Details
          </Link>
        </Card.Footer>
      </Card>
    </Col>
  );
}
