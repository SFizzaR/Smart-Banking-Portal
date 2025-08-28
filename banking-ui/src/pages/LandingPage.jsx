import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import SignUpModal from './SignUpModal';
import LoginModal from './LoginModal';
const LandingPage = () => {
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);
    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-mode' : '';
    }, [isDarkMode]);

    return (
        <div className="landing-page">
            {/* Intro Notification Bar */}
            <div className="intro-bar">
                🚀 Now offering instant account opening in under 3 minutes!
        
            </div>

            {/* Navbar */}
            <nav className="navbar sticky">
                <div className="logo-with-image">
                    <img src="assets/logo.png" alt="Bank Alfalah" className="bank-logo" />
                    <span className="bank-name">ALFALAH SMART PORTAL</span>
                </div>
                <div className="nav-buttons">
                    <button onClick={() => setShowLogin(true)} className="nav-btn">Login</button>
                    <button onClick={() => setShowSignup(true)} className="nav-btn">Sign Up</button>
                    <button
                        className="nav-btn toggle-btn"
                        onClick={() => document.body.classList.toggle("dark-mode")}
                    >
                        Toggle Mode
                    </button>
                </div>

            </nav>

            <header className="hero boxed-section">
                <div className="hero-grid">
                    <div className="hero-left">
                        <h1 className="highlighted-heading">Secure, Smart & Seamless Banking</h1>
                        <p>Pakistan’s leading digital banking experience. Join millions who bank the smarter way.</p>
                        <button className="cta-btn" onClick={() => setShowSignup(true)}>Open an Account</button>
                    </div>
                    <div className="hero-right">
                        <img src="assets/frontpic.png" alt="Banking" className="hero-img" />
                    </div>
                </div>
            </header>


            {/* Trust Badges Section */}
            <section className="trust-badges">
                <div className="badge">🌟 Trusted by 2 Million+ Users</div>
                <div className="badge">🔒 ISO 27001 Certified</div>
                <div className="badge">⚡ 99.9% Uptime Guarantee</div>
                <div className="badge">🔒 Security Top Priority</div>
                <div className="badge">🌐 Real-time Expense Tracking</div>
            </section>

            {/* Modals */}
            {showSignup && <SignUpModal onClose={() => setShowSignup(false)} />}
            {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={() => navigate('/dashboard')} />}

            {/* Tagline Section */}
            <section className="tagline-section boxed-section">
                <h2>Your Money, Your Rules</h2>
                <p>Track every rupee, make smarter decisions, and grow your wealth — all from your screen.</p>

                <div className="tagline-gif">
                    <p className="gif-caption">
                        From the moment your income hits your account to the last rupee spent, our dynamic dashboard lets you visualize your financial journey like never before.
                        Track your daily expenses, savings goals, and recurring bills with stunning clarity. Get real-time insights, beautifully animated graphs, and predictive budgeting tools that help you stay one step ahead. Whether you're planning for the month, the year, or your future, we turn your data into easy-to-understand visuals — empowering you to make informed, confident financial decisions every single day.
                    </p>
                    <img src="assets/moneyflow.gif" alt="Money Flow Animation" />
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section boxed-section">
                <h2>Why Choose Bank Alfalah?</h2>
                <div className="benefit-cards">
                    <div className="card">
                        <img src="assets/flow.gif.gif" alt="Mobile Banking GIF" className="benefit-gif" />
                        <h3>24/7 Mobile Banking</h3>
                        <p>Access your account anytime, anywhere with our secure app.</p>
                    </div>
                    <div className="card">
                        <img src="assets/online-investment.gif" alt="Fast Transfer GIF" className="benefit-gif" />
                        <h3>Fast Fund Transfers</h3>
                        <p>Send money instantly via IBFT and Alfalah Wallet.</p>
                    </div>
                    <div className="card">
                        <img src="assets/document.gif" alt="Pay Bills GIF" className="benefit-gif" />
                        <h3>Pay Bills Easily</h3>
                        <p>Pay utilities, fees, and subscriptions in seconds.</p>
                    </div>
                    <div className="card">
                        <img src="assets/credit-card.gif" alt="Account Opening GIF" className="benefit-gif" />
                        <h3>Instant Account Opening</h3>
                        <p>Open your account online with just your CNIC in 5 minutes.</p>
                    </div>
                </div>
            </section>



            {/* Features Grid */}
            <section className="features-section boxed-section">
                <h2>Banking Made Simple</h2>
                <div className="features-grid">
                    <div className="feature-box">
                        <img src="assets/login.png" alt="Secure Login" className="feature-icon" />
                        <h4>Secure Login</h4>
                        <p>Protect your account with strong authentication and data encryption.</p>
                    </div>
                    <div className="feature-box">
                        <img src="assets/funds.png" alt="Fund Transfers" className="feature-icon" />
                        <h4>Fund Transfers</h4>
                        <p>Send money instantly to anyone with just a few clicks.</p>
                    </div>
                    <div className="feature-box">
                        <img src="assets/transactions.png" alt="Transaction History" className="feature-icon" />
                        <h4>Transaction History</h4>
                        <p>Track all your past transactions in one convenient place.</p>
                    </div>
                    <div className="feature-box">
                        <img src="assets/account.png" alt="Account Info" className="feature-icon" />
                        <h4>Account Information</h4>
                        <p>View your balance, statements, and account details anytime.</p>
                    </div>
                </div>
            </section>


            {/* ✅ Testimonial Section */}
            <section className="testimonials-section boxed-section">
                <h2>Hear From Our Customers</h2>
                <div className="testimonial-cards">
                    <div className="testimonial">
                        <div className="testimonial-content">
                            <p>“I opened my account in minutes and now manage all my bills with one tap. Seamless!”</p>
                            <div className="stars">⭐⭐⭐⭐⭐</div>
                        </div>
                        <div className="testimonial-footer">
                            <img src="assets/areeba.png" alt="Areeba" className="testimonial-pic" />
                            <div>
                                <strong>Areeba M.</strong>
                                <p>Freelancer, Karachi</p>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial">
                        <div className="testimonial-content">
                            <p>“Charts and spending insights helped me save more every month. Game changer!”</p>
                            <div className="stars">⭐⭐⭐⭐⭐</div>
                        </div>
                        <div className="testimonial-footer">
                            <img src="assets/man1.png" alt="Usman" className="testimonial-pic" />
                            <div>
                                <strong>Usman T.</strong>
                                <p>Marketing Lead, Lahore</p>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial">
                        <div className="testimonial-content">
                            <p>“Bank Alfalah's online portal makes fund transfers and bill payments incredibly simple. I haven’t visited a branch in months!”</p>
                            <div className="stars">⭐⭐⭐⭐⭐</div>
                        </div>
                        <div className="testimonial-footer">
                            <img src="assets/sarah.png" alt="Usman" className="testimonial-pic" />
                            <div>
                                <strong>Sarah S.</strong>
                                <p>Social Worker, Karachi</p>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial">
                        <div className="testimonial-content">
                            <p>“The webiste is sleek and fast. I can check my balance and manage expenses on the go. Highly recommended!”</p>
                            <div className="stars">⭐⭐⭐⭐⭐</div>
                        </div>
                        <div className="testimonial-footer">
                            <img src="/assets/bilal.png" alt="Usman" className="testimonial-pic" />
                            <div>
                                <strong>Bilal A.</strong>
                                <p>Civil Engineer, Faisalabad</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="final-cta">
                <h2>Ready to Experience Seamless Banking?</h2>
                <button className="cta-btn" onClick={() => setShowSignup(true)}>Get Started Now</button>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div>
                    <p>&copy; 2025 Bank Alfalah. All rights reserved.</p>
                    <p>Privacy Policy | Terms of Use</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
