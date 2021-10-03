import logo from '../Assets/mainvrame.png';

const Mainvrame_Academy = () => {
    return ( 
    <div style={{display : "flex", justifyContent: "center"}}>
        <img src={logo} alt="logo" style={{width: "50%"}} className="mainvrame"/>
        <h3 style={{marginLeft:"10px" ,alignSelf:"center"}}>Academy</h3>
    </div>
    );
}
 
export default Mainvrame_Academy;