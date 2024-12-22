import React, { useState, useContext } from 'react';
import axios from 'axios';
import { store } from './App';
import { useNavigate } from 'react-router-dom';
import './style5.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [, setToken] = useContext(store); // Get the setToken function from context
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/login', { email, password });
            const token = res.data.token; // Get token from response
            setToken(token); // Set token in context
            localStorage.setItem('token', token); // Store token in localStorage
            localStorage.setItem('isAuthenticated', 'true'); // Set authenticated flag
            alert('Login successful');
            navigate('/myprofile'); // Redirect to profile after login
        } catch (error) {
            alert(error.response.data);
        }
    };

    const handleForgotPassword = () => {
        // Implement forgot password logic here
        alert("Forgot password functionality will be implemented soon.");
    };

    return (
        <div className="form-containers">
            <h2 className="heading">Login</h2>
            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="input">
                    <span className="icon"><ion-icon name="mail-outline"></ion-icon></span>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Email</label>
                </div>
                <div className="input">
                    <span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label>Password</label>
                </div>
                <div className="remember">
                    <label>
                        <input type="checkbox" />
                        Remember me
                    </label>
                    {/* Use a button instead of an anchor for Forgot password */}
                    <button type="button" onClick={handleForgotPassword} className="link-button">
                        Forgot password?
                    </button>
                </div>
                <button type="submit" className="btn1">Login</button>
                <div className="login-register">
                    <p>
                        Don't have an account? 
                        {/* Use navigate for internal routing */}
                        <button type="button" onClick={() => navigate('/register')} className="link-button">
                            Register
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
