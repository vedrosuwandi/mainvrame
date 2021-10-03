import Nav from '../Components/Navbar';
import {Button} from 'react-bootstrap';
import './Explore.css';

import Footer from '../Components/Footer';


const Explore = () => {

    return (
        <div className="explore" >
            <Nav />
            <div className="explore-content">
                <div class="jumbotron jumbotron-fluid">
                    <div class="jumbotron-container">
                        <h1>Selamat datang di MainVRame Academy</h1>
                        <p>MainVRame Academy sedang dalam tahap finalisasi. 
                            Daftarkan dirimu dalam Academy kami untuk jadi yang pertama menjelajah ruang virtual dan 
                            berkenalan dengan para VTuber favoritmu nanti.
                        </p>
                        <Button id="enter-button" href="/academy/explore/academy">
                            Masuk ke Academy
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Explore
