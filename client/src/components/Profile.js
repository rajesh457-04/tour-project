import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyProfile = () => {
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        bio: '',
        location: '',
        profilePicture: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch profile from localStorage or backend
    useEffect(() => {
        const storedProfile = localStorage.getItem('profile');
        if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
            setLoading(false);
        } else {
            fetchProfile();
        }
    }, []);

    // Fetch profile data from the backend
    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in first.');
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/user/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data) {
                const newProfile = {
                    username: response.data.username || '',
                    email: response.data.email || '',
                    bio: response.data.bio || '',
                    location: response.data.location || '',
                    profilePicture: response.data.profilePicture || '',
                };
                setProfile(newProfile);
                localStorage.setItem('profile', JSON.stringify(newProfile)); // Save to localStorage
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to fetch profile: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Handle input change for text fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    // Handle file input for profile picture
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Handle form submission to update the profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('username', profile.username);
        formData.append('email', profile.email);
        formData.append('bio', profile.bio);
        formData.append('location', profile.location);
        if (selectedFile) {
            formData.append('profilePicture', selectedFile);
        }

        try {
            const response = await axios.put('http://localhost:5000/api/user/profile', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                const updatedProfile = {
                    username: response.data.username || profile.username,
                    email: response.data.email || profile.email,
                    bio: response.data.bio || profile.bio,
                    location: response.data.location || profile.location,
                    profilePicture: response.data.profilePicture || profile.profilePicture,
                };
                setProfile(updatedProfile);
                localStorage.setItem('profile', JSON.stringify(updatedProfile)); // Save to localStorage
                setIsEditing(false);
                alert('Profile updated successfully!');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile: ' + (err.response?.data?.message || err.message));
        }
    };

    // Loading state
    if (loading) return <div>Loading your profile...</div>;
    // Error state
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="my-profile-container">
            <h2>My Profile</h2>
            {!isEditing ? (
                <div className="profile-details">
                    <div className="profile-picture">
                        {profile.profilePicture ? (
                            <img
                                src={profile.profilePicture}
                                alt="Profile"
                            />
                        ) : (
                            <p>No profile picture uploaded.</p>
                        )}
                    </div>
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Bio:</strong> {profile.bio || 'No bio provided.'}</p>
                    <p><strong>Location:</strong> {profile.location || 'No location provided.'}</p>
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="edit-profile-form">
                    <div className="form-group">
                        <label>Username:</label>
                        <input type="text" name="username" value={profile.username} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={profile.email} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Bio:</label>
                        <textarea name="bio" value={profile.bio} onChange={handleInputChange} placeholder="Tell us about yourself..." />
                    </div>
                    <div className="form-group">
                        <label>Location:</label>
                        <input type="text" name="location" value={profile.location} onChange={handleInputChange} placeholder="Enter your location" />
                    </div>
                    <div className="form-group">
                        <label>Profile Picture:</label>
                        <input type="file" name="profilePicture" onChange={handleFileChange} accept="image/*" />
                    </div>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default MyProfile;