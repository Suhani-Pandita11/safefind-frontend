import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ReportMissing from './pages/ReportMissing';
import UploadSighting from './pages/UploadSighting';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import Cases from './pages/Cases';
import Leaderboard from './pages/Leaderboard';

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/report" element={<PrivateRoute><ReportMissing /></PrivateRoute>} />
                <Route path="/sighting" element={<PrivateRoute><UploadSighting /></PrivateRoute>} />
                <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                <Route path="/cases" element={<PrivateRoute><Cases /></PrivateRoute>} />
                <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;