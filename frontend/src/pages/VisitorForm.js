import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';
import './VisitorForm.css';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';


const VisitorForm = () => {
    const sigPad = useRef({});
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', organization: '', address: '', purpose: '', personToVisit: '', });

    const employees = ['Rajesh Bhuyan', 'Dr. Antara Bera', 'Anandita Ray Mukherjee', 'Dipanjan Sarkar', 'Sarbajit Ghosh', 'Others'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const clearSignature = () => {
        sigPad.current.clear();
    };

    const clearForm = () => {
        setFormData({ name: '', phone: '', email: '', organization: '', address: '', purpose: '', personToVisit: '', });
        clearSignature();
    }

    const validateFields = () => {
        const { name, phone, purpose, email } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name.trim()) {
            Swal.fire('Validation Error', 'Name is required.', 'error');
            return false;
        }
        if (!phone.trim()) {
            Swal.fire('Validation Error', 'Phone number is required.', 'error');
            return false;
        }
        if (!purpose.trim()) {
            Swal.fire('Validation Error', 'Purpose is required.', 'error');
            return false;
        }
        if (email.trim() !== '' && !emailRegex.test(email)) {
            Swal.fire('Validation Error', 'Please enter a valid email address.', 'error');
            return false;
        }
        if (sigPad.current.isEmpty()) {
            Swal.fire('Validation Error', 'Signature is required.', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        const signature = sigPad.current.toDataURL('image/png');

        try {
            const response = await axios.post('http://localhost:5000/api/visitor/submit', {
                ...formData,
                signature
            });

            Swal.fire('Success', response.data.message || 'Visitor submitted successfully!', 'success');
            clearForm();
        } catch (err) {
            console.error('Submission error:', err);

            const errorMsg =
                err.response?.data?.error || 'Submission failed. Please try again.';
            Swal.fire('Error', errorMsg, 'error');
        }
    };

    const navigate = useNavigate();

    const goBackHome = () => {
        navigate('/');
    };

    return (
        <Container
            className="py-5 d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh', backgroundImage: "url('/Form Login.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', }}>
            <Card
                className="shadow-lg p-4"
                style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '15px', width: '100%', maxWidth: '700px', border: '1px solid rgba(255, 255, 255, 0.4)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', }}>
                <Card.Title className="text-center mb-4 fs-3 text-success">Visitor Registration Form</Card.Title>
                <div className="mb-3 text-start">
                    <Button variant="btn btn-outline-primary" onClick={goBackHome}>
                        <FaHome className="me-2" />
                        Back to Home
                    </Button>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className='text-black'>Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control className='bg-secondary-subtle' type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Your full name" />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className='text-black'>Phone Number <span className="text-danger">*</span></Form.Label>
                                <Form.Control className='bg-secondary-subtle' type="number" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className='text-black'>Email</Form.Label>
                                <Form.Control className='bg-secondary-subtle' type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className='text-black'>From Where / Organization</Form.Label>
                                <Form.Control className='bg-secondary-subtle' type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Enter organization" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label className='text-black'>Address</Form.Label>
                        <Form.Control className='bg-secondary-subtle' as="textarea" rows={2} name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='text-black'>Purpose <span className="text-danger">*</span></Form.Label>
                        <Form.Control className='bg-secondary-subtle' type="text" name="purpose" value={formData.purpose} onChange={handleChange} placeholder="Purpose of visit" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='text-black'>Specific Employee to Meet</Form.Label>
                        <Form.Select className='bg-secondary-subtle' name="personToVisit" value={formData.personToVisit} onChange={handleChange} >
                            <option value="">-- Select Employee --</option>
                            {employees.map((emp, i) => (
                                <option key={i} value={emp}>{emp}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label className='text-black'>Signature <span className="text-danger">*</span></Form.Label>
                        <div className="signature-pad mb-2 bg-secondary-subtle">
                            <SignaturePad
                                ref={sigPad}
                                canvasProps={{ className: 'sigCanvas' }}
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                            <Button className="btn-warning" onClick={clearSignature}>Clear Signature</Button>
                            <Button className="btn-danger" onClick={clearForm}>Clear Form</Button>
                        </div>
                    </Form.Group>

                    <div className="text-center">
                        <Button type="submit" variant="success" size="lg">Submit</Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default VisitorForm;
