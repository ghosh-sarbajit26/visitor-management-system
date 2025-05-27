import React, { useState } from 'react';
import { Button, Form, Container, Card, InputGroup, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaLock, FaLockOpen, FaHandPointRight, FaHandPointLeft } from "react-icons/fa6";

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/admin/login', { email, password });

            if (response.data.success) {
                Swal.fire('Success', 'Login successful!', 'success');
                localStorage.setItem('adminToken', response.data.token);
                navigate('/admin-dashboard');
            }
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Login failed', 'error');
        }
    };

    const goBackHome = () => {
        navigate('/');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f4ff, #e0e7ff)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '30px 15px'
        }}>
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <Card className="shadow-lg border-0 rounded-4 p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                            <div className="text-center mt-2">
                                <img
                                    src="/TSTF_logo.png"
                                    alt="TSTF Logo"
                                    className='shadow-lg'
                                    style={{
                                        maxWidth: '180px',
                                        height: 'auto',
                                        marginBottom: '10px',
                                        borderRadius: '12px'
                                    }}
                                />
                                <h2 className="fw-bold text-success mt-3">Admin Login</h2>
                            </div>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter admin email"
                                        className="py-2"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password"
                                            className="py-2"
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaLock /> : <FaLockOpen />}
                                        </Button>
                                    </InputGroup>
                                </Form.Group>
                                <div className="d-flex justify-content-between">
                                    <div className="text-center">
                                        <Button variant="outline-danger" className="d-flex align-items-center gap-2" onClick={goBackHome}>
                                            <FaHandPointLeft /> <span>Go back</span>
                                        </Button>
                                    </div>
                                    <div className="text-center">
                                        <Button variant="outline-success" className="d-flex align-items-center gap-2" onClick={handleSubmit}>
                                            <span>Login</span> <FaHandPointRight />
                                        </Button>
                                    </div>
                                </div>

                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminLogin;
