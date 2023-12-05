import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";


const Home = () => {
    return (
        <Container fluid className="content bg-img" style={{ backgroundImage: 'url("https://acrdphotos.blob.core.windows.net/photos/Season-Background.png")' }}>
            <Container fluid className="page-loader fw-bold">
                <Row className="align-items-center">
                    <Col>
                        <Row>
                            <Col>
                                <h2 className="xl-title mb-5 text-shadow">2024 Season Passes on sale now!</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="auto" className="mx-auto">
                                <Link className="btn btn-primary btn-lg shadow" to="tickets">Buy</Link>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                <p className="xl-title text-shadow text-center">2024 Season</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pe-5">
                                <p className="fs-1 text-shadow text-end">Feb 17</p>
                            </Col>
                            <Col className="ps-5">
                                <p className="fs-1 text-shadow">Mar 16</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pe-5">
                                <p className="fs-1 text-shadow text-end">Apr 20</p>
                            </Col>
                            <Col className="ps-5">
                                <p className="fs-1 text-shadow">May 18</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pe-5">
                                <p className="fs-1 text-shadow text-end">Jun 15</p>
                            </Col>
                            <Col className="ps-5">
                                <p className="fs-1 text-shadow">Jul 20</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pe-5">
                                <p className="fs-1 text-shadow text-end">Aug 17</p>
                            </Col>
                            <Col className="ps-5">
                                <p className="fs-1 text-shadow">Oct 19</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default Home;