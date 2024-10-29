

import { Button, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Banner({ data }) {
    const { title, content, destination, buttonLabel } = data;

    return (
        <Container className="p-5 mb-5 bg-light rounded shadow">
            <Row className="justify-content-center text-center">
                <Col md={8}>
                    <h1 className="display-4 mb-3">{title}</h1>
                    <p className="lead mb-4">{content}</p>
                    <Link to={destination}>
                        <Button variant="primary" size="lg">
                            {buttonLabel}
                        </Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
}
