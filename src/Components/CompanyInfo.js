import './CompanyInfo.css';

const CompanyInfo = () => {
    return ( 
        <div className="info-content">
            <h2>
                Company
            </h2>
            <ul className="company-info">
                <li>
                    <a href="/">OmniVR</a>
                </li>
                <li>
                    <a href="/">NaoBun</a>
                </li>
            </ul>
        </div>
     );
}
 
export default CompanyInfo;