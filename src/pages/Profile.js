import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/api';
import logo from '../logo.png';

function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        phone: '', date_of_birth: '', address: ''
    });
    const [profilePic, setProfilePic] = useState(null);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await getProfile();
            setProfile(res.data);
            setFormData({
                phone: res.data.phone || '',
                date_of_birth: res.data.date_of_birth || '',
                address: res.data.address || ''
            });
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const data = new FormData();
            data.append('phone', formData.phone);
            data.append('date_of_birth', formData.date_of_birth);
            data.append('address', formData.address);
            if (profilePic) data.append('profile_pic', profilePic);
            await updateProfile(data);
            setSuccess('✅ Profile updated successfully!');
            setEditing(false);
            fetchProfile();
        } catch (err) {
            console.error(err);
        }
        setSaving(false);
    };

    const getKarmaLevel = (karma) => {
        if (karma >= 100) return { label: '🏆 Legend', color: '#FFD166' };
        if (karma >= 50) return { label: '⭐ Hero', color: '#97C459' };
        if (karma >= 10) return { label: '🔰 Helper', color: '#85B7EB' };
        return { label: '🌱 Newcomer', color: '#888' };
    };

    if (loading) return (
        <div style={styles.container}>
            <p style={{ color: '#fff' }}>Loading profile...</p>
        </div>
    );

    const karmaLevel = getKarmaLevel(profile?.karma_score || 0);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Header */}
                <div style={styles.header}>
                    <button style={styles.backBtn} onClick={() => navigate('/home')}>
                        ← Back
                    </button>
                    <img src={logo} alt="logo" style={styles.logo} />
                </div>

                {/* Profile Picture */}
                <div style={styles.avatarContainer}>
                    <div style={styles.avatar}>
                        {profile?.profile_pic ? (
                            <img src={`http://127.0.0.1:8000/${profile.profile_pic}`}
                                alt="profile" style={styles.avatarImg} />
                        ) : (
                            <span style={styles.avatarText}>
                                {profile?.name?.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    {editing && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfilePic(e.target.files[0])}
                            style={styles.fileInput}
                        />
                    )}
                </div>

                {/* Name and karma */}
                <h2 style={styles.name}>{profile?.name}</h2>
                <p style={styles.email}>{profile?.email}</p>
                <div style={{ ...styles.karmaBadge, borderColor: karmaLevel.color }}>
                    <span style={{ ...styles.karmaText, color: karmaLevel.color }}>
                        {karmaLevel.label} • {profile?.karma_score || 0} Karma
                    </span>
                </div>

                {success && <p style={styles.success}>{success}</p>}

                {/* Profile Details */}
                <div style={styles.detailsCard}>
                    <div style={styles.detailRow}>
                        <span style={styles.detailIcon}>📱</span>
                        {editing ? (
                            <input
                                style={styles.editInput}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Phone number"
                            />
                        ) : (
                            <span style={styles.detailText}>{profile?.phone || 'Not set'}</span>
                        )}
                    </div>

                    <div style={styles.detailRow}>
                        <span style={styles.detailIcon}>🎂</span>
                        {editing ? (
                            <input
                                style={styles.editInput}
                                type="date"
                                value={formData.date_of_birth}
                                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                            />
                        ) : (
                            <span style={styles.detailText}>{profile?.date_of_birth || 'Not set'}</span>
                        )}
                    </div>

                    <div style={styles.detailRow}>
                        <span style={styles.detailIcon}>🏠</span>
                        {editing ? (
                            <input
                                style={styles.editInput}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Your address"
                            />
                        ) : (
                            <span style={styles.detailText}>{profile?.address || 'Not set'}</span>
                        )}
                    </div>
                </div>

                {/* Karma Progress */}
                <div style={styles.karmaCard}>
                    <p style={styles.karmaTitle}>⭐ Karma Progress</p>
                    <div style={styles.progressBar}>
                        <div style={{
                            ...styles.progressFill,
                            width: `${Math.min((profile?.karma_score || 0), 100)}%`
                        }} />
                    </div>
                    <p style={styles.karmaHint}>
                        Upload accurate sightings to earn more karma!
                    </p>
                </div>

                {/* Buttons */}
                {editing ? (
                    <div style={styles.btnRow}>
                        <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
                            {saving ? '⏳ Saving...' : '✅ Save Changes'}
                        </button>
                        <button style={styles.cancelBtn} onClick={() => setEditing(false)}>
                            ❌ Cancel
                        </button>
                    </div>
                ) : (
                    <button style={styles.editBtn} onClick={() => setEditing(true)}>
                        ✏️ Edit Profile
                    </button>
                )}

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
    avatarContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '16px'
    },
    avatar: {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        background: '#2a1a4a',
        border: '3px solid #AFA9EC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    avatarImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    avatarText: {
        color: '#AFA9EC',
        fontSize: '36px',
        fontWeight: '700'
    },
    fileInput: {
        marginTop: '10px',
        color: '#888',
        fontSize: '13px'
    },
    name: {
        color: '#fff',
        fontSize: '22px',
        fontWeight: '700',
        textAlign: 'center',
        margin: '0 0 4px 0'
    },
    email: {
        color: '#888',
        fontSize: '13px',
        textAlign: 'center',
        margin: '0 0 12px 0'
    },
    karmaBadge: {
        background: '#1a1a2e',
        border: '2px solid',
        borderRadius: '20px',
        padding: '6px 16px',
        display: 'inline-flex',
        alignItems: 'center',
        marginBottom: '16px',
        alignSelf: 'center'
    },
    karmaText: {
        fontSize: '13px',
        fontWeight: '700'
    },
    success: {
        color: '#97C459',
        textAlign: 'center',
        fontSize: '13px',
        marginBottom: '12px'
    },
    detailsCard: {
        background: '#0f0f1a',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '16px',
        border: '1px solid #2a2a4a'
    },
    detailRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 0',
        borderBottom: '1px solid #2a2a4a'
    },
    detailIcon: {
        fontSize: '20px'
    },
    detailText: {
        color: '#ccc',
        fontSize: '14px'
    },
    editInput: {
        flex: 1,
        background: '#1a1a2e',
        border: '1px solid #2a2a4a',
        borderRadius: '8px',
        padding: '8px 12px',
        color: '#fff',
        fontSize: '14px',
        outline: 'none'
    },
    karmaCard: {
        background: '#0f0f1a',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '16px',
        border: '1px solid #2a2a4a'
    },
    karmaTitle: {
        color: '#FFD166',
        fontSize: '14px',
        fontWeight: '700',
        margin: '0 0 10px 0'
    },
    progressBar: {
        background: '#2a2a4a',
        borderRadius: '10px',
        height: '10px',
        marginBottom: '8px',
        overflow: 'hidden'
    },
    progressFill: {
        background: '#FFD166',
        height: '100%',
        borderRadius: '10px',
        transition: 'width 0.5s ease'
    },
    karmaHint: {
        color: '#666',
        fontSize: '12px',
        margin: 0
    },
    btnRow: {
        display: 'flex',
        gap: '10px'
    },
    saveBtn: {
        flex: 1,
        padding: '12px',
        background: '#0f2a14',
        border: '2px solid #97C459',
        borderRadius: '12px',
        color: '#97C459',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer'
    },
    cancelBtn: {
        flex: 1,
        padding: '12px',
        background: '#2a0f0f',
        border: '2px solid #FF6B6B',
        borderRadius: '12px',
        color: '#FF6B6B',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer'
    },
    editBtn: {
        width: '100%',
        padding: '12px',
        background: '#1a0f2a',
        border: '2px solid #AFA9EC',
        borderRadius: '12px',
        color: '#AFA9EC',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer'
    }
};

export default Profile;