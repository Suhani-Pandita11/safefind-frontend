import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const name = localStorage.getItem('name') || 'User';
    const [stats, setStats] = useState({ karma: 0, sightings: 0, reports: 0 });

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

    const modules = [
        { icon: '🚨', label: 'Report Missing', path: '/report', color: '#2a0f0f', border: '#FF6B6B', text: '#FF6B6B' },
        { icon: '👁️', label: 'Upload Sighting', path: '/sighting', color: '#0f1a2a', border: '#85B7EB', text: '#85B7EB' },
        { icon: '🔔', label: 'Notifications', path: '/notifications', color: '#0f2a14', border: '#97C459', text: '#97C459' },
        { icon: '👤', label: 'My Profile', path: '/profile', color: '#1a0f2a', border: '#AFA9EC', text: '#AFA9EC' },
        { icon: '🗺️', label: 'Nearby Cases', path: '/notifications', color: '#2a1f0f', border: '#EF9F27', text: '#EF9F27' },
        { icon: '📋', label: 'All Cases', path: '/cases', color: '#0f2a22', border: '#5DCAA5', text: '#5DCAA5' },
        { icon: '⚠️', label: 'Warnings', path: '/notifications', color: '#2a0f1a', border: '#ED93B1', text: '#ED93B1' },
        { icon: '🏆', label: 'Leaderboard', path: '/leaderboard', color: '#2a180f', border: '#F0997B', text: '#F0997B' },
        { icon: '👮', label: 'Admin Panel', path: '/admin', color: '#1a1a1a', border: '#888', text: '#aaa' },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.phone}>

                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <p style={styles.greeting}>Hey {name}! 🌟</p>
                        <p style={styles.subgreeting}>Let's help someone find home today</p>
                    </div>
                    <div style={styles.avatar}>{initials}</div>
                </div>

                {/* Karma Badge */}
                <div style={styles.karmaBadge}>
                    <span style={styles.karmaText}>⭐ Karma Score: {stats.karma}</span>
                </div>

                {/* Alert Card */}
                <div style={styles.alertCard}>
                    <span style={{ fontSize: '24px' }}>🚨</span>
                    <div>
                        <p style={styles.alertTitle}>Stay Alert!</p>
                        <p style={styles.alertSub}>Check notifications for cases near you</p>
                    </div>
                </div>

                {/* Modules Grid */}
                <p style={styles.sectionTitle}>WHAT DO YOU WANT TO DO?</p>
                <div style={styles.grid}>
                    {modules.map((mod, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.card,
                                background: mod.color,
                                border: `2px solid ${mod.border}`
                            }}
                            onClick={() => navigate(mod.path)}
                        >
                            <span style={styles.cardIcon}>{mod.icon}</span>
                            <span style={{ ...styles.cardLabel, color: mod.text }}>{mod.label}</span>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <p style={styles.sectionTitle}>YOUR STATS</p>
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <p style={styles.statNum}>{stats.karma}</p>
                        <p style={styles.statLabel}>Karma</p>
                    </div>
                    <div style={styles.statCard}>
                        <p style={styles.statNum}>{stats.sightings}</p>
                        <p style={styles.statLabel}>Sightings</p>
                    </div>
                    <div style={styles.statCard}>
                        <p style={styles.statNum}>{stats.reports}</p>
                        <p style={styles.statLabel}>Reports</p>
                    </div>
                </div>

                {/* Logout */}
                <button style={styles.logoutBtn} onClick={handleLogout}>
                    🚪 Logout
                </button>

            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: '#0a0a14',
        display: 'flex',
        justifyContent: 'center',
        padding: '20px'
    },
    phone: {
        width: '100%',
        maxWidth: '420px',
        background: '#0f0f1a',
        borderRadius: '24px',
        padding: '24px',
        height: 'fit-content'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    greeting: {
        color: '#fff',
        fontSize: '20px',
        fontWeight: '600',
        margin: 0
    },
    subgreeting: {
        color: '#888',
        fontSize: '13px',
        margin: '4px 0 0 0'
    },
    avatar: {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: '#FFD166',
        border: '3px solid #FF6B6B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#333',
        fontWeight: '700',
        fontSize: '14px'
    },
    karmaBadge: {
        background: '#1a1a2e',
        border: '2px solid #FFD166',
        borderRadius: '20px',
        padding: '8px 16px',
        display: 'inline-flex',
        alignItems: 'center',
        marginBottom: '16px'
    },
    karmaText: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#FFD166'
    },
    alertCard: {
        background: '#1a0a0a',
        border: '2px dashed #FF6B6B',
        borderRadius: '16px',
        padding: '14px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    alertTitle: {
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        margin: 0
    },
    alertSub: {
        color: '#FF6B6B',
        fontSize: '12px',
        margin: '4px 0 0 0'
    },
    sectionTitle: {
        color: '#666',
        fontSize: '11px',
        letterSpacing: '1px',
        marginBottom: '12px',
        fontWeight: '700'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '20px'
    },
    card: {
        borderRadius: '20px',
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer'
    },
    cardIcon: {
        fontSize: '30px'
    },
    cardLabel: {
        fontSize: '11px',
        fontWeight: '700',
        textAlign: 'center'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginBottom: '20px'
    },
    statCard: {
        background: '#1a1a2e',
        border: '2px solid #2a2a4a',
        borderRadius: '16px',
        padding: '12px',
        textAlign: 'center'
    },
    statNum: {
        color: '#FFD166',
        fontSize: '22px',
        fontWeight: '700',
        margin: 0
    },
    statLabel: {
        color: '#666',
        fontSize: '11px',
        marginTop: '4px',
        fontWeight: '600'
    },
    logoutBtn: {
        width: '100%',
        padding: '12px',
        background: '#1a0a0a',
        border: '2px solid #FF6B6B',
        borderRadius: '12px',
        color: '#FF6B6B',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer'
    }
};

export default Home;