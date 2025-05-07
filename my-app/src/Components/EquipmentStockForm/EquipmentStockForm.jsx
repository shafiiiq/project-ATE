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
    
    // Image upload limits
    const MAX_FILE_SIZE = 2048 * 2048; // 2MB per file
    const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 20MB total
    const MAX_FILES = 10; // Maximum 10 files

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

    // Handle image selection with validation
    const handleImageChange = (e) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            
            // Calculate current total size
            const currentTotalSize = formData.images.reduce((sum, img) => sum + img.size, 0);
            
            // Validate number of files
            if (formData.images.length + selectedFiles.length > MAX_FILES) {
                setError(`You can upload a maximum of ${MAX_FILES} images`);
                return;
            }
            
            // Validate files
            let newTotalSize = currentTotalSize;
            const validFiles = [];
            
            for (const file of selectedFiles) {
                // Check file size
                if (file.size > MAX_FILE_SIZE) {
                    setError(`File ${file.name} exceeds the maximum size of 2MB`);
                    return;
                }
                
                // Check total size
                newTotalSize += file.size;
                if (newTotalSize > MAX_TOTAL_SIZE) {
                    setError(`Total file size exceeds the maximum of 20MB`);
                    return;
                }
                
                validFiles.push(file);
            }
            
            setError(null);
            setFormData({
                ...formData,
                images: [...formData.images, ...validFiles]
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
        // Clear error when removing images
        setError(null);
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
    
    // Handle form submission with chunked uploads
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // First send the basic equipment data
            const equipmentData = {
                equipmentName: formData.equipmentName,
                equipmentNo: formData.equipmentNo,
                totalCounterWeight: formData.totalCounterWeight,
                counterWeights: formData.counterWeights
            };
            
            // First request - send equipment data without images
            const equipmentResponse = await fetch('http://localhost:3001/stocks/add-handover-report', {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": "*/*"
                },
                body: JSON.stringify(equipmentData)
            });
            
            if (!equipmentResponse.ok) {
                throw new Error('Failed to save equipment data');
            }
            
            const equipmentResult = await equipmentResponse.json();
            const equipmentId = equipmentResult.id; // Assuming your API returns the created equipment ID
            
            // Then upload images individually if there are any
            if (formData.images.length > 0) {
                for (let i = 0; i < formData.images.length; i++) {
                    const imageData = new FormData();
                    imageData.append('equipmentId', equipmentId);
                    imageData.append('image', formData.images[i]);
                    
                    const imageResponse = await fetch('http://localhost:3001/stocks/add-equipment-image', {
                        method: "POST",
                        body: imageData
                    });
                    
                    if (!imageResponse.ok) {
                        throw new Error(`Failed to upload image ${i+1}`);
                    }
                }
            }
            
            // Success handling
            setSuccess(true);
            setFormData({
                equipmentName: '',
                equipmentNo: '',
                counterWeights: [{ weight: '' }],
                totalCounterWeight: 0,
                images: []
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
                    <label>Equipment Photos (Max: 10 images, 2MB per image, 20MB total)</label>
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
                            <span className="file-size">
                                {" - "}
                                {(formData.images.reduce((sum, img) => sum + img.size, 0) / (1024 * 1024)).toFixed(2)}MB
                            </span>
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