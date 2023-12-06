import { Card, Col, Container, Row } from "react-bootstrap"


const Derby = () => {
    return (
        <Container fluid className="content bg-dark text-light">
            <Row className="m-5">
                <Col className="my-auto">
                    <h1 className="xl-title my-5 text-shadow">Flat Track Roller Derby</h1>
                </Col>
            </Row>
            <Row className="my-5">
                <Col xs lg="6" className="bg-black text-light p-5 d-flex align-items-center">
                    <Row className="me-lg-5">
                        <Col>
                            <Row>
                                <Col>
                                    <h2 className="fs-1 mb-5">What is roller derby?</h2>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>
                                        The easiest way to learn is to come see a bout in person. Our announcers will give you a quick run down before the first bout starts, but here a few quick tips.
                                    </p>
                                    <p>
                                        The game of roller derby is relatively simple. Each team has a designated scorer (aka the "jammer") who earns a point every time she laps an opposing player. It's sort of a combination of speed skating and Red Rover, except we use hip checks instead of holding hands (the idea is you don't let the other jammer pass you).
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs lg="6" className="overlap-left d-flex align-items-center">
                    <iframe className="video" src="https://www.youtube.com/embed/OId6gTd2LCM?si=irVUklQ21hguloT_" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </Col>
            </Row>
            <Row>
                <Col xs="12" lg className="mb-3">
                    <Card className="bg-black text-light h-100">
                        <Card.Body>
                            <Card.Title className="fs-2 mb-3">POSITIONS</Card.Title>
                            <Card.Text>
                                <p><b>Jammer</b>: Scores all the points! (Has a star on her helmet and is the only player who can score points.)</p>
                                <p><b>Blocker</b>: Simultaneously plays offense and defense. She blocks the other jammer, and clears the path for her own jammer.</p>
                                <p><b>Pivot</b>: Head blocker. (Has a stripe on her helmet and calls the plays.)</p>
                                <p><b>The Pack</b>: The largest group of skaters within 10 feet of one another.</p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs="12" lg className="mb-3">
                    <Card className="bg-black text-light h-100">
                        <Card.Body>
                            <Card.Title className="fs-2 mb-3">TYPES OF BLOCKING</Card.Title>
                            <Card.Text>
                                <p><b>Frontal Block</b>: Positional blocking by staying in front of a skater to slow her down.</p>
                                <p><b>Hip Check</b>: Using your hips to knock someone down or out-of-bounds.</p>
                                <p><b>Shoulder Check</b>: Using your shoulders to knock someone down or out-of-bounds.</p>
                                <p><b>Poptart</b>: A shoulder check to an opponent’s sternum.</p>
                                <p><b>Leaning Out</b>: Escorting an opponent out-of-bounds by leaning on them.</p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs="12" lg className="mb-3">
                    <Card className="bg-black text-light h-100">
                        <Card.Body>
                            <Card.Title className="fs-2 mb-3">COMMON PENALTIES</Card.Title>
                            <Card.Text>
                                <p><b>High/Low Block</b>: Hitting above the shoulders or below the knees.</p>
                                <p><b>Back Block</b>: Hitting another skater's spinal area</p>
                                <p><b>Forearm</b>: Blocking with you hands, arms, or elbows.</p>
                                <p><b>Multiplayer</b>: Blocking by forming an impassable link with another skater.</p>
                                <p><b>Directional/Clockwise Block</b>: Hitting a player while moving the wrong direction.</p>
                                <p><b>Track Cut</b>: You cannot go in bounds in front of anyone if you get hit out.</p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs="12" lg className="mb-3">
                    <Card className="bg-black text-light h-100">
                        <Card.Body>
                            <Card.Title className="fs-2 mb-3">GLOSSARY</Card.Title>
                            <Card.Text>
                                <p><b>Bout</b>: The game, made of two 30 minute halves.</p>
                                <p><b>Jam</b>: 2 minute period.</p>
                                <p><b>Jammer</b>: Player scoring points.</p>
                                <p><b>Panty/Helmet Cover</b>: The name given to the jammer and pivot helmet covers.</p>
                                <p><b>Jumping the Apex</b>: Jumping at a turn across the inside of the track.</p>
                                <p><b>Power Jam</b>: When there is only one jammer on the track.</p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="my-5">
                <Col className="bg-black text-light p-5 d-flex align-items-center">
                    <Row className="ms-lg-5">
                        <Col>
                            <p className="fs-3">Gameplay</p>
                            <ul>
                                <li>Each team has 4 blockers and 1 jammer on the track at a time.</li>
                                <li>The first jammer to clear the pack becomes the "lead jammer." She does not earn points for her first lap, or "initial pass," but points start accruing on her second time around, or "scoring pass."</li>
                                <li> "Lead jammer" status is indicated by the referee pointing at her and holding up his other hand shaped in the letter "L."</li>
                                <li> "Lead jammer"" status allows her to end the jam before 2 minutes is up if she so chooses. (This way she can call off a jam after she has scored points, but before the opposing jammer can score.)</li>
                                <li>Teams have 30 seconds between each jam to field a new line-up.</li>
                                <li>Teams are allowed to substitute players between jams, except for players stuck in the penalty box.</li>
                                <li>Penalties earn a skater 30 seconds in the box, which may mean sitting in the box for more than one jam.</li>
                                <li>7 trips to the box results in expulsion.</li>
                                <li>Each team has 3 time outs.</li>
                            </ul>
                            <p className="fs-3">Legal Hits</p>
                            <ul>
                                <li>Hits to the shoulder and thighs.</li>
                                <li>Hits using your shoulder, hips, butt, and side.</li>
                            </ul>
                            <p className="fs-3">Still confused?</p>
                            <p>It's a lot to take in. Don't be shy. You can ask your neighbor or any of the skaters carrying around "ASK ME"" signs. We love to talk derby. Just focus on the hits, watch the jammers (they usually are on the receiving end of most hits), and build a beer-a-mid or two.</p>
                            <p>You can also see a <a href="www.wftda.com/rules﻿" target="_blank" rel="noopener">complete list of rules</a>﻿</p>
                        </Col>
                    </Row>
                </Col>
                <Col lg={{ order: 'first' }} className="overlap-right d-flex align-items-center">
                    <iframe className="video" src="https://www.youtube.com/embed/bFb52bF-Hp4?si=ZSxOqRECnX39hSoL" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </Col>
            </Row>
        </Container>
    )
}

export default Derby