import React from 'react'
import logoImage from '../../assets/images/al-ansari.png';
import Jcb from '../../assets/images/jcb.png';
import { Link } from 'react-router-dom';
import "./Home.css"


function Home() {
    return (
        <div className="dashboard-container">
            {/* Left Sidebar */}
            <aside className="sidebar">
                <div className="logo-container">
                    <img src={logoImage} alt="Company Logo" className="logo" />
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li className="active"><Link to="/">Home</Link></li>
                        <li><Link to="/equipments">Equipements Inventory</Link></li>
                        <li><Link to="/stocks">Stocks Inventory</Link></li>
                        <li><Link to="/service-form">Periodic Service Reports</Link></li>
                        <li><a href="#clients">LPO For Quatation</a></li>
                        <li><a href="/">Tyre Changing Reports</a></li>
                        <li><a href="#reports">Reports</a></li>
                        <li><a href="#reports">Notifications</a></li>
                        <li><a href="#settings">Settings</a></li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <p>Temp text here - will be updated later.</p>
                </div>
            </aside>

            {/* Right Content Area */}
            <main className="content-area">
                <div className="hero-section">
                    <div className="hero-overlay"></div>
                    <img src={Jcb} alt="Hero Img" className="hero-image" />
                    <div className="hero-text">
                        <h1>Welcome to AI Ansari Transport & Enterprises</h1>
                        <p>Your Trusted Partner in Transport and Logistics</p>
                    </div>
                </div>

                <div className="content-section">
                    <div className="company-details">
                        <div className="company-name">AI Ansari Transport & Enterprises W.L.L</div>
                        <div>Office No.2 Floor No.1 Gate No.3 Town Centre</div>
                        <div>Bin Omran, Doha, Qatar, P.O BOX-1265</div>
                        <div className="contract-wrap">
                            <div className="phone-home">
                                <span>Tel: +974 44505 700/800</span>
                                <span>Fax: +974 44505 900</span>
                            </div>
                            <div className="email">
                                <span>info@ansarigroup.co</span>
                                <span>www.ansarigroup.co</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-cards">
                        <div className="card">
                            <div className="card-icon">
                                <i className="icon-transport"></i>
                            </div>
                            <h3>Transport Services</h3>
                            <p>We provide reliable and efficient transport solutions for all your needs.</p>
                        </div>

                        <div className="card">
                            <div className="card-icon">
                                <i className="icon-logistics"></i>
                            </div>
                            <h3>Logistics Management</h3>
                            <p>End-to-end logistics solutions tailored to your business requirements.</p>
                        </div>

                        <div className="card">
                            <div className="card-icon">
                                <i className="icon-global"></i>
                            </div>
                            <h3>Global Network</h3>
                            <p>Connected worldwide to serve you better across continents.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home