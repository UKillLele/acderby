import { Container, Row, Col } from "react-bootstrap"


const Events = () => {
    return (
        <Container fluid className="content bg-dark text-light">
            <Row className="m-5 align-items-center">
                <Col className="my-auto">
                    <h1 className="xl-title my-5 text-shadow">Events</h1>
                </Col>
            </Row>
            <Row className="m-5">
                <Col>
                    <p>We do more than just derby! Catch us around town! Upcoming non-derby events will be updated here. Need info on trivia or what parades we're skating? That's here!</p>
                    <p>Want us to come to your event? We'd love to! <a href="mailto:marketing@acderby.com?subject=Event" target="_blank" rel="noopener">Let us know</a></p>
                </Col>
            </Row>
            <Row className="m-5">
                <Col>
                    <p>No upcoming events currently scheduled.</p>
                </Col>
            </Row>
        </Container>
    )
}

export default Events