import { Container, Col, Row } from 'react-bootstrap';
import CartTable from '../components/CartTable';

export default function Cart() {
    return (
        <Container className='my-5'>
            <Row className="justify-content-center">
                <Col lg={8}>
                    <CartTable />
                </Col>
            </Row>
        </Container>
    );
}
