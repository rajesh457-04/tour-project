import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './form.css';

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

    const handleChange = ({ target: { name, value, type, checked } }) => {
        setFormData(prev => ({
            ...prev,
            [type === 'checkbox' ? name : name]: type === 'checkbox'
                ? checked
                    ? [...(prev[name] || []), value]
                    : prev[name].filter(item => item !== value)
                : value
        }));

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateStep = () => {
        const newErrors = {};
        if (step === 1 && !formData.username.trim()) newErrors.username = "Username is required";
        if (step === 2 && (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))) {
            newErrors.email = formData.email ? "Invalid email format" : "Email is required";
        }
        if (step === 3 && !formData.destination) newErrors.destination = "Destination is required";
        if (step === 4) {
            if (!formData.dateFrom) newErrors.dateFrom = "Start date is required";
            if (!formData.dateTo) newErrors.dateTo = "End date is required";
            if (formData.dateFrom && formData.dateTo && new Date(formData.dateFrom) >= new Date(formData.dateTo)) {
                newErrors.dateTo = "End date must be after start date";
            }
        }
        if (step === 5 && formData.preferredModeOfTransport.length === 0) {
            newErrors.preferredModeOfTransport = "Select at least one transport mode";
        }
        if (step === 6 && !formData.travelCompanion) newErrors.travelCompanion = "Travel companion is required";
        if (step === 7 && !formData.languagePreferences.trim()) {
            newErrors.languagePreferences = "Language preference is required";
        }
        if (step === 8 && !formData.preferredGuideType) newErrors.preferredGuideType = "Guide type preference is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => validateStep() && setStep(prev => prev + 1);
    const handlePreviousStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;
    
        try {
            const { data } = await axios.post('http://localhost:5000/api/Tourist/tourist-register', formData);
            localStorage.setItem('token', data.token);
    
            if (data.booking) {
                // Include guide information in the alert message
                alert(`Registration successful! Guide assigned: ${data.assignedGuide.username}, located in ${data.assignedGuide.location}.`);
                navigate('/my-bookings'); // Navigate to "My Bookings" if guide assigned
            } else {
                alert('Registration successful! No guides available.');
                navigate('/dashboard'); // Navigate to dashboard if no guide is available
            }
        } catch (err) {
            alert('Error: ' + (err.response?.data?.message || err.message));
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <label>Step 1: Choose a Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            className={errors.username ? "error" : ""}
                        />
                        {errors.username && <p className="error-message">{errors.username}</p>}
                    </div>
                );
            case 2:
                return (
                    <div>
                        <label>Step 2: Enter Your Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
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
                    <div>
                        <label>Step 4: Travel Dates</label>
                        <input
                            type="date"
                            name="dateFrom"
                            value={formData.dateFrom}
                            onChange={handleChange}
                            className={errors.dateFrom ? "error" : ""}
                        />
                        {errors.dateFrom && <p className="error-message">{errors.dateFrom}</p>}

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
                    <div>
                        <label>Step 5: Preferred Modes of Transport</label>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    name="preferredModeOfTransport"
                                    value="Car"
                                    checked={formData.preferredModeOfTransport.includes("Car")}
                                    onChange={handleChange}
                                />
                                Car
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="preferredModeOfTransport"
                                    value="Bike"
                                    checked={formData.preferredModeOfTransport.includes("Bike")}
                                    onChange={handleChange}
                                />
                                Bike
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="preferredModeOfTransport"
                                    value="Bus"
                                    checked={formData.preferredModeOfTransport.includes("Bus")}
                                    onChange={handleChange}
                                />
                                Bus
                            </label>
                        </div>
                        {errors.preferredModeOfTransport && <p className="error-message">{errors.preferredModeOfTransport}</p>}
                    </div>
                );
                case 6:
                    return (
                        <div>
                            <label>Step 6: Travel Companion</label>
                            <select
                                name="travelCompanion"
                                value={formData.travelCompanion}
                                onChange={handleChange}
                                className={errors.travelCompanion ? "error" : ""}
                            >
                                <option value="">Select...</option>
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
                    <div>
                        <label>Step 7: Language Preferences</label>
                        <input
                            type="text"
                            name="languagePreferences"
                            placeholder="Enter your preferred languages"
                            value={formData.languagePreferences}
                            onChange={handleChange}
                            className={errors.languagePreferences ? "error" : ""}
                        />
                        {errors.languagePreferences && <p className="error-message">{errors.languagePreferences}</p>}
                    </div>
                );
            case 8:
                return (
                    <div>
                        <label>Step 8: Preferred Guide Type</label>
                        <select
                            name="preferredGuideType"
                            value={formData.preferredGuideType}
                            onChange={handleChange}
                            className={errors.preferredGuideType ? "error" : ""}
                        >
                            <option value="">Select...</option>
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
        <div className="tourist-form">
            <form onSubmit={handleSubmit}>
                {renderStep()}
                <div className="buttons">
                    {step > 1 && <button type="button" onClick={handlePreviousStep}>Previous</button>}
                    {step < 8 ? (
                        <button type="button" onClick={handleNextStep}>Next</button>
                    ) : (
                        <button type="submit">Submit</button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TouristForm;
