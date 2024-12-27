import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './form.css'; // Ensure to create or update this CSS file for proper styling

const TouristForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        destination: '',
        dateFrom: '',
        dateTo: '',
        preferredModeOfTransport: [],
        travelCompanion: '',
        languagePreferences: '',
        preferredGuideType: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prevData => {
                const currentArray = prevData[name] || [];
                if (checked) {
                    return { ...prevData, [name]: [...currentArray, value] };
                } else {
                    return { ...prevData, [name]: currentArray.filter(item => item !== value) };
                }
            });
        } else {
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }

        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    const validateStep = () => {
        const newErrors = {};
        switch(step) {
            case 1:
                if (!formData.username.trim()) newErrors.username = "Username is required";
                break;
            case 2:
                if (!formData.email.trim()) newErrors.email = "Email is required";
                else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
                break;
            case 3:
                if (!formData.destination) newErrors.destination = "Destination is required";
                break;
            case 4:
                if (!formData.dateFrom) newErrors.dateFrom = "Start date is required";
                if (!formData.dateTo) newErrors.dateTo = "End date is required";
                if (new Date(formData.dateTo) <= new Date(formData.dateFrom)) {
                    newErrors.dateTo = "End date must be after start date";
                }
                break;
            case 5:
                if (formData.preferredModeOfTransport.length === 0) {
                    newErrors.preferredModeOfTransport = "Select at least one mode of transport";
                }
                break;
            case 6:
                if (!formData.travelCompanion) newErrors.travelCompanion = "Travel companion is required";
                break;
            case 7:
                if (!formData.languagePreferences.trim()) newErrors.languagePreferences = "Language preference is required";
                break;
            case 8:
                if (!formData.preferredGuideType) newErrors.preferredGuideType = "Guide type preference is required";
                break;
            default:
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const handlePreviousStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        try {
            const response = await axios.post('http://localhost:5000/api/Tourist/tourist-register', formData);
            
            localStorage.setItem('token', response.data.token);
            
            if (response.data.booking) {
                alert('Registration successful and a booking has been created for you!');
                navigate('/my-bookings');
            } else {
                alert('Registration successful!');
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Error during submission:", err.response ? err.response.data : err.message);
            alert('Error during submission: ' + (err.response?.data?.message || err.message));
        }
    };

    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <div className="form-step">
                        <h3>Step 1: Choose a Username</h3>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your preferred username"
                            value={formData.username}
                            onChange={handleChange}
                            className={errors.username ? "error" : ""}
                        />
                        {errors.username && <p className="error-message">{errors.username}</p>}
                    </div>
                );
            case 2:
                return (
                    <div className="form-step">
                        <h3>Step 2: Your Email</h3>
                        <input
                            type="email"
                            name="email"
                            placeholder="example@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? "error" : ""}
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>
                );
            case 3:
                return (
                    <div className="form-step">
                        <h3>Step 3: Choose Destination</h3>
                        <select
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            className={errors.destination ? "error" : ""}
                        >
                            <option value="">Select Destination</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Chennai">Chennai</option>
                        </select>
                        {errors.destination && <p className="error-message">{errors.destination}</p>}
                    </div>
                );
            case 4:
                return (
                    <div className="form-step">
                        <h3>Step 4: Travel Dates</h3>
                        <label>From:</label>
                        <input
                            type="date"
                            name="dateFrom"
                            value={formData.dateFrom}
                            onChange={handleChange}
                            className={errors.dateFrom ? "error" : ""}
                        />
                        {errors.dateFrom && <p className="error-message">{errors.dateFrom}</p>}
                        <label>To:</label>
                        <input
                            type="date"
                            name="dateTo"
                            value={formData.dateTo}
                            onChange={handleChange}
                            className={errors.dateTo ? "error" : ""}
                        />
                        {errors.dateTo && <p className="error-message">{errors.dateTo}</p>}
                    </div>
                );
            case 5:
                return (
                    <div className="form-step">
                        <h3>Step 5: Preferred Mode of Transport</h3>
                        <div className="checkbox-group">
                            {['Car', 'Bike', 'Bus', 'Train', 'Flight'].map(transport => (
                                <label key={transport}>
                                    <input
                                        type="checkbox"
                                        name="preferredModeOfTransport"
                                        value={transport}
                                        checked={formData.preferredModeOfTransport.includes(transport)}
                                        onChange={handleChange}
                                    />
                                    {transport}
                                </label>
                            ))} 
                        </div>
                        {errors.preferredModeOfTransport && <p className="error-message">{errors.preferredModeOfTransport}</p>}
                    </div>
                );
                case 6:
                    return (
                        <div className="form-step">
                            <h3>Step 6: Travel Companion</h3>
                            <select
                                name="travelCompanion"
                                value={formData.travelCompanion}
                                onChange={handleChange}
                                className={errors.travelCompanion ? "error" : ""}
                            >
                                <option value="">Select Travel Companion</option>
                                <option value="Family">Family</option>
                                <option value="Friends">Friends</option>
                                <option value="Solo">Solo</option>
                                <option value="Couple">Couple</option>
                                <option value="Group">Group</option>
                            </select>
                            {errors.travelCompanion && <p className="error-message">{errors.travelCompanion}</p>}
                        </div>
                    );
                
            case 7:
                return (
                    <div className="form-step">
                        <h3>Step 7: Language Preferences</h3>
                        <input
                            type="text"
                            name="languagePreferences"
                            placeholder="Enter preferred languages"
                            value={formData.languagePreferences}
                            onChange={handleChange}
                            className={errors.languagePreferences ? "error" : ""}
                        />
                        {errors.languagePreferences && <p className="error-message">{errors.languagePreferences}</p>}
                    </div>
                );
            case 8:
                return (
                    <div className="form-step">
                        <h3>Step 8: Preferred Guide Type</h3>
                        <select
                            name="preferredGuideType"
                            value={formData.preferredGuideType}
                            onChange={handleChange}
                            className={errors.preferredGuideType ? "error" : ""}
                        >
                            <option value="">Select Guide Type</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="No Preference">No Preference</option>
                        </select>
                        {errors.preferredGuideType && <p className="error-message">{errors.preferredGuideType}</p>}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="tourist-form">
            {renderStep()}
            <div className="form-navigation">
                {step > 1 && <button type="button" onClick={handlePreviousStep}>Previous</button>}
                {step < 8 ? (
                    <button type="button" onClick={handleNextStep}>Next</button>
                ) : (
                    <button type="submit">Submit</button>
                )}
            </div>
        </form>
    );
};

export default TouristForm;