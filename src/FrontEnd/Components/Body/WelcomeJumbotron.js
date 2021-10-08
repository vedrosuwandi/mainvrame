import './WelcomeJumbotron.css';
import {Button} from 'react-bootstrap';

const WelcomeJumbotron = () => {
    return ( 
        <div className="jumbotron-content">
            <div class="jumbotron jumbotron-fluid">
                <div class="jumbotron-container">
                    <h1>Selamat datang di MainVRame Academy</h1>
                    <p>MainVRame Academy sedang dalam tahap finalisasi. 
                        Daftarkan dirimu dalam Academy kami untuk jadi yang pertama menjelajah ruang virtual dan 
                        berkenalan dengan para VTuber favoritmu nanti.
                    </p>
                    <Button id="enter-button" href="/academy/explore" >
                        Masuk ke Academy
                    </Button>
                </div>
            </div>
        </div>
     );
}
 
export default WelcomeJumbotron;