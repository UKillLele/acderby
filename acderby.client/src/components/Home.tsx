import { Button, Container } from "react-bootstrap";


const Home = () => {
    return (
        <div className="content bg-img" style={{ backgroundImage: 'url("/images/priestess.jpg")' }}>
            <Container fluid className="text-light h-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <h2 className="fs-1 mb-5 text-shadow">Game 1 Tickets and 2024 Season Passes on sale now!</h2>
                    <Button size="lg">Tickets</Button>
                </div>
            </Container>
        </div>
    );
}

export default Home;