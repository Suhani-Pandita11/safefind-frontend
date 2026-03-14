import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getAllMissing, getAllSightings, getHighPriority, verifySighting, markSolved } from '../services/api';
import logo from '../logo.png';

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [missing, setMissing] = useState([]);
    const [sightings, setSightings] = useState([]);
    const [highPriority, setHighPriority] = useState([]);
    const [activeTab, setActiveTab] = useState('stats');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await getAdminStats();
            setStats(res.data);
        } catch (err) {
            setError('⚠️ Admin access required!');
        }
        setLoading(false);
    };

    const fetchMissing = async () => {
        try {
            const res = await getAllMissing();
            setMissing(res.data.missing_persons);
        } catch (err) { console.error(err); }
    };

    const fetchSightings = async () => {
        try {
            const res = await getAllSightings();
            setSightings(res.data.sightings);
        } catch (err) { console.error(err); }
    };

    const fetchHighPriority = async () => {
        try {
            const res = await getHighPriority();
            setHighPriority(res.data.high_priority_cases);
        } catch (err) { console.error(err); }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'missing' && missing.length === 0) fetchMissing();
        if (tab === 'sightings' && sightings.length === 0) fetchSightings();
        if (tab === 'priority' && highPriority.length === 0) fetchHighPriority();
    };

    const handleVerify = async (sightingId) => {
        try {
            await verifySighting(sightingId);
            alert('✅ Sighting verified! Reporter got +15 karma!');
            fetchSightings();
        } catch (err) { console.error(err); }
    };

    const handleSolve = async (personId) => {
        try {
            await markSolved(personId);
            alert('✅ Case marked as solved!');
            fetchMissing();
        } catch (err) { console.error(err); }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <button style={styles.backBtn} onClick={() => navigate('/home')}>← Back</button>
                    <img src={logo} alt="logo" style={styles.logo} />
                </div>

                <h2 style={styles.title}>👮 Admin Dashboard</h2>
                <p style={styles.subtitle}>Manage all cases and sightings</p>

                {error && <div style={styles.errorBox}>{error}</div>}

                {/* Tabs */}
                <div style={styles.tabsGrid}>
                    {[
                        { id: 'stats', label: '📊 Stats' },
                        { id: 'missing', label: '🚨 Missing' },
                        { id: 'sightings', label: '👁️ Sightings' },
                        { id: 'priority', label: '🔴 Priority' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            style={activeTab === tab.id ? styles.activeTab : styles.tab}
                            onClick={() => handleTabChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p style={styles.loadingText}>⏳ Loading...</p>
                ) : (
                    <div>
                        {/* Stats Tab */}
                        {activeTab === 'stats' && stats && (
                            <div>
                                <div style={styles.statsGrid}>
                                    {[
                                        { label: 'Active Cases', value: stats.total_active_cases, color: '#FF6B6B' },
                                        { label: 'Solved Cases', value: stats.total_solved_cases, color: '#97C459' },
                                        { label: 'Total Sightings', value: stats.total_sightings, color: '#85B7EB' },
                                        { label: 'Verified', value: stats.verified_sightings, color: '#5DCAA5' },
                                        { label: 'HIGH Matches', value: stats.high_match_sightings, color: '#EF9F27' },
                                        { label: 'Total Users', value: stats.total_users, color: '#AFA9EC' }
                                    ].map((stat, i) => (
                                        <div key={i} style={styles.statCard}>
                                            <p style={{ ...styles.statNum, color: stat.color }}>
                                                {stat.value}
                                            </p>
                                            <p style={styles.statLabel}>{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Missing Tab */}
                        {activeTab === 'missing' && (
                            <div>
                                {missing.length === 0 ? (
                                    <div style={styles.emptyBox}>
                                        <p style={styles.emptyText}>No missing persons found</p>
                                    </div>
                                ) : (
                                    missing.map((p, i) => (
                                        <div key={i} style={styles.itemCard}>
                                            <div style={styles.itemHeader}>
                                                <span style={styles.itemName}>{p.name}</span>
                                                <span style={{
                                                    ...styles.statusBadge,
                                                    background: p.status === 'active' ? '#2a0f0f' : '#0f2a14',
                                                    color: p.status === 'active' ? '#FF6B6B' : '#97C459',
                                                    border: `1px solid ${p.status === 'active' ? '#FF6B6B' : '#97C459'}`
                                                }}>
                                                    {p.status === 'active' ? '🔴 Active' : '✅ Solved'}
                                                </span>
                                            </div>
                                            <p style={styles.itemDetail}>📍 {p.last_seen_location}</p>
                                            <p style={styles.itemDetail}>🎂 Age: {p.age} • ⚧️ {p.gender}</p>
                                            {p.status === 'active' && (
                                                <button
                                                    style={styles.solveBtn}
                                                    onClick={() => handleSolve(p.person_id)}
                                                >
                                                    ✅ Mark as Solved
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Sightings Tab */}
                        {activeTab === 'sightings' && (
                            <div>
                                {sightings.length === 0 ? (
                                    <div style={styles.emptyBox}>
                                        <p style={styles.emptyText}>No sightings found</p>
                                    </div>
                                ) : (
                                    sightings.map((s, i) => (
                                        <div key={i} style={styles.itemCard}>
                                            <div style={styles.itemHeader}>
                                                <span style={styles.itemName}>📍 {s.location}</span>
                                                <span style={{
                                                    ...styles.matchBadge,
                                                    color: s.match_level === 'HIGH' ? '#FF6B6B' :
                                                           s.match_level === 'MEDIUM' ? '#EF9F27' : '#85B7EB'
                                                }}>
                                                    {s.match_level || 'N/A'}
                                                </span>
                                            </div>
                                            <p style={styles.itemDetail}>
                                                🎯 Score: {s.final_score || s.ai_match_score || 'N/A'}%
                                            </p>
                                            <p style={styles.itemDetail}>
                                                👤 By: {s.reported_by}
                                            </p>
                                            <p style={styles.itemDetail}>
                                                🕐 {s.reported_at?.slice(0, 16)}
                                            </p>
                                            <p style={styles.itemDetail}>
                                                {s.verified ? '✅ Verified' : '⏳ Not verified'}
                                            </p>
                                            {!s.verified && (
                                                <button
                                                    style={styles.verifyBtn}
                                                    onClick={() => handleVerify(s.sighting_id)}
                                                >
                                                    ✅ Verify Sighting
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* High Priority Tab */}
                        {activeTab === 'priority' && (
                            <div>
                                {highPriority.length === 0 ? (
                                    <div style={styles.emptyBox}>
                                        <p style={styles.emptyText}>No high priority cases</p>
                                    </div>
                                ) : (
                                    highPriority.map((p, i) => (
                                        <div key={i} style={{
                                            ...styles.itemCard,
                                            border: '2px solid #FF6B6B'
                                        }}>
                                            <div style={styles.itemHeader}>
                                                <span style={styles.itemName}>{p.name}</span>
                                                <span style={{ color: '#FF6B6B', fontSize: '12px', fontWeight: '700' }}>
                                                    🔴 HIGH PRIORITY
                                                </span>
                                            </div>
                                            <p style={styles.itemDetail}>📍 {p.last_seen_location}</p>
                                            <p style={styles.itemDetail}>🎂 Age: {p.age}</p>
                                            <p style={styles.itemDetail}>📅 {p.last_seen_date}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
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
    title: {
        color: '#AFA9EC',
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
        marginBottom: '16px',
        textAlign: 'center'
    },
    tabsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
        marginBottom: '20px'
    },
    tab: {
        padding: '10px',
        background: '#0f0f1a',
        border: '1px solid #2a2a4a',
        borderRadius: '10px',
        color: '#888',
        fontSize: '12px',
        fontWeight: '700',
        cursor: 'pointer'
    },
    activeTab: {
        padding: '10px',
        background: '#1a0f2a',
        border: '2px solid #AFA9EC',
        borderRadius: '10px',
        color: '#AFA9EC',
        fontSize: '12px',
        fontWeight: '700',
        cursor: 'pointer'
    },
    loadingText: {
        color: '#888',
        textAlign: 'center',
        padding: '20px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px'
    },
    statCard: {
        background: '#0f0f1a',
        borderRadius: '16px',
        padding: '16px',
        textAlign: 'center',
        border: '1px solid #2a2a4a'
    },
    statNum: {
        fontSize: '28px',
        fontWeight: '700',
        margin: '0 0 4px 0'
    },
    statLabel: {
        color: '#888',
        fontSize: '12px',
        margin: 0,
        fontWeight: '600'
    },
    emptyBox: {
        background: '#0f0f1a',
        borderRadius: '16px',
        padding: '30px',
        textAlign: 'center',
        border: '1px solid #2a2a4a'
    },
    emptyText: {
        color: '#888',
        fontSize: '16px',
        margin: 0
    },
    itemCard: {
        background: '#0f0f1a',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '12px',
        border: '1px solid #2a2a4a'
    },
    itemHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    itemName: {
        color: '#fff',
        fontSize: '15px',
        fontWeight: '700'
    },
    itemDetail: {
        color: '#888',
        fontSize: '13px',
        margin: '4px 0'
    },
    statusBadge: {
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700'
    },
    matchBadge: {
        fontSize: '12px',
        fontWeight: '700'
    },
    solveBtn: {
        width: '100%',
        padding: '8px',
        background: '#0f2a14',
        border: '1px solid #97C459',
        borderRadius: '10px',
        color: '#97C459',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '10px'
    },
    verifyBtn: {
        width: '100%',
        padding: '8px',
        background: '#0f1a2a',
        border: '1px solid #85B7EB',
        borderRadius: '10px',
        color: '#85B7EB',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '10px'
    }
};

export default AdminDashboard;