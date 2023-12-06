import { Container, Row, Col, Form, Image, Button, Spinner } from 'react-bootstrap';
import { Person } from '../models/Person';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { GetPositionDisplayName, GetPositionsArray, Position, PositionType } from '../models/Position';
import { Team } from '../models/Team';

const Players = () => {
    const [players, setPlayers] = useState<Person[]>([]);

    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [imageFile, setImageFile] = useState<File>();
    const [image, setImage] = useState("");
    const [positions, setPositions] = useState<{ teamId: string; type: number }[]>([]);
    const [tempPosition, setTempPosition] = useState<{ teamId: string; type: number }>({ teamId: "", type: 0 });
    const [addLoading, setAddLoading] = useState<boolean>(false);

    const [updatingName, setUpdatingName] = useState("");
    const [updatingId, setUpdatingId] = useState("");
    const [updatingNumber, setUpdatingNumber] = useState("");
    const [updatingImage, setUpdatingImage] = useState("");
    const [updatingImageFile, setUpdatingImageFile] = useState<File>();
    const [updatingPositions, setUpdatingPositions] = useState<{ teamId: string; type: number }[]>([]);
    const [tempUpdatingPosition, setTempUpdatingPosition] = useState<{ teamId: string; type: number }>({ teamId: "", type: 0 });
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);

    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        refreshPlayers();
        fetch('/api/teams').then(response => response.json()).then((resp: Team[]) => {
            setTeams(resp.sort((a, b) => a.name > b.name ? 1 : -1));
        });
    }, []);

    function onPlayerClick(skater: Person) {
        setUpdatingId(skater.id);
        setUpdatingName(skater.name);
        setUpdatingNumber(skater.number);
        setUpdatingImage(skater.imageUrl);
        const up: { teamId: string; type: number }[] = [];
        skater.positions.forEach(position => {
            up.push({ teamId: position.team!.id, type: position.type });
        });
        setUpdatingPositions(up);
        if (skater.imageUrl) document.getElementsByClassName("updating-image")[0].classList.add("d-none");
    }

    function onAddPosition() {
        if (tempPosition.teamId && !positions.some(x => x.teamId === tempPosition.teamId)) {
            setPositions([...positions, tempPosition]);
            setTempPosition({ teamId: "", type: 0 });
        }
    }

    function onAddUpdatingPosition() {
        if (tempUpdatingPosition.teamId && !updatingPositions.some(x => x.teamId === tempUpdatingPosition.teamId)) {
            setUpdatingPositions([...updatingPositions, tempUpdatingPosition]);
            setTempUpdatingPosition({ teamId: "", type: 0 });
        }
    }

    function onDeletePosition(teamId: string) {
        setPositions(positions.filter(x => x.teamId !== teamId))
    }

    function onDeleteUpdatingPosition(teamId: string) {
        setUpdatingPositions(updatingPositions.filter(x => x.teamId !== teamId))
    }

    function onTeamsSelect(event: ChangeEvent) {
        const target = event.target as HTMLSelectElement;
        const { options } = target;
        const selectedteamId = options[options.selectedIndex].value;
        if (!positions.some(x => x.teamId === selectedteamId)) {
            setTempPosition({ teamId: selectedteamId, type: tempPosition.type });
        }
    }
    
    function onUpdatingTeamsSelect(event: ChangeEvent) {
        const target = event.target as HTMLSelectElement;
        const { options } = target;
        const selectedteamId = options[options.selectedIndex].value;
        if (!updatingPositions.some(x => x.teamId === selectedteamId)) {
            setTempUpdatingPosition({ teamId: selectedteamId, type: tempUpdatingPosition.type });
        }
    }

    function onPositionsSelect(event: ChangeEvent) {
        const target = event.target as HTMLSelectElement;
        const { options } = target;
        const selectedPosition = Number(options[options.selectedIndex].value);
        setTempPosition({ teamId: tempPosition.teamId, type: selectedPosition });
    }

    function onUpdatingPositionsSelect(event: ChangeEvent) {
        const target = event.target as HTMLSelectElement;
        const { options } = target;
        const selectedPosition = Number(options[options.selectedIndex].value);
        setTempUpdatingPosition({ teamId: tempUpdatingPosition.teamId, type: selectedPosition });
    }

    function onAddImage(event: ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        if (files) {
            setImageFile(files[0])
            setImage(URL.createObjectURL(files[0]));
        }
    }

    function onAddUpdatingImage(event: ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        if (files) {
            setUpdatingImageFile(files[0])
            setUpdatingImage(URL.createObjectURL(files[0]));
        }
    }

    function onAddImageClick(id: string) {
        document.getElementById(id)?.click();
    }

    function onPlayerAdd(event: FormEvent) {
        event.preventDefault();
        setAddLoading(true);
        if (tempPosition.teamId.length > 0) setPositions([...positions, tempPosition]);
        setTempPosition({teamId: "", type: 0});

        const formData = new FormData();
        formData.append("Name", name);
        formData.append("Number", number.toString() ?? "");
        formData.append("ImageFile", imageFile ?? "");
        formData.append("Positions", JSON.stringify(positions));

        return fetch('api/add-person', {
            method: 'POST',
            body: formData
        }).then((resp) => {
            if (resp.status === 200) {
                clearAdding();
            }
            else console.log(resp.statusText);
        },
            (error) => {
                console.log(error);
            });
    }

    function onPlayerUpdate(event: FormEvent) {
        event.preventDefault();
        setUpdateLoading(true);
        if (tempUpdatingPosition.teamId.length > 0) setPositions([...updatingPositions, tempUpdatingPosition]);
        setTempUpdatingPosition({ teamId: "", type: 0 });

        const formData = new FormData();
        formData.append("Id", updatingId);
        formData.append("Name", updatingName);
        formData.append("Number", updatingNumber.toString() ?? "");
        formData.append("ImageFile", updatingImageFile ?? "");
        formData.append("Positions", JSON.stringify(updatingPositions));

        return fetch('api/update-person', {
            method: 'PUT',
            body: formData
        }).then((resp) => {
            if (resp.status === 200) {
                clearUpdating();
            }
            else console.log(resp.statusText);
        },
            (error) => {
                console.log(error);
            });
    }

    function onDeleteClick() {
        const formData = new FormData();
        formData.append("Id", updatingId);
        return fetch(`api/delete-person`, {
            method: 'Post',
            body: formData
        }).then((resp) => {
            if (resp.status === 200) {
                clearUpdating();
            }
        })
    }

    function clearAdding() {
        setName("");
        setNumber("");
        setImage("");
        setImageFile(undefined);
        setPositions([]);
        setTempPosition({ teamId: "", type: 0 });
        setAddLoading(false);
        refreshPlayers();
    }

    function clearUpdating() {
        setUpdatingId("");
        setUpdatingName("");
        setUpdatingNumber("");
        setUpdatingImage("");
        setUpdatingImageFile(undefined);
        setUpdatingPositions([]);
        setTempUpdatingPosition({ teamId: "", type: 0 });
        setUpdateLoading(false);
        refreshPlayers();
    }

    function refreshPlayers() {
        return fetch('api/players').then((resp) => resp.json()).then((resp) => {
            setPlayers(resp.sort((a: Person, b: Person) => {
                if (a.number && b.number) return a.number > b.number ? 1 : -1
                else if (!a.number && !b.number) return  a.name > b.name ? 1 : -1 
                else return a.number ? 1 : -1
            }));
        });
    }

    return (
        <Container fluid className="content text-light text-shadow bg-secondary">
            <Container>
                <Row className="mt-5">
                    <Col xs lg="3" className="text-center mb-3">
                        <Form onSubmit={onPlayerAdd}>
                            <Form.Group
                                controlId="image"
                                onClick={() => onAddImageClick("image")}
                                className={`skater-image d-flex flex-column justify-content-center align-items-center border cursor-pointer bg-white ${image == "" ? 'd-flex' : 'd-none'}`}>
                                <Button
                                    className="rounded-circle"
                                    variant="outline-dark"
                                    size="lg"
                                    title="upload a 900x900px .png with transparent background"
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
                                                value={number ?? ""}
                                                onChange={(event) => setNumber(event.target.value)}
                                                type="string"
                                                pattern="[0-9]*"
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
                                    <Row className="p-2" key={`${position.teamId}-${position.type}-${index}`}>
                                        <Col>
                                            <Form.Group controlId="positions">
                                                <Form.Control
                                                    readOnly
                                                    hidden
                                                    name="positions"
                                                    value={JSON.stringify(positions)}
                                                />
                                            </Form.Group>
                                            <p>{teams.find(x => x.id === position.teamId)?.name} - {GetPositionDisplayName(position.type)}</p>
                                        </Col>
                                        <Col xs="auto">
                                            <Button type="button" variant="danger" onClick={() => onDeletePosition(position.teamId)}>&times;</Button>
                                        </Col>
                                    </Row>
                                )}
                                <Row className="p-2">
                                    <Col>
                                        <Form.Select
                                            name="tempTeam"
                                            value={tempPosition.teamId}
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
                                        <Button type="submit">
                                            {!addLoading ? 'Add' :
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                />
                                            }
                                        </Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Form>
                    </Col>
                    {players.length > 0 && players.map((skater: Person) =>
                        updatingId !== skater.id ?
                        <Col key={skater.id} xs lg="3" className="mb-3" onClick={() => onPlayerClick(skater)}>
                            {skater.imageUrl ?
                                <Image className="skater-image cursor-pointer" src={skater.imageUrl} />
                            :
                                <div className="skater-image d-flex flex-column justify-content-center align-items-center border cursor-pointer bg-white">
                                    <Button
                                        className="rounded-circle"
                                        variant="outline-dark"
                                        size="lg"
                                        title="upload a 900x900px .png with transparent background"
                                    >
                                        +
                                    </Button>
                                </div>
                            }
                            <Container className="mt-0 border bg-dark rounded">
                                    <Row>
                                        <p className={`${skater.number && 'd-flex justify-content-between px-3'} text-center fs-3 m-0`}>{skater.number && <span>#{skater.number}</span>}<span className="text-nowrap">{skater.name}</span></p>
                                </Row>
                                {skater.positions && skater.positions.map((position: Position) =>
                                    <Row key={`${skater.id}-${position.team?.id}`}>
                                        <p>{position.team?.name} - {GetPositionDisplayName(position.type)}</p>
                                    </Row>
                                )}
                            </Container>
                        </Col>
                        :
                        <Col xs lg="3" key={skater.id} className="text-center position-relative">
                            <Form onSubmit={onPlayerUpdate}>
                                <Form.Group
                                    controlId="updateImage"
                                    onClick={() => onAddImageClick("updateImage")}
                                    className={`skater-image flex-column justify-content-center align-items-center border cursor-pointer bg-white ${updatingImage ? 'd-none': 'd-flex'}`}
                                >
                                    <Button
                                        className="rounded-circle"
                                        variant="outline-dark"
                                        size="lg"
                                        title="upload a 900x900px .png with transparent background"
                                    >
                                        +
                                    </Button>
                                    <Form.Control
                                        name="updateImage"
                                        onChange={onAddUpdatingImage}
                                        type="file"
                                        accept=".png"
                                        hidden
                                    />
                                </Form.Group>
                                {updatingImage &&
                                    <Image
                                        className="skater-image cursor-pointer"
                                        src={updatingImage}
                                        onClick={() => onAddImageClick("updateImage")}
                                    />
                                }
                                <Container fluid className="mt-0 border bg-dark rounded">
                                    <Row className="p-2">
                                        <Col xs lg="4">
                                            <Form.Group controlId="updateNumber">
                                                <Form.Control
                                                    name="updateNumber"
                                                    value={updatingNumber!}
                                                    onChange={(event) => setUpdatingNumber(event.target.value)}
                                                    type="string"
                                                    pattern="[0-9]*"
                                                    placeholder="#"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="updateName">
                                                <Form.Control
                                                    name="updateName"
                                                        value={updatingName}
                                                        onChange={(event) => setUpdatingName(event.target.value)}
                                                    type="string"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    {updatingPositions && updatingPositions.map((position, index) =>
                                        <Row className="p-2" key={`${position.teamId}-${position.type}-${index}`}>
                                            <Col>
                                                <Form.Group controlId="positions">
                                                    <Form.Control
                                                        readOnly
                                                        hidden
                                                        name="positions"
                                                        value={JSON.stringify(updatingPositions)}
                                                    />
                                                </Form.Group>
                                                <p>{teams.find(x => x.id === position.teamId)?.name} - {GetPositionDisplayName(position.type)}</p>
                                            </Col>
                                            <Col xs="auto">
                                                <Button type="button" variant="danger" onClick={() => onDeleteUpdatingPosition(position.teamId)}>&times;</Button>
                                            </Col>
                                        </Row>
                                    )}
                                    <Row className="p-2">
                                        <Col>
                                            <Form.Select
                                                name="tempUpdateTeam"
                                                value={tempUpdatingPosition.teamId}
                                                onChange={onUpdatingTeamsSelect}
                                            >
                                                <option>Team</option>
                                                {teams.map((team: Team) =>
                                                    <option key={team.id} value={team.id}>{team.name}</option>
                                                )}
                                            </Form.Select>
                                        </Col>
                                        <Col>
                                            <Form.Select
                                                name="tempUpdatePosition"
                                                value={tempUpdatingPosition.type}
                                                onChange={onUpdatingPositionsSelect}
                                            >
                                                {GetPositionsArray().map((key: number) =>
                                                    <option value={key} key={key}>
                                                        {GetPositionDisplayName(PositionType[key])}
                                                    </option>
                                                )}
                                            </Form.Select>
                                        </Col>
                                        <Col xs="auto">
                                            <Button type="button" onClick={onAddUpdatingPosition}>+</Button>
                                        </Col>
                                    </Row>
                                    <Row className="p-2 gx-2">
                                        <Col>
                                            <Button type="submit">
                                                {!updateLoading ? 'Update' :
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    />
                                                }
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button type="button" onClick={onDeleteClick} className="btn-danger">Delete</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Form>
                        </Col>
                    )}
                </Row>
            </Container>
        </Container>
    )
}

export default Players;