import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { format } from 'date-fns';
import DateRangePickerComponent from '../components/DateRangePicker';

import { Container, Button, Table, Row, Col, Form } from 'react-bootstrap';
import { BiLogOutCircle } from "react-icons/bi";
import Skeleton from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';
import moment from 'moment';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState([{ startDate: new Date(new Date().setDate(new Date().getDate() - 30)), endDate: new Date(), key: 'selection', },]);
    const [selectedEmployee, setSelectedEmployee] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const EMPLOYEE_OPTIONS = ['All', 'Rajesh Bhuyan', 'Dr. Antara Bera', 'Anandita Ray Mukherjee', 'Dipanjan Sarkar', 'Sarbajit Ghosh', 'Others'];

    const formatDate = (date) => format(date, 'yyyy-MM-dd');
    const startDate = formatDate(dateRange[0].startDate);
    const endDate = formatDate(dateRange[0].endDate);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    useEffect(() => {
        const controller = new AbortController();
        const fetchVisitors = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) return navigate('/');

                const params = {
                    startDate,
                    endDate,
                    searchTerm,
                    page: currentPage,
                    limit: 25,
                    ...(selectedEmployee !== 'All' && { employee: selectedEmployee }),
                };

                const response = await axios.get('http://localhost:5000/api/visitor/getVisitors', {
                    headers: { Authorization: `Bearer ${token}` },
                    params,
                    signal: controller.signal,
                });

                setVisitors(response.data.visitors || []);
                setTotalPages(response.data.totalPages || 1);
                setCurrentPage(response.data.currentPage || 1);

            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error('Error fetching visitors:', error);
                    navigate('/admin');
                }
            } finally {
                setLoading(false);
            }
        };

        const debounceFetch = setTimeout(() => {
            fetchVisitors();
        }, 300);

        return () => {
            controller.abort();
            clearTimeout(debounceFetch);
        };
    }, [startDate, endDate, selectedEmployee, searchTerm, currentPage, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const handleDateChange = ({ fullRange }) => {
        setDateRange(fullRange);
        setShowDatePicker(false);
        setCurrentPage(1);

    };

    return (
        <Container fluid className="py-4" style={{ background: 'rgb(194 215 247 / 42%)', minHeight: '100vh' }}>
            <div className="card shadow rounded-4 border-0 p-3" style={{ backgroundColor: 'white' }}>
                <div className="card-body rounded-4">
                    <Row className="align-items-center mb-4">
                        <Col><h4 className="fw-bold text-primary mb-0">Admin Dashboard</h4></Col>
                        <Col className="text-end">
                            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                                <BiLogOutCircle size={20} />
                            </Button>
                        </Col>
                    </Row>

                    <div className="card shadow-sm rounded-4 border-0 mb-4">
                        <div className="card-body rounded-4" style={{ backgroundColor: "#87b2ff87" }}>
                            <Row className="align-items-end justify-content-between g-2">
                                <Col md={4} lg={3}>
                                    <Form.Label className="fw-semibold small text-muted">Filter by Date</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type="text"
                                            readOnly
                                            value={`${startDate} to ${endDate}`}
                                            onClick={() => setShowDatePicker(!showDatePicker)}
                                            className="form-control form-control-sm pe-5 rounded"
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <span onClick={() => setShowDatePicker(!showDatePicker)} style={{
                                            position: 'absolute', right: '10px', top: '50%',
                                            transform: 'translateY(-50%)', cursor: 'pointer',
                                            color: '#0d6efd', fontSize: '1.1rem',
                                        }}>📅</span>
                                        {showDatePicker && (
                                            <DateRangePickerComponent
                                                initialRange={dateRange}
                                                onDateChange={handleDateChange}
                                            />
                                        )}
                                    </div>
                                </Col>

                                <Col md={3} lg={2}>
                                    <Form.Label className="fw-semibold small text-muted">Filter by Employee</Form.Label>
                                    <Form.Select
                                        size="sm"
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                        className="rounded"
                                    >
                                        {EMPLOYEE_OPTIONS.map((name) => (
                                            <option key={name} value={name}>{name}</option>
                                        ))}
                                    </Form.Select>
                                </Col>

                                <Col md={5} lg={4}>
                                    <Form.Label className="fw-semibold small text-muted">Search by Visitor Name</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type="text"
                                            placeholder="Search by name"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="rounded-pill form-control-sm pe-5 shadow-sm"
                                        />
                                        <span className="position-absolute" style={{
                                            right: '15px', top: '50%',
                                            transform: 'translateY(-50%)',
                                            fontSize: '1rem', color: '#0d6efd',
                                        }}>🔍</span>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>

                    <div className="card shadow-sm rounded-4 border-0" style={{ backgroundColor: "#edf4ff" }}>
                        <div className="card-body p-3">
                            <div className="table-responsive">
                                <Table hover className="align-middle mb-0">
                                    <thead className="bg-light text-muted small">
                                        <tr>
                                            <th className="fw-semibold">Name</th>
                                            <th className="fw-semibold">Phone</th>
                                            <th className="fw-semibold">Email</th>
                                            <th className="fw-semibold">Organization</th>
                                            <th className="fw-semibold">Purpose</th>
                                            <th className="fw-semibold">Person to Meet</th>
                                            <th className="fw-semibold">Date & Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            [...Array(5)].map((_, idx) => (
                                                <tr key={idx}>
                                                    {Array(7).fill().map((__, colIdx) => (
                                                        <td key={colIdx}><Skeleton height={20} /></td>
                                                    ))}
                                                </tr>
                                            ))
                                        ) : visitors.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center text-muted">No data available</td>
                                            </tr>
                                        ) : (
                                            visitors.map((visitor) => (
                                                <tr key={visitor._id} className="border-bottom">
                                                    <td className="text-dark">{visitor.name}</td>
                                                    <td >{visitor.phone}</td>
                                                    <td className="text-muted small">{visitor.email}</td>
                                                    <td>{visitor.organization}</td>
                                                    <td>{visitor.purpose}</td>
                                                    <td>{visitor.personToVisit}</td>
                                                    <td className="text-primary">{moment(visitor.timestamp).format('llll')}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>

                    {totalPages && (
                        <div className="d-flex justify-content-center align-items-center gap-3 mt-4 mb-3 flex-wrap">
                            <Button size="sm" variant="outline-primary" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-3" >
                                ← Previous
                            </Button>

                            <span className="badge rounded-pill bg-success-subtle text-dark px-3 py-2 shadow-sm border">
                                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                            </span>

                            <Button size="sm" variant="outline-primary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="px-3" >
                                Next →
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </Container >
    );
};

export default AdminDashboard;
