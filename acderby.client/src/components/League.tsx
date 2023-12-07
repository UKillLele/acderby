import { Col, Container, Row, Image, Accordion, ListGroup } from "react-bootstrap"
import { Link } from "react-router-dom"


const League = () => {
    return (
        <Container fluid className="content bg-dark text-light">
            <Row className="m-5">
                <Col className="my-auto">
                    <h1 className="xl-title my-5 text-shadow">Our League</h1>
                </Col>
            </Row>
            <Row className="mx-5">
                <Col>
                    <Accordion data-bs-theme="light">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>FAQ</Accordion.Header>
                            <Accordion.Body>
                                <ListGroup>
                                    <ListGroup.Item>
                                        <p className="fw-bold">WHO OWNS and OPERATES THE LEAGUE?</p>
                                        <p className="m-0">Assassination City Roller Derby is 100% skater-owned and -operated. Each skater has a part in running the business. From designing the flyers, to keeping the books, to wiping up beer during the bout - every skater donates her time and talents to the league on and off the track.</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">DO SKATERS GET PAID?</p>
                                        <p className="m-0">We wish - but no, we all play for the love of the sport and of each other. All of the revenue we take at the door and from sponsors goes back into the league by paying for practice time, uniforms, gear, and production costs.</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">WHAT KIND OF PEOPLE PLAY ROLLER DERBY?</p>
                                        <p className="m-0">ALL TYPES! Our skaters range from age 18 to age 50, from teeny-tiny to large-and-in-charge. We have teachers, librarians, artists, waitresses, doctors, scientists, engineers - all sorts.</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">HOW DOES ROLLER DERBY WORK?</p>
                                        <p className="m-0">Come to a bout and see, but also check out our <Link to="/derby">Derby 101.</Link></p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">DO YOU PUNCH PEOPLE OR BEAT PEOPLE UP?</p>
                                        <p className="m-0">Even though roller derby is a full-contact sport, fighting is definitely off limits. Punching, kicking, and elbowing are serious no-nos, but sometimes a good body check feels about the same.</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">DO YOU GET HURT?</p>
                                        <p className="m-0">Yes, roller derby is a full-contact sport, and injuries are bound to happen. We train off-skates to minimize injury, learn how to fall and to take hits properly, and we wear head-to-toe safety gear every time we get out on the track, but it happens. Most common are bruises, muscle strains, and sprains, but broken bones and more serious injuries can and do occur.</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">ISN'T ROLLER DERBY FAKED?</p>
                                        <p className="m-0">Nope! (This is why punching will get you ejected from a game.)</p>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
            <Row className="my-5">   
                <Col xs="12" lg="6" className="bg-black text-light p-5 d-flex align-items-center">
                    <Row className="me-lg-5">
                        <Col>
                            <Row>
                                <Col>
                                    <h2 className="fs-1 mb-5">Mission Statement</h2>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>
                                        Assassination City Roller Derby is a DIY, skater-owned and -operated, limited liability company that is dedicated to the development of confidence, sportswomanship, and athletic prowess of each skater, with a focus on integrating each skater's talents and strengths into one tight-knit cohesive unit. Assassination City Roller Derby places emphasis on promoting awareness of women's flat track roller derby within the DFW community by participating in local events and raising money for charities. Assassination City Roller Derby aspires to move our organization forward positively through a combination of serious dedication, enthusiastic athleticism and a grass-roots push to make our travel team a fierce contender for WFTDA Nationals, while simultaneously making Dallas a fun roller derby destination for our fans.
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs lg="6" className="overlap-left d-flex align-items-center">
                    <Image fluid src="https://acrdphotos.blob.core.windows.net/photos/lsa-lr.jpg"></Image>
                </Col>
            </Row>
            <Row className="my-5">
                <Col xs="12" lg="6" className="bg-black text-light p-5 d-flex align-items-center">
                    <Row className="ms-lg-5">
                        <Col>
                            <Row>
                                <Col>
                                    <h2 className="fs-1 mb-5">History</h2>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>November 1963</p>
                                    <p>As the presidential motorcade rolls down Houston Street, President John F. Kennedy and his wife, Jackie, wave to the crowd of onlookers on what is a beautiful, sunny day in Dallas. The procession turns onto Elm Street, the crowd cheering at their beloved president and his stylish first lady. Shots ring out. The crowd erupts into chaos: Screaming, running everywhere, ducking, crying. A Secret Service agent sprints to the presidential convertible. A blood-spattered Jackie Kennedy scrambles out of the back seat onto the trunk of the car, reaching out desperately for help. Later that evening, Walter Cronkite announces to the world in an uncharastically unsteady voice, "From Dallas, Texas, the flash apparently official, President Kennedy died at 1 p.m. Central Standard Time, 2 o'clock Eastern Standard Time, some 38 minutes ago."</p>
                                    <br />
                                    <p>This is the day Dallas became known as Assassination City.</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col lg={{ order: 'first' }} className="overlap-right align-items-center d-flex">
                    <Image fluid src="https://acrdphotos.blob.core.windows.net/photos/kennedy.jpg"></Image>
                </Col>
            </Row>
            <Row className="my-5">
                <Col xs lg="6" className="bg-black text-light p-5 d-flex align-items-center">
                    <Row className="me-lg-5">
                        <Col>
                            <Row>
                                <Col>
                                    <h2 className="fs-1 mb-5">Recent History</h2>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>2001-2002</p>
                                    <p>Roller derby was reinvented in Austin from the game that was played in the 1950s and '60s to the game it is today. Lacking the budget to build and house a banked-track, the Texas Rollergirls redrafted the rules to allow for a flat-track game. This was the start of the modern-day roller derby boom that has been growing over the past decade. By converting the game to a flat track it has made the sport more accessible not only for skaters financially, but also for fans, who can now be closer to the track and take in more of the action.</p>
                                    <br />
                                    <p>February 2005</p>
                                    <p>In Dallas, Assassination City Roller Derby, LLC was organized by a small but passionate group of women hoping to make ACRD the downtown derby. You may not live downtown, but you have that downtown attitude: fierce, determined, competitive, unconventional, and classy.</p>
                                    <br />
                                    <p>2005 - Today</p>
                                    <p>ACRD has grown from that same handful of women into a large organization made up of more than 100 skaters, volunteers, and referees from all walks of life. With four home teams and one all-star travel team competing at a national level, ACRD has grown beyond expectations and developed its place in Dallas and in roller derby.</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col lg="6" className="overlap-left d-flex align-items-center">
                    <Image fluid src="https://acrdphotos.blob.core.windows.net/photos/dk-lr.jpg"></Image>
                </Col>
            </Row>
        </Container>
    )
}

export default League