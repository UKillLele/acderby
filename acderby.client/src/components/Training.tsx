import { Container, Row, Col } from "react-bootstrap"


const Training = () => {
    return (
        <Container fluid className="content bg-dark text-light">
            <Row className="m-5">
                <Col className="my-auto">
                    <h1 className="xl-title my-5 text-shadow">Training</h1>
                </Col>
            </Row>
            <Row className="my-5">
                <Col>
                    <h2 className="fs-1">Join</h2>
                </Col>
                <Col>
                    <h2 className="fs-1">Visit</h2>
                </Col>
            </Row>
        </Container>
    )
}

export default Training