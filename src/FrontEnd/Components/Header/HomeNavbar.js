import Logo from '../Assets/mainvrame.png';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';

const HomeNavbar = () => {
    return ( 
        <div>
             <Navbar collapseOnSelect expand="lg" >
                <Navbar.Brand href="/" style={{width:"30%"}}>
                    <img src={Logo} id="mainvrame" alt="logo"/>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end" style={{marginRight:"20px"}}>
                    <Nav>
                        <NavDropdown title="MainVrame City" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Pintu Depan</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Academy</NavDropdown.Item>
                            
                        </NavDropdown>
                        <NavDropdown title="Sosial Media" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Facebook</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Twitter</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Instagram</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Perusahaan" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">OmniVR</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">NaoBun</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>  
                </Navbar.Collapse>
            </Navbar>
        </div>
     );
}
 
export default HomeNavbar;