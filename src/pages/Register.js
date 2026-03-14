import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import logo from '../logo.png';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', lat: 0, lng: 0
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [locationCaptured, setLocationCaptured] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setFormData({
                    ...formData,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocationCaptured(true);
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await registerUser(formData);
            alert('🎉 Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed!');
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.circle1} />
            <div style={styles.circle2} />

            <div style={styles.card}>
                <div style={styles.logoContainer}>
                    <img src={logo} alt="SafeFind Logo" style={styles.logo} />
                </div>

                <h1 style={styles.title}>Join SafeFind</h1>
                <p style={styles.tagline}>🔍 Be a Hero, Help Find Someone</p>

                {error && (
                    <div style={styles.errorBox}>⚠️ {error}</div>
                )}

                <div style={styles.inputGroup}>
                    <span style={styles.inputIcon}>👤</span>
                    <input
                        style={styles.input}
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <span style={styles.inputIcon}>📧</span>
                    <input
                        style={styles.input}
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <span style={styles.inputIcon}>📱</span>
                    <input
                        style={styles.input}
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <span style={styles.inputIcon}>🔒</span>
                    <input
                        style={styles.input}
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Create Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <span
                        style={styles.eyeIcon}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </span>
                </div>

                <button
                    type="button"
                    style={locationCaptured ? styles.locationBtnSuccess : styles.locationBtn}
                    onClick={getLocation}
                >
                    {locationCaptured ? '✅ Location Captured!' : '📍 Capture My Location'}
                </button>

                <button
                    style={loading ? styles.buttonLoading : styles.button}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
                </button>

                <div style={styles.divider}>
                    <div style={styles.dividerLine} />
                    <span style={styles.dividerText}>or</span>
                    <div style={styles.dividerLine} />
                </div>

                <p style={styles.loginText}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.loginLink}>
                        Login →
                    </Link>
                </p>

                <p style={styles.footer}>
                    🛡️ Your data is safe and secure
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: '#0f0f1a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
    },
    circle1: {
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(133, 183, 235, 0.05)',
        top: '-100px',
        left: '-100px'
    },
    circle2: {
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(255, 107, 107, 0.05)',
        bottom: '-50px',
        right: '-50px'
    },
    card: {
        background: '#16162a',
        borderRadius: '24px',
        padding: '40px 32px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #2a2a4a',
        position: 'relative',
        zIndex: 1
    },
    logoContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '16px'
    },
    logo: {
        width: '80px',
        height: '80px',
        objectFit: 'contain',
        borderRadius: '20px',
        background: '#fff',
        padding: '8px'
    },
    title: {
        color: '#fff',
        fontSize: '26px',
        fontWeight: '700',
        textAlign: 'center',
        margin: '0 0 4px 0'
    },
    tagline: {
        color: '#97C459',
        fontSize: '14px',
        textAlign: 'center',
        margin: '0 0 24px 0',
        fontWeight: '600'
    },
    errorBox: {
        background: '#2a0f0f',
        border: '1px solid #FF6B6B',
        borderRadius: '10px',
        padding: '10px 14px',
        color: '#FF6B6B',
        fontSize: '13px',
        marginBottom: '16px',
        textAlign: 'center'
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        background: '#0f0f1a',
        border: '1px solid #2a2a4a',
        borderRadius: '12px',
        padding: '4px 12px',
        marginBottom: '14px'
    },
    inputIcon: {
        fontSize: '18px',
        marginRight: '10px'
    },
    input: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: '#fff',
        fontSize: '15px',
        padding: '12px 0'
    },
    eyeIcon: {
        fontSize: '18px',
        cursor: 'pointer'
    },
    locationBtn: {
        width: '100%',
        padding: '12px',
        background: '#0f2a22',
        color: '#5DCAA5',
        border: '2px solid #5DCAA5',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        marginBottom: '14px'
    },
    locationBtnSuccess: {
        width: '100%',
        padding: '12px',
        background: '#0f2a14',
        color: '#97C459',
        border: '2px solid #97C459',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        marginBottom: '14px'
    },
    button: {
        width: '100%',
        padding: '14px',
        background: '#FF6B6B',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '4px'
    },
    buttonLoading: {
        width: '100%',
        padding: '14px',
        background: '#888',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'not-allowed',
        marginTop: '4px'
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '20px 0'
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        background: '#2a2a4a'
    },
    dividerText: {
        color: '#666',
        fontSize: '13px'
    },
    loginText: {
        textAlign: 'center',
        color: '#888',
        fontSize: '14px',
        margin: '0 0 16px 0'
    },
    loginLink: {
        color: '#85B7EB',
        textDecoration: 'none',
        fontWeight: '700'
    },
    footer: {
        textAlign: 'center',
        color: '#444',
        fontSize: '12px',
        margin: 0
    }
};

export default Register;