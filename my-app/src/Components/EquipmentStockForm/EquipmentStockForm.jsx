import React, { useState, useEffect } from 'react';
import '../EquipmentStockForm/EquipmentStockForm.css';

const EquipmentStockForm = () => {
    // Form state
    const [formData, setFormData] = useState({
        equipmentName: '',
        equipmentNo: '',
        counterWeights: [{ weight: '' }],
        totalCounterWeight: 0,
        images: []
    });

    // Loading and error states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Handle input change for basic fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle counter weight changes
    const handleCounterWeightChange = (index, value) => {
        const updatedWeights = [...formData.counterWeights];
        updatedWeights[index] = { weight: value };

        setFormData({
            ...formData,
            counterWeights: updatedWeights
        });
    };

    // Add more counter weight input
    const addCounterWeight = () => {
        setFormData({
            ...formData,
            counterWeights: [...formData.counterWeights, { weight: '' }]
        });
    };

    // Remove counter weight input
    const removeCounterWeight = (index) => {
        const updatedWeights = [...formData.counterWeights];
        updatedWeights.splice(index, 1);

        setFormData({
            ...formData,
            counterWeights: updatedWeights
        });
    };

    // Handle image selection
    const handleImageChange = (e) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files);
            setFormData({
                ...formData,
                images: [...formData.images, ...newImages]
            });
        }
    };

    // Remove selected image
    const removeImage = (index) => {
        const updatedImages = [...formData.images];
        updatedImages.splice(index, 1);

        setFormData({
            ...formData,
            images: updatedImages
        });
    };

    // Calculate total counter weight
    useEffect(() => {
        const total = formData.counterWeights.reduce((sum, item) => {
            const weight = parseFloat(item.weight) || 0;
            return sum + weight;
        }, 0);

        setFormData(prev => ({
            ...prev,
            totalCounterWeight: total
        }));
    }, [formData.counterWeights]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Create FormData object for file upload
            const data = new FormData();
            data.append('equipmentName', formData.equipmentName);
            data.append('equipmentNo', formData.equipmentNo);
            data.append('totalCounterWeight', formData.totalCounterWeight);

            // Add counter weights
            data.append('counterWeights', JSON.stringify(formData.counterWeights));

            // Add images
            formData.images.forEach((image, index) => {
                data.append('images', image);
            });

            fetch('http://localhost:3001/stocks/add-handover-report', {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    'Content-Type': 'application/json'
                },
                body: data
            }).then((result) => result.json())
                .then((data) => {
                    console.log('Saved successfully:', data);
                    setSuccess(true);
                    setFormData({
                        equipmentName: '',
                        equipmentNo: '',
                        counterWeights: [{ weight: '' }],
                        totalCounterWeight: 0,
                        images: []
                    })
                });

        } catch (err) {
            setError(err.message || 'An error occurred');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="equipment-stock-container">
            <h2>Equipment Stock Form</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Equipment data saved successfully!</div>}

            <form onSubmit={handleSubmit} className="equipment-form">
                <div className="form-group">
                    <label htmlFor="equipmentName">Equipment Name</label>
                    <input
                        type="text"
                        id="equipmentName"
                        name="equipmentName"
                        value={formData.equipmentName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="equipmentNo">Equipment Number</label>
                    <input
                        type="text"
                        id="equipmentNo"
                        name="equipmentNo"
                        value={formData.equipmentNo}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group counter-weights-section">
                    <label>Counter Weights</label>
                    {formData.counterWeights.map((weight, index) => (
                        <div key={index} className="counter-weight-row">
                            <input
                                type="number"
                                placeholder="Weight in kg"
                                value={weight.weight}
                                onChange={(e) => handleCounterWeightChange(index, e.target.value)}
                                required
                            />
                            {index > 0 && (
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeCounterWeight(index)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        className="add-btn"
                        onClick={addCounterWeight}
                    >
                        Add Counter Weight
                    </button>
                </div>

                <div className="form-group">
                    <label htmlFor="totalCounterWeight">Total Counter Weight (kg)</label>
                    <input
                        type="number"
                        id="totalCounterWeight"
                        name="totalCounterWeight"
                        value={formData.totalCounterWeight}
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label>Equipment Photos</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="file-input"
                    />
                    <div className="selected-images">
                        {formData.images.map((image, index) => (
                            <div key={index} className="image-preview-container">
                                <div className="image-preview">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index}`}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeImage(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    {formData.images.length > 0 && (
                        <div className="image-count">
                            {formData.images.length} image(s) selected
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Equipment Data'}
                </button>
            </form>
        </div>
    );
};

export default EquipmentStockForm;