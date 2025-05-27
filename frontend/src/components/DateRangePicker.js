import React, { useState, useEffect, useRef } from 'react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../components/DateRangePicker.css';

const DEFAULT_RANGE = {
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
    key: 'selection',
};

const DateRangePickerComponent = ({ onDateChange, initialRange }) => {
    const [range, setRange] = useState(initialRange || [DEFAULT_RANGE]);
    const [visible, setVisible] = useState(true);
    const wrapperRef = useRef();

    const handleSelect = (ranges) => {
        setRange([ranges.selection]);
    };

    const handleApply = () => {
        onDateChange({
            startDate: format(range[0].startDate, 'yyyy-MM-dd'),
            endDate: format(range[0].endDate, 'yyyy-MM-dd'),
            fullRange: range,
        });
        setVisible(false);
    };

    const handleClear = () => {
        setRange([DEFAULT_RANGE]);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!visible) return null;

    return (
        <div
            ref={wrapperRef}
            className="date-range-wrapper fade-in"
            style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                zIndex: 999,
                background: '#fff',
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                borderRadius: '10px',
                padding: '12px',
                fontFamily: 'Arial, sans-serif',
                minWidth: '300px'
            }}
        >
            <DateRange
                ranges={range}
                onChange={handleSelect}
                moveRangeOnFirstSelection={false}
                editableDateInputs={true}
                rangeColors={['#0d6efd']}
                showDateDisplay={false}
            />

            <div className="d-flex justify-content-between mt-2">
                <button onClick={handleClear} className="btn btn-sm btn-outline-secondary" >
                    Clear
                </button>
                <button onClick={handleApply} className="btn btn-sm btn-primary" >
                    Apply
                </button>
            </div>
        </div>
    );
};

export default DateRangePickerComponent;
