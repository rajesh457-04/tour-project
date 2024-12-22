import React, { useState } from 'react';
import axios from 'axios';
import './form.css';

const GuideForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        guideExperience: '',
        modeOfTransport: [],
        languagesSpoken: '',
        guideType: '',
        location: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData(prevData => ({
                ...prevData,
                [name]: checked
                    ? [...prevData[name], value]
                    : prevData[name].filter(item => item !== value)
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleNextStep = () => setStep(step + 1);
    const handlePreviousStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/guide/guide-register', formData);
            alert(response.data.message);
            // Optionally reset the form after successful registration
            setFormData({
                username: '',
                email: '',
                phone: '',
                guideExperience: '',
                modeOfTransport: [],
                languagesSpoken: '',
                guideType: '',
                location: ''
            });
            setStep(1); // Reset to the first step
        } catch (err) {
            console.error(err);
            alert('Error registering guide: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Become a Tour Guide</h2>

            {/* Step 1: Username */}
            {step === 1 && (
                <div className="form-step">
                    <p className="step-description">Let's start with your name:</p>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        placeholder="Enter your full name"
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    <div className="button-container">
                        <button className="next-button" onClick={handleNextStep}>Next</button>
                    </div>
                </div>
            )}

            {/* Step 2: Email */}
            {step === 2 && (
                <div className="form-step">
                    <p className="step-description">What is your email address?</p>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="example@example.com"
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    <div className="button-container">
                        <button className="prev-button" onClick={handlePreviousStep}>Previous</button>
                        <button className="next-button" onClick={handleNextStep}>Next</button>
                    </div>
                </div>
            )}

            {/* Step 3: Phone */}
            {step === 3 && (
                <div className="form-step">
                    <p className="step-description">What's your phone number?</p>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        placeholder="Enter your phone number"
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    <div className="button-container">
                        <button className="prev-button" onClick={handlePreviousStep}>Previous</button>
                        <button className="next-button" onClick={handleNextStep}>Next</button>
                    </div>
                </div>
            )}

            {/* Step 4: Guide Experience */}
            {step === 4 && (
                <div className="form-step">
                    <p className="step-description">How many years of guiding experience do you have?</p>
                    <input
                        type="text"
                        name="guideExperience"
                        value={formData.guideExperience}
                        placeholder="Enter years of experience"
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    <div className="button-container">
                        <button className="prev-button" onClick={handlePreviousStep}>Previous</button>
 <button className="next-button" onClick={handleNextStep}>Next</button>
                    </div>
                </div>
            )}

            {/* Step 5: Preferred Mode of Transport */}
            {step === 5 && (
                <div className="form-step">
                    <p className="step-description">What is your preferred mode of transport? (Select multiple if applicable)</p>
                    <div className="checkbox-group">
                        {["Car", "Bike", "Bus", "Train", "Flight"].map((transport) => (
                            <label key={transport}>
                                <input
                                    type="checkbox"
                                    name="modeOfTransport"
                                    value={transport}
                                    checked={formData.modeOfTransport.includes(transport)}
                                    onChange={handleChange}
                                />
                                {transport}
                            </label>
                        ))}
                    </div>
                    <div className="button-container">
                        <button className="prev-button" onClick={handlePreviousStep}>Previous</button>
                        <button className="next-button" onClick={handleNextStep}>Next</button>
                    </div>
                </div>
            )}

            {/* Step 6: Languages Spoken */}
            {step === 6 && (
                <div className="form-step">
                    <p className="step-description">What languages do you speak?</p>
                    <input
                        type="text"
                        name="languagesSpoken"
                        value={formData.languagesSpoken}
                        placeholder="e.g. English, Hindi, etc."
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    <div className="button-container">
                        <button className="prev-button" onClick={handlePreviousStep}>Previous</button>
                        <button className="next-button" onClick={handleNextStep}>Next</button>
                    </div>
                </div>
            )}

            {/* Step 7: Guide Type */}
            {step === 7 && (
                <div className="form-step">
                    <p className="step-description">What is your preferred guide type?</p>
                    <select
                        name="guideType"
                        value={formData.guideType}
                        onChange={handleChange}
                        required
                        className="form-input"
                    >
                        <option value="">Select Guide Type</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="No Preference">No Preference</option>
                    </select>
                    <div className="button-container">
                        <button className="prev-button" onClick={handlePreviousStep}>Previous</button>
                        <button className="next-button" onClick={handleNextStep}>Next</button>
                    </div>
                </div>
            )}

            {/* Step 8: Location */}
            {step === 8 && (
                <div className="form-step">
                    <p className="step-description">Select your location:</p>
                    <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="form-input"
                    >
                        <option value="">Select Location</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                    </select>
                    <div className="button-container">
                        <button className="prev-button" onClick={handlePreviousStep}>Previous</button>
                        <button className="submit-button" onClick={handleSubmit}>Register</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuideForm;