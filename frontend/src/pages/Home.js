import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button} from 'react-bootstrap';

import './Home.css'; 

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="content">
                <div className="custom-card card-with-footer">
                    <h1 className="main-heading">Welcome to the Visitor Management System</h1>
                    <img src='/VMS-logo.png' alt="Logo" className="logo" />
                    <div className="button-container">
                        <Button
                            variant="primary"
                            className="custom-button"
                            onClick={() => navigate('/visitor-registration')}
                        >
                            Visitor Registration
                        </Button>
                        <Button
                            variant="dark"
                            className="custom-button"
                            onClick={() => navigate('/admin')}
                        >
                            Admin Login
                        </Button>
                    </div>
                    <div className="footer">
                        <div className="footer-content">
                            <p className="footer-text">𝘵𝘳𝘶𝘴𝘵𝘦𝘢 Sustainable Tea Foundation</p>
                        </div>
                    </div>
                </div>
            </div >            
        </div>
    );
};

export default Home;
