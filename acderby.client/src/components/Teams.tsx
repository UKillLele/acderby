import { useLoaderData } from 'react-router-dom'
import { Team } from '../models/Team'
import { Container, Row, Col, Image } from 'react-bootstrap'
import { Person } from '../models/Person'
import '../styles/Teams.scss'
import { PositionType } from '../models/Position'

const Teams = () => {
    const team: Team = useLoaderData() as Team;
    const captain: Person = team.positions.find(x => x.type === PositionType.captain)?.person as Person;
    const coCaptain: Person = team.positions.find(x => x.type === PositionType.coCaptain)?.person as Person;
    const headCoach: Person = team.positions.find(x => x.type === PositionType.headCoach)?.person as Person;
    const benchCoach: Person = team.positions.find(x => x.type === PositionType.benchCoach)?.person as Person;
    const members: Person[] = team.positions
        .filter(x => x.type === PositionType.member)
        .map(x => x.person!)
        .sort((a: Person, b: Person) => {
            if (a.number && b.number) return a.number > b.number ? 1 : -1
            else if (!a.number && !b.number) return a.name > b.name ? 1 : -1
            else return a.number ? 1 : -1
        }) as Person[];

    function getImage(imgUrl: string) {
        if (imgUrl) return imgUrl;
        return team.defaultSkaterImage;
    }

    return (
        <Container fluid className="content" style={{ background: team.imageUrl ? `url(${team.imageUrl}) ${team.color}` : team.color, backgroundBlendMode: team.imageUrl && 'multiply', backgroundPosition: 'center', backgroundSize: 'cover' }}>
            <Container fluid className="px-0">
                <Row className="header-img px-lg-5 mx-0">
                    <Row>
                        <Col className="my-auto">
                            <h1 className="xl-title my-5 text-shadow">{team.name}</h1>
                        </Col>
                        <Col xs lg="auto">
                            <Image src={`/images/${team.logoUrl}`} className="skater-image p-5" />
                        </Col>
                    </Row>
                    {team.description && <p className="text-center bg-white rounded text-black p-3">{team.description}</p>}
                </Row>
                <Row className="justify-content-center px-5">
                    {captain &&
                        <Col xs lg="4" className="text-center mt-5">
                            <Image className="skater-image" src={getImage(captain.imageUrl)} />
                            <div className="mt-0 border bg-dark rounded">
                                <p className={`${captain.number && 'd-flex justify-content-between px-3'} fs-3 m-0`}>{captain.number && <span>#{captain.number}</span>}<span className="text-nowrap">{captain.name}</span></p>
                                <p className="fs-3 m-0">Captain</p>
                            </div>
                        </Col>
                    }
                    {coCaptain &&
                        <Col xs lg="4" className="text-center mt-5">
                            <Image className="skater-image" src={coCaptain.imageUrl?.length > 0 ? coCaptain.imageUrl : team.defaultSkaterImage} />
                            <div className="mt-0 border bg-dark rounded">
                                <p className={`${coCaptain.number && 'd-flex justify-content-between px-3'} fs-3 m-0`}>{coCaptain.number && <span>#{coCaptain.number}</span>}<span className="text-nowrap">{coCaptain.name}</span></p>
                                <p className="fs-3 m-0">Co-Captain</p>
                            </div>
                        </Col>
                    }
                </Row>
                <Row className="justify-content-center px-5">
                    {members && members.map((skater: Person) =>
                        <Col xs lg="3" key={skater.id} className="text-center mt-5">
                            <Image className="skater-image" src={skater.imageUrl?.length > 0 ? skater.imageUrl : team.defaultSkaterImage} />
                            <div className="mt-0 border bg-dark rounded">
                                <p className={`${skater.number && 'd-flex justify-content-between px-3'} fs-3 m-0`}>{skater.number && <span>#{skater.number}</span>}<span className="text-nowrap">{skater.name}</span></p>
                            </div>
                        </Col>
                    )}
                </Row>
                <Row className="justify-content-center px-5">
                    {headCoach &&
                        <Col xs lg="4" className="text-center mt-5">
                            <Image className="skater-image" src={headCoach.imageUrl?.length > 0 ? headCoach.imageUrl : team.defaultSkaterImage} />
                            <div className="mt-0 border bg-dark rounded">
                                <p className={`${headCoach.number && 'd-flex justify-content-between px-3'} fs-3 m-0`}>{headCoach.number && <span>#{headCoach.number}</span>}<span className="text-nowrap">{headCoach.name}</span></p>
                                <p className="fs-3 m-0">Head Coach</p>
                            </div>
                        </Col>
                    }
                    {benchCoach &&
                        <Col xs lg="4" className="text-center mt-5">
                            <Image className="skater-image" src={benchCoach.imageUrl?.length > 0 ? benchCoach.imageUrl : team.defaultSkaterImage} />
                            <div className="mt-0 border bg-dark rounded">
                                <p className={`${benchCoach.number && 'd-flex justify-content-between px-3'} fs-3 m-0`}>{benchCoach.number && <span>#{benchCoach.number}</span>}<span className="text-nowrap">{benchCoach.name}</span></p>
                                <p className="fs-3 m-0">Bench Coach</p>
                            </div>
                        </Col>
                    }
                </Row>
            </Container>
        </Container>
    );
}

export default Teams;