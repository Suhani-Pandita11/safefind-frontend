import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportMissing } from '../services/api';
import logo from '../logo.png';

function ReportMissing() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', age: '', gender: '', last_seen_location: '',
        last_seen_date: '', description: '', reported_by: localStorage.getItem('email') || ''
    });
    const [photos, setPhotos] = useState([]);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (photos.length < 4) {
            setError('⚠️ Please upload minimum 4 photos!');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            photos.forEach(photo => data.append('photos', photo));
            if (video) data.append('video', video);
            const res = await reportMissing(data);
            setSuccess(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to report!');
        }
        setLoading(false);
    };

    if (success) return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.successIcon}>✅</div>
                <h2 style={styles.successTitle}>Report Submitted!</h2>
                <p style={styles.successText}>Person ID: {success.person_id}</p>
                <p style={styles.successText}>🔗 Shareable Link:</p>
                <p style={styles.link}>{success.shareable_link}</p>
                <p style={styles.successText}>📄 Poster generated!</p>
                <button style={styles.button} onClick={() => navigate('/home')}>
                    🏠 Go Home
                </button>
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Header */}
                <div style={styles.header}>
                    <button style={styles.backBtn} onClick={() => navigate('/home')}>← Back</button>
                    <img src={logo} alt="logo" style={styles.logo} />
                </div>

                <h2 style={styles.title}>🚨 Report Missing Person</h2>
                <p style={styles.subtitle}>Fill in all details carefully</p>

                {error && <div style={styles.errorBox}>{error}</div>}

                {/* Form Fields */}
                {[
                    { name: 'name', placeholder: 'Full Name', icon: '👤' },
                    { name: 'age', placeholder: 'Age', icon: '🎂', type: 'number' },
                    { name: 'last_seen_location', placeholder: 'Last Seen Location', icon: '📍' },
                    { name: 'last_seen_date', placeholder: 'Last Seen Date', icon: '📅', type: 'date' },
                    { name: 'description', placeholder: 'Description (clothes, features...)', icon: '📝' },
                ].map((field) => (
                    <div key={field.name} style={styles.inputGroup}>
                        <span style={styles.inputIcon}>{field.icon}</span>
                        <input
                            style={styles.input}
                            type={field.type || 'text'}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}

                {/* Gender */}
                <div style={styles.inputGroup}>
                    <span style={styles.inputIcon}>⚧️</span>
                    <select
                        style={styles.select}
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Photos */}
                <div style={styles.uploadBox}>
                    <p style={styles.uploadTitle}>📸 Upload Photos (minimum 4)</p>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setPhotos(Array.from(e.target.files))}
                        style={styles.fileInput}
                    />
                    {photos.length > 0 && (
                        <p style={styles.uploadCount}>✅ {photos.length} photos selected</p>
                    )}
                </div>

                {/* Video */}
                <div style={styles.uploadBox}>
                    <p style={styles.uploadTitle}>🎥 Upload Video (optional)</p>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideo(e.target.files[0])}
                        style={styles.fileInput}
                    />
                    {video && <p style={styles.uploadCount}>✅ Video selected</p>}
                </div>

                <button
                    style={loading ? styles.buttonLoading : styles.button}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? '⏳ Submitting...' : '🚨 Submit Report'}
                </button>
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
        padding: '20px'
    },
    card: {
        background: '#16162a',
        borderRadius: '24px',
        padding: '24px',
        width: '100%',
        maxWidth: '420px',
        border: '1px solid #2a2a4a',
        height: 'fit-content'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    backBtn: {
        background: 'transparent',
        border: '1px solid #2a2a4a',
        color: '#888',
        padding: '8px 16px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    logo: {
        width: '40px',
        height: '40px',
        objectFit: 'contain',
        borderRadius: '10px',
        background: '#fff',
        padding: '4px'
    },
    title: {
        color: '#FF6B6B',
        fontSize: '22px',
        fontWeight: '700',
        margin: '0 0 4px 0'
    },
    subtitle: {
        color: '#888',
        fontSize: '13px',
        margin: '0 0 20px 0'
    },
    errorBox: {
        background: '#2a0f0f',
        border: '1px solid #FF6B6B',
        borderRadius: '10px',
        padding: '10px 14px',
        color: '#FF6B6B',
        fontSize: '13px',
        marginBottom: '16px'
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        background: '#0f0f1a',
        border: '1px solid #2a2a4a',
        borderRadius: '12px',
        padding: '4px 12px',
        marginBottom: '12px'
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
    select: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: '#fff',
        fontSize: '15px',
        padding: '12px 0'
    },
    uploadBox: {
        background: '#0f0f1a',
        border: '2px dashed #2a2a4a',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px'
    },
    uploadTitle: {
        color: '#888',
        fontSize: '14px',
        margin: '0 0 10px 0',
        fontWeight: '600'
    },
    fileInput: {
        color: '#888',
        fontSize: '13px',
        width: '100%'
    },
    uploadCount: {
        color: '#97C459',
        fontSize: '13px',
        margin: '8px 0 0 0'
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
    successIcon: {
        fontSize: '60px',
        textAlign: 'center',
        margin: '20px 0'
    },
    successTitle: {
        color: '#97C459',
        fontSize: '24px',
        fontWeight: '700',
        textAlign: 'center',
        margin: '0 0 16px 0'
    },
    successText: {
        color: '#888',
        fontSize: '14px',
        textAlign: 'center',
        margin: '0 0 8px 0'
    },
    link: {
        color: '#85B7EB',
        fontSize: '12px',
        textAlign: 'center',
        margin: '0 0 16px 0',
        wordBreak: 'break-all'
    }
};

export default ReportMissing;