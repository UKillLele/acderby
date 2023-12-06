import { Container, Row, Col, Button, Image } from "react-bootstrap"


const Join = () => {
    return (
        <Container fluid className="content bg-dark text-light">
            <Row className="m-5 align-items-center">
                <Col className="my-auto">
                    <h1 className="xl-title my-5 text-shadow">Join</h1>
                </Col>
                <Col lg="3">
                    <p className="text-end"><b>Just visiting?</b> Assessed skaters are welcome to drop in to practices for $5, just shoot an email to <a href="mailto:acrdwelcomewagon@gmail.com?subject=Join" target="_blank" rel="noopener">training</a>!</p>
                </Col>
            </Row>
            <Row className="my-5">
                <Col xs="12" lg="6" className="bg-black text-light p-5 d-flex align-items-center">
                    <Row className="me-lg-5">
                        <Col>
                            <Row>
                                <Col>
                                    <h2 className="fs-1 mb-5">Skate</h2>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>Assassination City is looking for skaters 18 years or older to join our ranks. We abide by <a href="https://resources.wftda.org/womens-flat-track-derby-association-statement-about-gender" target="_blank" rel="noopener">WFTDA's Statement About Gender</a> and welcome all female-identifying and non-binary skaters and volunteers to join us in a love of derby.</p>
                                    <p>Whatever your current skating ability, ACRD Fresh Meat program prepares you for derby play at a competitive level by providing the skills and conditioning necessary for ACRD home teams. Those who survive the Fresh Meat program have the opportunity to be drafted onto an ACRD home team!</p>
                                    <p>We hold Welcome Wagons on the first Sunday and Wednesday of every month.
                                        E-mail <a href="mailto:acrdwelcomewagon@gmail.com?subject=Join" target="_blank" rel="noopener">acrdwelcomewagon@gmail.com</a> or check out our <a href="https://www.facebook.com/AssassinationCityRollerDerby/" target="_blank" rel="noopener">Facebook page</a> to get more info.</p>
                                    <div className="my-5 text-center"><a href="mailto:acrdwelcomewagon@gmail.com?subject=Join" target="_blank" rel="noopener"><Button>Join Us</Button></a></div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs="12" lg="6" className="overlap-left d-flex align-items-center">
                    <Image fluid src="https://acrdphotos.blob.core.windows.net/photos/freshmeat.jpg"></Image>
                </Col>
            </Row>
            <Row className="my-5">
                <Col className="bg-black text-light p-5 d-flex align-items-center">
                    <Row className="ms-lg-5">
                        <Col>
                            <Row>
                                <Col>
                                    <h2 className="fs-1 mb-5">Officiate</h2>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>Our officiating crew is an important part of making bouts and scrimmages happen. Join our team of skating and non-skating officials and you'll play an important role in bout production and get an up-close look at world-class derby gameplay. Whether you want to keep score or blow a whistle, we want you!</p>
                                    <div className="my-5 text-center"><a href="mailto:ACRD.officials@gmail.com?subject=Join" target="_blank" rel="noopener"><Button>Officiate</Button></a></div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs="12" lg={{ order: 'first', span: '6' }} className="overlap-right d-flex align-items-center">
                    <Image fluid src="https://acrdphotos.blob.core.windows.net/photos/officials.jpg"></Image>
                </Col>
            </Row>
            <Row className="my-5">
                <Col xs="12" lg="6" className="bg-black text-light p-5 d-flex align-items-center">
                    <Row className="me-lg-5">
                        <Col>
                            <Row>
                                <Col>
                                    <h2 className="fs-1 mb-5">Volunteer</h2>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>We wouldn't be where we are today without the help of all of our active and talented volunteers! We have volunteer positions availabe for a variety of skills - you can work at bouts, coordinate events, write, create, announce, perform, and even more!</p>
                                    <div className="my-5 text-center"><a href="mailto:info@acderby.com?subject=Volunteer" target="_blank" rel="noopener"><Button>Volunteer</Button></a></div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs lg="6" className="overlap-left d-flex align-items-center">
                    <Image fluid src="https://acrdphotos.blob.core.windows.net/photos/volunteers.jpg"></Image>
                </Col>
            </Row>
            <Row className="my-5">
                <Col xs="12" lg="6" className="bg-black text-light p-5 d-flex align-items-center">
                    <Row className="ms-lg-5">
                        <Col>
                            <Row>
                                <Col>
                                    <h2 className="fs-1 mb-5">Photograph</h2>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>Interested in taking photos of all the action? Of course we want you to make us look good! We have designated areas for all of our photographers inside and outside the track!</p>
                                    <div className="my-5 text-center"><a href="mailto:info@acderby.com?subject=Photograph" target="_blank" rel="noopener"><Button>Photograph</Button></a></div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs="12" lg={{ order: 'first', span: '6' }} className="overlap-right d-flex align-items-center">
                    <Image fluid src="https://acrdphotos.blob.core.windows.net/photos/photog.jpg"></Image>
                </Col>
            </Row>
            <Row className="my-5">
                <Col xs="12" lg="6" className="bg-black text-light p-5 d-flex align-items-center">
                    <Row className="me-lg-5">
                        <Col>
                            <Row>
                                <Col>
                                    <h2 className="fs-1 mb-5">Sponsor</h2>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>We're happy to partner with local and national businesses to reach our audience and support our passion! From the jam line to vendor booths, we've got something for every budget.</p>
                                    <div className="my-5 text-center"><a href="mailto:sponsorship@acderby.com?subject=Sponsor" target="_blank" rel="noopener"><Button>Sponosor</Button></a></div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs="12" lg="6" className="overlap-left d-flex align-items-center">
                    <Image fluid src="https://acrdphotos.blob.core.windows.net/photos/sponsor.jpg"></Image>
                </Col>
            </Row>
        </Container>
    )
}

export default Join