import { Container, Row, Col, Form, Image, Button } from 'react-bootstrap';
import { Person } from '../models/Person';
import { useLoaderData } from 'react-router-dom';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { GetPositionDisplayName, GetPositionsArray, Position, PositionType } from '../models/Position';
import Team from '../models/Team';

const Players = () => {
    const players = useLoaderData() as Person[];
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [imageFile, setImageFile] = useState<File>();
    const [image, setImage] = useState("");
    const [positions, setPositions] = useState<{ TeamId: string; type: number }[]>([]);
    const [tempPosition, setTempPosition] = useState<{ TeamId: string; type: number }>({ TeamId: "", type: 0 });
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        fetch('/api/teams').then(response => response.json()).then((resp) => {
            setTeams(resp);
        });
    }, []);

    function onAddPosition() {
        if (tempPosition.TeamId && !positions.some(x => x.TeamId === tempPosition.TeamId)) {
            setPositions([...positions, tempPosition]);
            setTempPosition({ TeamId: "", type: 0 });
        }
    }

    function onDeletePosition(TeamId: string) {
        setPositions(positions.filter(x => x.TeamId !== TeamId))
    }

    function onTeamsSelect(event: ChangeEvent) {
        const target = event.target as HTMLSelectElement;
        const { options } = target;
        const selectedteamId = options[options.selectedIndex].value;
        if (!positions.some(x => x.TeamId === selectedteamId)) {
            setTempPosition({ TeamId: selectedteamId, type: tempPosition.type });
        }
    }
    function onPositionsSelect(event: ChangeEvent) {
        const target = event.target as HTMLSelectElement;
        const { options } = target;
        const selectedPosition = Number(options[options.selectedIndex].value);
        setTempPosition({ TeamId: tempPosition.TeamId, type: selectedPosition });
    }

    function onAddImage(event: ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        if (files) {
            setImageFile(files[0])
            setImage(URL.createObjectURL(files[0]));
            target.parentElement?.classList.add("d-none");
        }
    }

    function onAddImageClick(id: string) {
        document.getElementById(id)?.click();
    }

    function onPlayerAdd(event: FormEvent) {
        event.preventDefault();

        const formData = new FormData();
        formData.append("Name", name);
        formData.append("Number", number);
        formData.append("ImageFile", imageFile!);
        formData.append("Positions", JSON.stringify(positions));

        return fetch('api/addPerson', {
            method: 'POST',
            body: formData
        }).then((resp) => {
            if (resp.status === 200) {
                window.location.reload();
            }
            else console.log(resp.statusText);
        },
            (error) => {
                console.log(error);
            });
    }

    return (
        <Container className="content text-light text-shadow">
            <Container>
                <Row className="justify-content-center mt-5">
                    <Col xs lg="3" className="text-center">
                        <Form onSubmit={onPlayerAdd}>
                            <Form.Group
                                controlId="image"
                                onClick={() => onAddImageClick("image")}
                                className="skater-image d-flex flex-column justify-content-center align-items-center border cursor-pointer">
                                <Button
                                    className="rounded-circle"
                                    variant="outline-dark"
                                    size="lg"
                                    title="upload a 1:1 .png with transparent background"
                                >
                                    +
                                </Button>
                                <Form.Control
                                    name="image"
                                    onChange={onAddImage}
                                    type="file"
                                    accept=".png"
                                    hidden
                                />
                            </Form.Group>
                            {image &&
                                <Image
                                    hidden={!image}
                                    className="skater-image cursor-pointer"
                                    src={image}
                                    onClick={() => onAddImageClick("image")}
                                />
                            }
                            <Container fluid className="mt-0 border bg-dark rounded">
                                <Row className="p-2">
                                    <Col xs lg="4">
                                        <Form.Group controlId="number">
                                            <Form.Control
                                                name="number"
                                                value={number}
                                                onChange={(event) => setNumber(event.target.value)}
                                                type="number"
                                                placeholder="#"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="name">
                                            <Form.Control
                                                name="name"
                                                value={name}
                                                onChange={(event) => setName(event.target.value)}
                                                type="string"
                                                placeholder="Name"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {positions && positions.map((position, index) =>
                                    <Row className="p-2" key={`${position.TeamId}-${position.type}-${index}`}>
                                        <Col>
                                            <Form.Group controlId="positions">
                                                <Form.Control
                                                    readOnly
                                                    hidden
                                                    name="positions"
                                                    value={JSON.stringify(positions)}
                                                />
                                            </Form.Group>
                                            <p>{teams.find(x => x.id === position.TeamId)?.name} - {GetPositionDisplayName(position.type)}</p>
                                        </Col>
                                        <Col xs="auto">
                                            <Button type="button" variant="danger" onClick={() => onDeletePosition(position.TeamId)}>&times;</Button>
                                        </Col>
                                    </Row>
                                )}
                                <Row className="p-2">
                                    <Col>
                                        <Form.Select
                                            name="tempTeam"
                                            value={tempPosition.TeamId}
                                            onChange={onTeamsSelect}
                                        >
                                            <option>Team</option>
                                            {teams.map((team: Team) =>
                                                <option key={team.id} value={team.id}>{team.name}</option>
                                            )}
                                        </Form.Select>
                                    </Col>
                                    <Col>
                                        <Form.Select
                                            name="tempPosition"
                                            value={tempPosition.type}
                                            onChange={onPositionsSelect}
                                        >
                                            {GetPositionsArray().map((key: number) =>
                                                <option value={key} key={key}>
                                                    {GetPositionDisplayName(PositionType[key])}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </Col>
                                    <Col xs="auto">
                                        <Button type="button" onClick={onAddPosition}>+</Button>
                                    </Col>
                                </Row>
                                <Row className="p-2">
                                    <Col>
                                        <Button type="submit">Add Person</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Form>
                    </Col>
                    {players && players.map((skater: Person) =>
                        <Col xs lg="3" key={skater.id} className="text-center">
                            <Image className="skater-image" src={skater.imageUrl} />
                            <Container className="mt-0 border bg-dark rounded">
                                <Row>
                                    <p className="fs-3 m-0">#{skater.number} - {skater.name}</p>
                                </Row>
                                {skater.positions && skater.positions.map((position: Position) =>
                                    <Row key={`${skater.id}-${position.team?.id}`}>
                                        <p>{position.team?.name} - {GetPositionDisplayName(position.type)}</p>
                                    </Row>
                                )}
                            </Container>
                        </Col>
                    )}
                </Row>
            </Container>
        </Container>
    )
}

export default Players;