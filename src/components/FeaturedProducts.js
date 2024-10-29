import { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import PreviewProducts from './PreviewProducts';

export default function FeaturedProducts() {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/products/active`)
      .then(res => res.json())
      .then(data => {
        const numbers = [];
        const featured = [];

        const generateRandomNums = () => {
          let randomNum = Math.floor(Math.random() * data.length);
          if (numbers.indexOf(randomNum) === -1) {
            numbers.push(randomNum);
          } else {
            generateRandomNums();
          }
        };

        for (let i = 0; i < 4; i++) {
          generateRandomNums();
          featured.push(data[numbers[i]]);
        }

        setPreviews(featured);
      });
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-5">Featured Products</h2>
      <Row>
        {previews.map((product) => (
          <PreviewProducts
            data={product}
            key={product._id}
            breakPoint={3}
          />
        ))}
      </Row>
    </Container>
  );
}
