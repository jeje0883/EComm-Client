import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import { Container } from 'react-bootstrap';

export default function Home() {
    const data = {
        title: "Jay's Shop",
        content: "Products for everyone, everywhere",
        destination: "/products",
        buttonLabel: "Browse Products!"
    };

    return (
        <Container className="mt-5">
            <Banner data={data} />
            <FeaturedProducts />
        </Container>
    );
}
