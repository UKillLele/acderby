import { Col, Container, Row, Card, Button } from "react-bootstrap"
import { Link } from "react-router-dom"


const QuickLinks = () => {
    return (
        <Container fluid className="content bg-dark text-light">
            <Row className="m-5">
                <Col className="my-auto">
                    <h1 className="xl-title my-5 text-shadow">Quick Links</h1>
                </Col>
            </Row>
            <Row className="my-5 justify-content-center">
                <Col xs="12" lg="auto" data-bs-theme="light">
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>Schedule</Card.Title>
                            <Link to="/season"><Button className="m-2">Home Teams</Button></Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs="12" lg="auto" data-bs-theme="light">
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>Purchase</Card.Title>
                            <Link to="/tickets"><Button className="m-2">Tickets</Button></Link>
                            <Link to="/shop"><Button className="m-2">Shop</Button></Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs="12" lg="auto" data-bs-theme="light">
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>Social Media</Card.Title>
                            <Button href="https://www.facebook.com/AssassinationCityRollerDerby" target="_blank" rel="noopener" className="d-block m-2">Facebook</Button>
                            <Button href="https://www.instagram.com/assassinationcityrollerderby" target="_blank" rel="noopener" className="d-block m-2">Instagram</Button>
                            <Button href="https://twitter.com/ACDerby" target="_blank" rel="noopener" className="d-block m-2">X AKA Twitter</Button>
                            <Button href="https://www.tiktok.com/@assassinationcityderby" target="_blank" rel="noopener" className="d-block m-2">TikTok</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs="12" lg="auto" data-bs-theme="light">
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>Team Social Media</Card.Title>
                            <Button href="https://www.facebook.com/TheDeadlyKennedys" target="_blank" rel="noopener" className="d-block m-2 btn-warning">Deadly Kennedys</Button>
                            <Button href="https://www.facebook.com/LoneStarAssassins" target="_blank" rel="noopener" className="d-block m-2 btn-dark">Lone Star Assassins</Button>
                            <Button href="https://www.facebook.com/larevrollerderby" target="_blank" rel="noopener" className="d-block m-2 btn-danger">&iexcl;Viva La Revoluci&oacute;n!</Button>
                            <Button href="http://facebook.com/ACRD.Officials" target="_blank" rel="noopener" className="d-block m-2 btn-secondary">Internal Affairs</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs="12" lg="auto" data-bs-theme="light">
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>Email us</Card.Title>
                            <Button href="mailto:info@acderby.com" target="_blank" rel="noopener" className="d-block m-2">Info</Button>
                            <Button href="mailto:acrdwelcomewagon@gmail.com" target="_blank" rel="noopener" className="d-block m-2">Fresh Meat</Button>
                            <Button href="mailto:sponsorshipacderby@gmail.com" target="_blank" rel="noopener" className="d-block m-2">Sponsorship</Button>
                            <Button href="mailto:merchacrd@gmail.com" target="_blank" rel="noopener" className="d-block m-2">Merchandise</Button>
                            <Button href="mailto:acrd.officials@gmail.com" target="_blank" rel="noopener" className="d-block m-2">Refs & Volunteers</Button>
                            <Button href="mailto:acrdtraining2022@gmail.com" target="_blank" rel="noopener" className="d-block m-2">Training/Interleague</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs="12" lg="auto" data-bs-theme="light">
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>Affiliates</Card.Title>
                            <Button href="https://wftda.org/" target="_blank" rel="noopener" className="d-block m-2">WFTDA</Button>
                            <Button href="http://thunderbirdrink.com/" target="_blank" rel="noopener" className="d-block m-2">Thunderbird</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default QuickLinks