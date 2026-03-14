import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNearbyCases, getWarnings, getSightingClusters } from '../services/api';
import logo from '../logo.png';

function Notifications() {
    const navigate = useNavigate();
    const [nearbyCases, setNearbyCases] = useState([]);
    const [warnings, setWarnings] = useState([]);
    const [clusters, setClusters] = useState([]);
    const [activeTab, setActiveTab] = useState('cases');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [casesRes, warningsRes, clustersRes] = await Promise.all([
                getNearbyCases(),
                getWarnings(),
                getSightingClusters()
            ]);
            setNearbyCases(casesRes.data.nearby_cases || []);
            setWarnings(warningsRes.data.warnings || []);
            setClusters(clustersRes.data.clusters || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Header */}
                <div style={styles.header}>
                    <button style={styles.backBtn} onClick={() => navigate('/home')}>← Back</button>
                    <img src={logo} alt="logo" style={styles.logo} />
                </div>

                <h2 style={styles.title}>🔔 Notifications</h2>
                <p style={styles.subtitle}>Stay updated with nearby cases</p>

                {/* Tabs */}
                <div style={styles.tabs}>
                    {[
                        { id: 'cases', label: '📋 Cases', count: nearbyCases.length },
                        { id: 'warnings', label: '⚠️ Warnings', count: warnings.length },
                        { id: 'clusters', label: '👥 Clusters', count: clusters.length }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            style={activeTab === tab.id ? styles.activeTab : styles.tab}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span style={styles.badge}>{tab.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p style={styles.loadingText}>⏳ Loading...</p>
                ) : (
                    <div>
                        {/* Nearby Cases */}
                        {activeTab === 'cases' && (
                            <div>
                                {nearbyCases.length === 0 ? (
                                    <div style={styles.emptyBox}>
                                        <p style={styles.emptyText}>No nearby cases found</p>
                                    </div>
                                ) : (
                                    nearbyCases.map((c, i) => (
                                        <div key={i} style={styles.caseCard}>
                                            <div style={styles.caseHeader}>
                                                <span style={styles.caseName}>{c.name}</span>
                                                <span style={styles.caseStatus}>🔴 Missing</span>
                                            </div>
                                            <p style={styles.caseDetail}>
                                                🎂 Age: {c.age} • ⚧️ {c.gender}
                                            </p>
                                            <p style={styles.caseDetail}>
                                                📍 {c.last_seen_location}
                                            </p>
                                            <p style={styles.caseDetail}>
                                                📅 {c.last_seen_date}
                                            </p>
                                            {c.distance_km && (
                                                <p style={styles.distance}>
                                                    📡 {c.distance_km} km away
                                                </p>
                                            )}
                                            <button
                                                style={styles.sightingBtn}
                                                onClick={() => navigate('/sighting')}
                                            >
                                                👁️ Report Sighting
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Warnings */}
                        {activeTab === 'warnings' && (
                            <div>
                                {warnings.length === 0 ? (
                                    <div style={styles.emptyBox}>
                                        <p style={styles.emptyText}>No active warnings</p>
                                        <p style={styles.emptySubtext}>Stay safe! 🛡️</p>
                                    </div>
                                ) : (
                                    warnings.map((w, i) => (
                                        <div key={i} style={styles.warningCard}>
                                            <div style={styles.warningHeader}>
                                                <span style={styles.warningType}>
                                                    ⚠️ {w.warning_type}
                                                </span>
                                            </div>
                                            <p style={styles.warningDesc}>{w.description}</p>
                                            <p style={styles.caseDetail}>📍 {w.location}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Sighting Clusters */}
                        {activeTab === 'clusters' && (
                            <div>
                                {clusters.length === 0 ? (
                                    <div style={styles.emptyBox}>
                                        <p style={styles.emptyText}>No sighting clusters yet</p>
                                        <p style={styles.emptySubtext}>
                                            Clusters appear when multiple people spot the same person!
                                        </p>
                                    </div>
                                ) : (
                                    clusters.map((c, i) => (
                                        <div key={i} style={styles.clusterCard}>
                                            <div style={styles.clusterHeader}>
                                                <span style={styles.clusterName}>{c.person_name}</span>
                                                <span style={{
                                                    ...styles.confidenceBadge,
                                                    background: c.confidence === 'VERY HIGH' ? '#2a0f0f' : '#0f1a2a',
                                                    color: c.confidence === 'VERY HIGH' ? '#FF6B6B' : '#85B7EB',
                                                    border: `1px solid ${c.confidence === 'VERY HIGH' ? '#FF6B6B' : '#85B7EB'}`
                                                }}>
                                                    {c.confidence}
                                                </span>
                                            </div>
                                            <p style={styles.caseDetail}>📍 {c.location}</p>
                                            <p style={styles.caseDetail}>
                                                👥 {c.sighting_count} people spotted them
                                            </p>
                                            <p style={styles.caseDetail}>
                                                🎯 Avg match: {c.average_match_score}%
                                            </p>
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
        color: '#97C459',
        fontSize: '22px',
        fontWeight: '700',
        margin: '0 0 4px 0'
    },
    subtitle: {
        color: '#888',
        fontSize: '13px',
        margin: '0 0 20px 0'
    },
    tabs: {
        display: 'flex',
        gap: '8px',
        marginBottom: '20px'
    },
    tab: {
        flex: 1,
        padding: '10px',
        background: '#0f0f1a',
        border: '1px solid #2a2a4a',
        borderRadius: '10px',
        color: '#888',
        fontSize: '12px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px'
    },
    activeTab: {
        flex: 1,
        padding: '10px',
        background: '#0f2a14',
        border: '2px solid #97C459',
        borderRadius: '10px',
        color: '#97C459',
        fontSize: '12px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px'
    },
    badge: {
        background: '#FF6B6B',
        color: '#fff',
        borderRadius: '50%',
        width: '18px',
        height: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: '700'
    },
    loadingText: {
        color: '#888',
        textAlign: 'center',
        padding: '20px'
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
        margin: '0 0 8px 0'
    },
    emptySubtext: {
        color: '#666',
        fontSize: '13px',
        margin: 0
    },
    caseCard: {
        background: '#0f0f1a',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '12px',
        border: '1px solid #2a2a4a'
    },
    caseHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    caseName: {
        color: '#fff',
        fontSize: '16px',
        fontWeight: '700'
    },
    caseStatus: {
        color: '#FF6B6B',
        fontSize: '12px',
        fontWeight: '600'
    },
    caseDetail: {
        color: '#888',
        fontSize: '13px',
        margin: '4px 0'
    },
    distance: {
        color: '#5DCAA5',
        fontSize: '13px',
        margin: '4px 0',
        fontWeight: '600'
    },
    sightingBtn: {
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
    },
    warningCard: {
        background: '#1a0a0a',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '12px',
        border: '1px solid #FF6B6B'
    },
    warningHeader: {
        marginBottom: '8px'
    },
    warningType: {
        color: '#FF6B6B',
        fontSize: '14px',
        fontWeight: '700'
    },
    warningDesc: {
        color: '#ccc',
        fontSize: '14px',
        margin: '0 0 8px 0'
    },
    clusterCard: {
        background: '#0f0f1a',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '12px',
        border: '1px solid #EF9F27'
    },
    clusterHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    clusterName: {
        color: '#fff',
        fontSize: '16px',
        fontWeight: '700'
    },
    confidenceBadge: {
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700'
    }
};

export default Notifications;