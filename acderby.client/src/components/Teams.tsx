import { useLoaderData } from 'react-router-dom'
import Team from '../models/Team'
import { Container, Row, Col, Image } from 'react-bootstrap'
import { Person } from '../models/Person'
import '../styles/Teams.scss'
import { PositionType } from '../models/Position'

const Teams = () => {
    const team: Team = useLoaderData() as Team;
    const captain: Person = team.positions.find(x => x.type === PositionType.captain)?.person as Person;
    const coCaptain: Person = team.positions.find(x => x.type === PositionType.coCaptain)?.person as Person;
    const members: Person[] = team.positions.filter(x => x.type === PositionType.member).map(x => x.person) as Person[];

    return (
        <Container fluid className="content text-light text-shadow" style={{ backgroundColor: team.color }}>
            <Container>
                <h1 className="fs-1 text-center my-5">{team.name}</h1>
                <p className="text-center">{team.description}</p>
                <Row className="captians justify-content-center mt-5">
                    <Col xs lg="4" className="text-center">
                        <Image className="skater-image" src={captain?.imageUrl} />
                        <div className="mt-0 border bg-dark rounded">
                            <p className="fs-3 m-0">#{captain?.number} - {captain?.name}</p>
                            <p className="fs-3 m-0">Captain</p>
                        </div>
                    </Col>
                    <Col xs lg="4" className="text-center">
                        <Image className="skater-image" src={coCaptain?.imageUrl} />
                        <div className="mt-0 border bg-dark rounded">
                            <p className="fs-3 m-0">#{coCaptain?.number} - {coCaptain?.name}</p>
                            <p className="fs-3 m-0">Co-Captain</p>
                        </div>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-5">
                    {members && members.map((skater: Person) =>
                        <Col xs lg="3" key={skater.id} className="text-center">
                            <Image className="skater-image" src={skater.imageUrl} />
                            <div className="mt-0 border bg-dark rounded">
                                <p className="fs-3 m-0">#{skater.number} - {skater.name}</p>
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>
        </Container>
    );
}

export default Teams;