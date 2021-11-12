
import {Button} from 'react-bootstrap'
import IconButton from '@mui/material/IconButton';

import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import BorderColorIcon from '@mui/icons-material/BorderColor';

import './ProfileDetails.css';

const ProfileDetails = ({ user, logout}) => {


    return ( 
        <div className="profiledetails-container">
            <div className="profiledetails-username">
                <PersonIcon style={{marginRight: "15px"}} />
                {user.Username}
                <div className="profiledetails-username-edit">
                    <IconButton>
                        <BorderColorIcon />
                    </IconButton>
                </div>
            </div>

            <div className="profiledetails-email">
                <EmailIcon style={{marginRight: "15px"}} />
                {/* {user.Contact.Email} */}
                {user.Contact.Email}
                <div className="profiledetails-email-edit">
                    <IconButton>
                        <BorderColorIcon />
                    </IconButton>
                </div>
            </div>

            <div className="profiledetails-phone">
                <PhoneIcon style={{marginRight: "15px"}} />
                {user.Contact.Phone}
                <div className="profiledetails-phone-edit">
                    <IconButton>
                        <BorderColorIcon />
                    </IconButton>
                </div>
            </div>

            <footer className="profiledetails-actions">
                <div className="profiledetails-actions-wrapper">
                    <div className="profiledetails-changepass">
                        <Button id="changepass-button">Change Password</Button>
                    </div>

                    <div className="profiledetails-logout">
                        <Button id="logout-button" variant="danger" onClick={logout}>Log Out</Button>
                    </div>
                </div>
            </footer>
        </div>
     );
}
 
export default ProfileDetails;