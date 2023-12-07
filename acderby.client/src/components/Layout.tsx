import { Outlet, NavLink } from 'react-router-dom'
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap'

const Layout = () => {

    const userInfo = localStorage.getItem("userInfo");
    let editor;
    if (userInfo) {
        const role = JSON.parse(userInfo).role;
        if (role === "Admin" || role === "Editor") editor = true;
    }
    return (
        <Container fluid className="bg-dark text-light page-bg" data-bs-theme="dark">
            <Navbar expand="lg">
                <Container className="fs-4">
                    <Navbar.Brand as={NavLink} to="/" className="d-lg-none">
                        <img alt="Assassination City Roller Derby"
                            src="/images/logo-black.gif"
                            width="120"
                            height="120"
                            className="d-inline-block align-top"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse className="justify-content-center">
                        <Nav className="text-shadow">
                            <Nav.Link as={NavLink} to="/" className="my-auto">Home</Nav.Link>
                            <NavDropdown title="Events" className="my-auto">
                                <NavDropdown.Item as={NavLink} to="/events">Events</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/season">2023 Season</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/tickets">Tickets</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="About" className="my-auto">
                                <NavDropdown.Item as={NavLink} to="/league">Our League</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/derby">Roller Derby</NavDropdown.Item>
                                {/*<NavDropdown.Item as={NavLink} to="/sponsors">Sponsors</NavDropdown.Item>*/}
                            </NavDropdown>
                            <NavDropdown title="Teams" className="my-auto">
                                <NavDropdown.Header>Travel Team</NavDropdown.Header>
                                <NavDropdown.Item as={NavLink} to="teams/conspiracy">Conspiracy</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Header>Home Teams</NavDropdown.Header>
                                <NavDropdown.Item as={NavLink} to="teams/bombshells">Bombshell Brigade</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="teams/dk">Deadly Kennedys</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="teams/lsa">Lone Star Assassins</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="teams/la-rev">&iexcl;Viva La Revoluci&oacute;n!</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Header>Volunteers</NavDropdown.Header>
                                <NavDropdown.Item as={NavLink} to="teams/officials">Internal Affairs</NavDropdown.Item>
                                {editor && 
                                    <>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Header>Editor</NavDropdown.Header>
                                        <NavDropdown.Item as={NavLink} to="/players">Edit People</NavDropdown.Item>
                                    </>
                                }
                            </NavDropdown>
                            <Navbar.Brand as={NavLink} to="/" className="d-none d-lg-block mx-5">
                                <img alt="Assassination City Roller Derby"
                                    src="/images/logo-black.gif"
                                    width="120"
                                    height="120"
                                    className="d-inline-block align-top"
                                />
                            </Navbar.Brand>
                            <Nav.Link as={NavLink} to="/shop" className="my-auto">Shop</Nav.Link>
                            <Nav.Link as={NavLink} to="/join" className="my-auto">Join</Nav.Link>
                            {/*<Nav.Link as={NavLink} to="/news" className="my-auto">News</Nav.Link>*/}
                            <Nav.Link as={NavLink} to="/contact" className="my-auto">Contact</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </Container>
    )
}

export default Layout;