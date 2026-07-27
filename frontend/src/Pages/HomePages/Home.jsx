import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';
import axios from 'axios';
import '../../Pages_css/Home.css';
import { handleError, handleSuccess } from '../../utils';
import { ToastContainer } from 'react-toastify';

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [contests, setContests] = useState([]);
    const [user, setUser] = useState('');

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            setUser(loggedInUser);
        }
        UpdateStats();
    }, []); 



    const fetchContest = async () => {
        const token = localStorage.getItem('token');
        const constResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/Contest`, {
            headers: { Authorization: token }
        });
        setContests(constResponse.data);
    };

    const UpdateStats = async () => {
        setLoading(true);
        const Mail = localStorage.getItem('email');
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/information/${Mail}`);
        const leetcodeUsername = response.data.leetcodeUsername;
        localStorage.setItem("usname",leetcodeUsername);
        
        if (response.data) {
            handleSuccess("successfully updated stats");
            setData(response.data.stats);
        } else {
            handleError("Server Error");
        }
        setLoading(false);
    };

    const getnewstats = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const usname = localStorage.getItem('usname');
        const email = localStorage.getItem('email')
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/home/${usname}?email=${email}`,{
            headers: {Authorization:token}
        });

        if(response.data.succcess){
            handleSuccess("Successfully fetched new stats");
            setData(response.data.stats);
        }else{
            handleError("Server Error");
        }
        setLoading(false);
    };

    return (
        <div className="home-page-unique">
            <Navbar />

            <div className="main-layout">
                <Sidebar />

                <main className="content-area">
                    <div className="dashboard-layout">
                        {/* LEFT: Stats Section */}
                        <div className="stats-main-wrapper">
                            <h1 className="section-title">Welcome Back, {user}</h1>
                            <div className="stats-display-card">
                                <div className="stats-info">
                                    <div className="circle-progress">
                                        <span className="total-count">{data.totalSolved || 0}</span>
                                        <span className="sub-text">Q Solved</span>
                                    </div>
                                    <div className="stats-details">
                                        <div className="detail-item easy-row">
                                            <span className="dot easy"></span>
                                            <span className="label">Easy</span>
                                            <span className="value">{data.easy || 0}</span>
                                        </div>
                                        <div className="detail-item medium-row">
                                            <span className="dot medium"></span>
                                            <span className="label">Medium</span>
                                            <span className="value">{data.medium || 0}</span>
                                        </div>
                                        <div className="detail-item hard-row">
                                            <span className="dot hard"></span>
                                            <span className="label">Hard</span>
                                            <span className="value">{data.hard || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="stats-actions">
                                <button className="action-btn update-btn" onClick={getnewstats}>
                                    {loading ? "wait..." : "Update My Stats"}
                                </button>
                            </div>
                        </div>

                        {/* RIGHT: Contest Section */}
                        <div className="contests-side-box">
                            <h2 className="sub-section-title">Upcoming Contests 🔥</h2>
                            <div className="contests-list-container">
                                {contests.length > 0 ? contests.map((contest, index) => (
                                    <div
                                        key={index}
                                        className="contest-item-card"
                                        onClick={() => window.open(`https://leetcode.com/contest/${contest.titleSlug}`, '_blank')}
                                    >
                                        <div className="contest-tag">LeetCode</div>
                                        <h3>{contest.title}</h3>
                                        <p className="contest-date">
                                            📅 {new Date(contest.startTime * 1000).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                        </p>
                                        <span className="reg-text">Register Now →</span>
                                    </div>
                                )) : <p className="empty-text">Fetching live data...</p>}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <ToastContainer position="bottom-left" autoClose={2000} theme="dark" limit={1} />
        </div>
    );
};

export default Home;