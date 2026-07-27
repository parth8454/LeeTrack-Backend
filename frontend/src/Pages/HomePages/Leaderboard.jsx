import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';
import axios from 'axios';
import '../../Pages_css/Home.css';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api`, {
            headers: { Authorization: token }
        });
        setLeaderboard(response.data);
    };

    return (
        <div className="home-page-unique">
            <Navbar />

            <div className="main-layout">
                <Sidebar />

                <main className="content-area">
                    <div className="leaderboard-wrapper">
                        <h1 className="section-title">Class Rankings</h1>
                        <div className="table-container">
                            <table className="leaderboard-table">
                                <thead>
                                    <tr>
                                        <th># Rank</th>
                                        <th>Warrior Name</th>
                                        <th>Total Solved</th>
                                        <th>Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((user, index) => (
                                        <tr key={user._id}>
                                            <td className="rank-cell">
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''} {index + 1}
                                            </td>
                                            <td className="name-cell">{user.name}</td>
                                            <td className="solved-cell">{user.stats?.totalSolved ?? '—'}</td>
                                            <td className="solver-cell">{user.stats?.points ?? '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Leaderboard;