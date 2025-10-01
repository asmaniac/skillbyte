import React from 'react';

import {Link} from 'react-router-dom';
import '../css/Welcome.css';

const Welcome =() => {
    return (
        <div className="welcome-container">
            <h1>"Welcome to SkillByte!"</h1>
            <p>Your one-stop solution for crafting tailored resumes and cover letters to land your dream job.</p>



            {/*link to dashboard*/}
            <div className="welcome-buttons">
            <Link to="/login" className="btn">Login</Link>
            </div>
        </div>
    )
}
export default Welcome;