import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import logo from '../logo.png';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await loginUser(formData);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('name', response.data.name);
            localStorage.setItem('email', response.data.email);
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed!');
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.circle1} />
            <div style={styles.circle2} />
            <div style={styles.circle3} />

            <div style={styles.card}>
                <div style={styles.logoContainer}>
                    <img src={logo} alt="SafeFind Logo" style={styles.logo} />
                </div>

                <h1 style={styles.title}>SafeFind</h1>
                <p style={styles.tagline}>🔍 Every Second Counts</p>
                <p style={styles.subtitle}>Login to help find missing people</p>

                {error && (
                    <div style={styles.errorBox}>
                        ⚠️ {error}
                    </div>
                )}

                <div style={styles.inputGroup}>
                    <span style={styles.inputIcon}>📧</span>
                    <input
                        style={styles.input}
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
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
                        placeholder="Enter your password"
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
                    style={loading ? styles.buttonLoading : styles.button}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? '⏳ Logging in...' : '🚀 Login'}
                </button>

                <div style={styles.divider}>
                    <div style={styles.dividerLine} />
                    <span style={styles.dividerText}>or</span>
                    <div style={styles.dividerLine} />
                </div>

                <p style={styles.registerText}>
                    New to SafeFind?{' '}
                    <Link to="/register" style={styles.registerLink}>
                        Create Account →
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
        background: 'rgba(255, 107, 107, 0.05)',
        top: '-100px',
        right: '-100px'
    },
    circle2: {
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(133, 183, 235, 0.05)',
        bottom: '-50px',
        left: '-50px'
    },
    circle3: {
        position: 'absolute',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'rgba(255, 209, 102, 0.05)',
        top: '50%',
        left: '-50px'
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
        width: '100px',
        height: '100px',
        objectFit: 'contain',
        borderRadius: '20px',
        background: '#fff',
        padding: '8px'
    },
    title: {
        color: '#fff',
        fontSize: '28px',
        fontWeight: '700',
        textAlign: 'center',
        margin: '0 0 4px 0'
    },
    tagline: {
        color: '#FF6B6B',
        fontSize: '14px',
        textAlign: 'center',
        margin: '0 0 8px 0',
        fontWeight: '600'
    },
    subtitle: {
        color: '#888',
        fontSize: '13px',
        textAlign: 'center',
        margin: '0 0 24px 0'
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
        marginTop: '8px'
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
        marginTop: '8px'
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
    registerText: {
        textAlign: 'center',
        color: '#888',
        fontSize: '14px',
        margin: '0 0 16px 0'
    },
    registerLink: {
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

export default Login;