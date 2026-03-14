import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadSighting, getMissingPersons } from '../services/api';
import logo from '../logo.png';

function UploadSighting() {
    const navigate = useNavigate();
    const [personId, setPersonId] = useState('');
    const [location, setLocation] = useState('');
    const [note, setNote] = useState('');
    const [photo, setPhoto] = useState(null);
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [missingPersons, setMissingPersons] = useState([]);
    const [loadingCases, setLoadingCases] = useState(false);

    const fetchCases = async () => {
        setLoadingCases(true);
        try {
            const res = await getMissingPersons();
            setMissingPersons(res.data.missing_persons);
        } catch (err) {
            console.error(err);
        }
        setLoadingCases(false);
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLat(pos.coords.latitude);
                setLng(pos.coords.longitude);
                alert('📍 Location captured!');
            });
        }
    };

    const handleSubmit = async () => {
        if (!personId) { setError('⚠️ Please select a missing person!'); return; }
        if (!photo) { setError('⚠️ Please upload a photo!'); return; }
        if (!location) { setError('⚠️ Please enter location!'); return; }

        setLoading(true);
        setError('');
        try {
            const data = new FormData();
            data.append('person_id', personId);
            data.append('location', location);
            data.append('note', note);
            data.append('sighting_lat', lat);
            data.append('sighting_lng', lng);
            data.append('photo', photo);
            const res = await uploadSighting(data);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Upload failed!');
        }
        setLoading(false);
    };

    const getMatchColor = (level) => {
        if (level === 'HIGH') return '#FF6B6B';
        if (level === 'MEDIUM') return '#EF9F27';
        return '#85B7EB';
    };

    if (result) return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={{ fontSize: '60px', textAlign: 'center', margin: '20px 0' }}>
                    {result.ai_result?.match_level === 'HIGH' ? '🚨' :
                     result.ai_result?.match_level === 'MEDIUM' ? '⚠️' : '✅'}
                </div>
                <h2 style={{ color: '#fff', textAlign: 'center', margin: '0 0 16px 0' }}>
                    {result.message}
                </h2>

                {result.final_score && (
                    <div style={styles.resultCard}>
                        <p style={styles.resultTitle}>🤖 AI Analysis</p>
                        <div style={styles.resultRow}>
                            <span style={styles.resultLabel}>Face Score</span>
                            <span style={{ color: '#85B7EB', fontWeight: '700' }}>
                                {result.ai_result?.similarity_score}%
                            </span>
                        </div>
                        <div style={styles.resultRow}>
                            <span style={styles.resultLabel}>Final Score</span>
                            <span style={{ color: '#FFD166', fontWeight: '700' }}>
                                {result.final_score?.final_score}%
                            </span>
                        </div>
                        <div style={styles.resultRow}>
                            <span style={styles.resultLabel}>Match Level</span>
                            <span style={{
                                color: getMatchColor(result.final_score?.match_level),
                                fontWeight: '700'
                            }}>
                                {result.final_score?.match_level}
                            </span>
                        </div>
                        <div style={styles.resultRow}>
                            <span style={styles.resultLabel}>Liveness</span>
                            <span style={{ color: '#97C459', fontWeight: '700' }}>
                                {result.liveness?.liveness_score}%
                            </span>
                        </div>
                        {result.nearby_users_alerted > 0 && (
                            <div style={styles.resultRow}>
                                <span style={styles.resultLabel}>Nearby Alerted</span>
                                <span style={{ color: '#5DCAA5', fontWeight: '700' }}>
                                    {result.nearby_users_alerted} users
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <button style={styles.button} onClick={() => navigate('/home')}>
                    🏠 Go Home
                </button>
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <button style={styles.backBtn} onClick={() => navigate('/home')}>← Back</button>
                    <img src={logo} alt="logo" style={styles.logo} />
                </div>

                <h2 style={styles.title}>👁️ Upload Sighting</h2>
                <p style={styles.subtitle}>Spotted someone? Report it here!</p>

                {error && <div style={styles.errorBox}>{error}</div>}

                {/* Select Missing Person */}
                <div style={styles.inputGroup}>
                    <span style={styles.inputIcon}>🔍</span>
                    <input
                        style={styles.input}
                        placeholder="Paste Person ID here"
                        value={personId}
                        onChange={(e) => setPersonId(e.target.value)}
                    />
                </div>

                <button style={styles.loadCasesBtn} onClick={fetchCases}>
                    {loadingCases ? '⏳ Loading...' : '📋 Browse Missing Persons'}
                </button>

                {missingPersons.length > 0 && (
                    <div style={styles.casesList}>
                        {missingPersons.map((person) => (
                            <div
                                key={person.person_id}
                                style={{
                                    ...styles.caseItem,
                                    border: personId === person.person_id ?
                                        '2px solid #FF6B6B' : '1px solid #2a2a4a'
                                }}
                                onClick={() => setPersonId(person.person_id)}
                            >
                                <p style={styles.caseName}>{person.name}</p>
                                <p style={styles.caseDetail}>
                                    Age: {person.age} • {person.last_seen_location}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Location */}
                <div style={styles.inputGroup}>
                    <span style={styles.inputIcon}>📍</span>
                    <input
                        style={styles.input}
                        placeholder="Where did you spot them?"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <button style={styles.locationBtn} onClick={getLocation}>
                    {lat !== 0 ? '✅ GPS Location Captured' : '📍 Capture GPS Location'}
                </button>

                {/* Note */}
                <div style={styles.inputGroup}>
                    <span style={styles.inputIcon}>📝</span>
                    <input
                        style={styles.input}
                        placeholder="Additional note (optional)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                {/* Photo */}
                <div style={styles.uploadBox}>
                    <p style={styles.uploadTitle}>📸 Upload Sighting Photo</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPhoto(e.target.files[0])}
                        style={styles.fileInput}
                    />
                    {photo && <p style={styles.uploadCount}>✅ Photo selected</p>}
                </div>

                <button
                    style={loading ? styles.buttonLoading : styles.button}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? '⏳ Analyzing...' : '👁️ Submit Sighting'}
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
        color: '#85B7EB',
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
    loadCasesBtn: {
        width: '100%',
        padding: '10px',
        background: '#0f1a2a',
        border: '2px solid #85B7EB',
        borderRadius: '12px',
        color: '#85B7EB',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        marginBottom: '12px'
    },
    casesList: {
        maxHeight: '200px',
        overflowY: 'auto',
        marginBottom: '12px',
        border: '1px solid #2a2a4a',
        borderRadius: '12px',
        padding: '8px'
    },
    caseItem: {
        padding: '10px',
        borderRadius: '10px',
        marginBottom: '8px',
        cursor: 'pointer',
        background: '#0f0f1a'
    },
    caseName: {
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        margin: 0
    },
    caseDetail: {
        color: '#888',
        fontSize: '12px',
        margin: '4px 0 0 0'
    },
    locationBtn: {
        width: '100%',
        padding: '10px',
        background: '#0f2a22',
        border: '2px solid #5DCAA5',
        borderRadius: '12px',
        color: '#5DCAA5',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        marginBottom: '12px'
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
        background: '#85B7EB',
        color: '#0f0f1a',
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
    resultCard: {
        background: '#0f0f1a',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '16px',
        border: '1px solid #2a2a4a'
    },
    resultTitle: {
        color: '#FFD166',
        fontSize: '14px',
        fontWeight: '700',
        margin: '0 0 12px 0'
    },
    resultRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid #2a2a4a'
    },
    resultLabel: {
        color: '#888',
        fontSize: '13px'
    }
};

export default UploadSighting;