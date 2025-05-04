import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../MaintanceHistoryForm/MaintanceHistoryForm.css';

const MaintanceHistoryForm = () => {
    const navigate = useNavigate();
    const { regNo } = useParams();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        equipment: '',
        regNo: regNo,
        workRemarks: '',
        mechanics: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancel = () => {
        navigate(`/maintanance-history/${formData.regNo}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:3001/service-history/add-maintanance-history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            const result = await response.json();
            setMessage('Maintenance record submitted successfully!');

            // Reset form
            setFormData({
                date: '',
                equipment: '',
                regNo: '',
                workRemarks: '',
                mechanics: ''
            });

            // Redirect after delay
            setTimeout(() => {
                navigate(`/maintenance-history${formData.regNo}`);
            }, 2000);

        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="maintenance-form-container">
            <div className="form-header">
                <h2>Equipment Maintenance Form</h2>
            </div>

            {message && (
                <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="date">Date:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="equipment">Equipment:</label>
                        <input
                            type="text"
                            id="equipment"
                            name="equipment"
                            value={formData.equipment}
                            onChange={handleChange}
                            placeholder="Enter equipment name"
                            required
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="regNo">Equipment No:</label>
                        <input
                            type="text"
                            id="regNo"
                            name="regNo"
                            value={formData.regNo}
                            onChange={handleChange}
                            placeholder="Enter equipment number"
                            required
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="mechanics">Mechanics:</label>
                        <input
                            type="text"
                            id="mechanics"
                            name="mechanics"
                            value={formData.mechanics}
                            onChange={handleChange}
                            placeholder="Enter mechanic's name"
                            required
                            className="input-field"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="workRemarks">Work Remarks:</label>
                    <textarea
                        id="workRemarks"
                        name="workRemarks"
                        value={formData.workRemarks}
                        onChange={handleChange}
                        placeholder="Enter work remarks and details"
                        rows="5"
                        required
                        className="input-field textarea"
                    />
                </div>

                <div className="button-group">
                    <button type="button" onClick={handleCancel} className="cancel-btn">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="submit-btn">
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MaintanceHistoryForm;
