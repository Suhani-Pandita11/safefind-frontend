import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import api from '../services/api';

function Leaderboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentEmail = localStorage.getItem('email');

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const res = await api.get('/users/leaderboard');
            setUsers(res.data.users);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const getMedal = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `#${index + 1}`;
    };

    const getKarmaLevel = (karma) => {
        if (karma >= 100) return { label: '🏆 Legend', color: '#FFD166' };
        if (karma >= 50) return { label: '⭐ Hero', color: '#97C459' };
        if (karma >= 10) return { label: '🔰 Helper', color: '#85B7EB' };
        return { label: '🌱 Newcomer', color: '#888' };
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <button style={styles.backBtn} onClick={() => navigate('/home')}>← Back</button>
                    <img src={logo} alt="logo" style={styles.logo} />
                </div>

                <h2 style={styles.title}>🏆 Leaderboard</h2>
                <p style={styles.subtitle}>Top contributors helping find missing people</p>

                {loading ? (
                    <p style={styles.loadingText}>⏳ Loading...</p>
                ) : users.length === 0 ? (
                    <div style={styles.emptyBox}>
                        <p style={styles.emptyText}>No users yet!</p>
                        <p style={styles.emptySubtext}>Upload sightings to earn karma 😊</p>
                    </div>
                ) : (
                    users.map((user, i) => {
                        const level = getKarmaLevel(user.karma_score || 0);
                        const isMe = user.email === currentEmail;
                        return (
                            <div key={i} style={{
                                ...styles.userCard,
                                border: isMe ? '2px solid #FFD166' : '1px solid #2a2a4a',
                                background: isMe ? '#1a1a0a' : '#0f0f1a'
                            }}>
                                <div style={styles.rank}>{getMedal(i)}</div>
                                <div style={styles.userInfo}>
                                    <div style={styles.nameRow}>
                                        <span style={styles.userName}>{user.name}</span>
                                        {isMe && <span style={styles.meBadge}>You</span>}
                                    </div>
                                    <span style={{ ...styles.levelBadge, color: level.color }}>
                                        {level.label}
                                    </span>
                                </div>
                                <div style={styles.karmaBox}>
                                    <p style={styles.karmaNum}>{user.karma_score || 0}</p>
                                    <p style={styles.karmaLabel}>Karma</p>
                                </div>
                            </div>
                        );
                    })
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
        color: '#FFD166',
        fontSize: '22px',
        fontWeight: '700',
        margin: '0 0 4px 0'
    },
    subtitle: {
        color: '#888',
        fontSize: '13px',
        margin: '0 0 20px 0'
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
    userCard: {
        borderRadius: '16px',
        padding: '14px',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    rank: {
        fontSize: '24px',
        minWidth: '36px',
        textAlign: 'center'
    },
    userInfo: {
        flex: 1
    },
    nameRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '4px'
    },
    userName: {
        color: '#fff',
        fontSize: '15px',
        fontWeight: '700'
    },
    meBadge: {
        background: '#FFD166',
        color: '#333',
        fontSize: '10px',
        fontWeight: '700',
        padding: '2px 8px',
        borderRadius: '20px'
    },
    levelBadge: {
        fontSize: '12px',
        fontWeight: '600'
    },
    karmaBox: {
        textAlign: 'center'
    },
    karmaNum: {
        color: '#FFD166',
        fontSize: '20px',
        fontWeight: '700',
        margin: 0
    },
    karmaLabel: {
        color: '#666',
        fontSize: '11px',
        margin: 0
    }
};

export default Leaderboard;