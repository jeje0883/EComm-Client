

import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProductCard({ productProp }) {
  const { _id, name, description, price, imageLinks } = productProp;
  const trimmedDescription = description.slice(0, 120) + '...';

  // Use the first image in the imageLinks array, or a placeholder image if none exists
  const productImage = imageLinks && imageLinks.length > 0 ? imageLinks[0] : 'https://via.placeholder.com/300';

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={productImage}
        alt={name}
        style={{ height: '200px', objectFit: 'cover' }}
        loading="lazy"
      />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{trimmedDescription}</Card.Text>
        <h5 className="text-primary">
          ₱{' '}
          {price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </h5>
        <Link to={`/products/${_id}`}>
          <Button variant="primary" className="mt-2">
            View Details
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
