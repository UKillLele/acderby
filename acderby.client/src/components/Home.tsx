import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";


const Home = () => {
    return (
        <div className="content bg-img" style={{ backgroundImage: 'url("https://acrdphotos.blob.core.windows.net/photos/priestess.jpg")' }}>
            <Container fluid className="text-light h-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <h2 className="xl-title mb-5 text-shadow">2024 Season Passes on sale now!</h2>
                    <Link className="btn btn-primary btn-lg" to="tickets">Tickets</Link>
                </div>
            </Container>
        </div>
    );
}

export default Home;