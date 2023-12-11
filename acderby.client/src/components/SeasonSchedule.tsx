import { Container, Row, Col, Card, Accordion, ListGroup } from "react-bootstrap";
import { Bout } from "../models/Bout";
import { Link, useLoaderData } from "react-router-dom";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDate(date: Date) {
    const d = new Date(date);
    const month = months[d.getMonth()];
    return `${month} ${d.getDate()}`;
}

function checkTix(dates, index) {
    const current = dates[index][0].date;
    const previous = dates[index - 1];
    if (new Date(current) > new Date(Date.now()) && (!previous || new Date(previous[0].date) < new Date(Date.now()))) return true;
    return false;
}

const SeasonSchedule = () => {
    const bouts: [] = useLoaderData() as [];
    return (
        <Container fluid className="content bg-dark text-light">
            <Row className="m-5 align-items-center">
                <Col className="my-auto">
                    <h1 className="xl-title my-5 text-shadow">2024 Season</h1>
                </Col>
                <Col xs="auto">
                    <Link className="btn btn-primary ms-auto" to="/tickets">Get Season Passes</Link>
                </Col>
            </Row>
            <Row className="mx-5">
                <Col>
                    <Accordion data-bs-theme="light">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Bout Day Info</Accordion.Header>
                            <Accordion.Body>
                                <ListGroup>
                                    <ListGroup.Item>
                                        <p className="fw-bold">WHERE</p>
                                        <p className="m-0">Thunderbird Roller Rink</p>
                                        <p className="m-0">3200 Thunderbird Ln</p>
                                        <p className="m-0">Plano, TX 75075</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">WHEN</p>
                                        <p className="m-0">Doors open at 6:30pm</p>
                                        <p className="m-0">First whistle at 7pm</p>
                                        <p className="m-0">Second bout around 8:30pm</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">SEATING - BYOChair</p>
                                        <p className="m-0">We ask that all chairs are set up behind the second line of caution tape. If you want to get really close to the action, the area between the two caution tapes is floor seating only. Be aware that the floor area is called "Crash-Zone Seating" for a reason. We like to skate fast, hit hard and sometimes you might unexpectedly end up with a roller girl in your lap sitting in this area.</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">REFRESHMENTS</p>
                                        <p className="m-0">All bouts are BYOB - no glass, please. IDs will be checked at the door.</p>
                                        <p className="m-0">Non-Alcoholic drinks & snacks are available at the concession stand.</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">KIDS</p>
                                        <p className="m-0">We love having kids at the bouts! Many of our skaters are moms themselves! Children 10 & under are free EXCEPT for special events.</p>
                                        <p className="m-0"><u>Please Note</u> - Roller Derby is a full contact sport & our rink is small. Please help keep your children safe by sitting in the second row of chairs behind the caution tape. No one under the age of 18 is allowed to sit on the floor. We like to skate fast, hit hard & sometimes we end up in the crowd accidentally.</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">MEET THE SKATERS</p>
                                        <p className="m-0">We love our fans!! Cheer loud & often! Bring posters, shirts, stickers, pictures! We are happy to take pictures with you & sign autographs!</p>
                                        <p className="m-0">Feel free to ask questions! We love to talk derby! We'll also give you a quick demo jam before the first game. You can also check out our <Link to="/derby">Derby 101</Link> info.</p>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
            {bouts.map((date: Bout[], index: number) =>
                <Row className="m-5" key={date[0].date.toString()}>
                    <Col>
                        <Card data-bs-theme="light">
                            <Card.Body>
                                <Card.Title>
                                    <Row className="align-items-center">
                                        <Col xs="12" lg className="text-lg-end fs-1 fw-bold mx-lg-3">
                                            {date[0].name}
                                        </Col>
                                        <Col xs="12" lg className="text-lg-start fs-1 fw-bold mx-lg-3">
                                            {getDate(date[0].date)}
                                        </Col>
                                        <Col lg="auto" className="text-center py-2">
                                            {checkTix(bouts, index) && <Link className="btn btn-primary ms-auto" to="/tickets">Get Tickets</Link>}
                                        </Col>
                                    </Row> 
                                </Card.Title>
                                {date.sort((a, b) => a.date > b.date ? 1 : -1).map((bout, i) =>
                                    <Row key={bout.date.toString()} className="align-items-center mb-2 text-light fw-bold text-shadow pb-2 text-center" style={{ borderBottom: i + 1 != date.length ? '1px solid black' : '' }}>
                                        <Col className="p-0 bout-bg" style={{ background: bout.homeTeam && `url(${bout.homeTeam.imageUrl})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                                            <Container fluid style={{ backgroundColor: bout.homeTeam && bout.homeTeam.color }} className="m-0 h-100 d-flex align-items-center justify-content-center fs-1">
                                                <span>{bout.homeTeam ? bout.homeTeam.name : bout.name == "Champs" ? i == 0 ? 'Team 3' : 'Team 1' : 'TBA'}</span>
                                            </Container>
                                        </Col>
                                        <Col lg="auto" className="fw-bold xl-title text-light text-shadow vs">VS</Col>
                                        <Col className="p-0 bout-bg" style={{ background: bout.awayTeam && `url(${bout.awayTeam.imageUrl})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                                            <Container fluid style={{ backgroundColor: bout.awayTeam && bout.awayTeam.color }} className="m-0 h-100 d-flex align-items-center justify-content-center fs-1">
                                                <span>{bout.awayTeam ? bout.awayTeam.name : bout.name == "Champs" ? i == 0 ? 'Team 4' : 'Team 2' : 'TBA'}</span>
                                            </Container>
                                        </Col>
                                    </Row>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    )
}

export default SeasonSchedule