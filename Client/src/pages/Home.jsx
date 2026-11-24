import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <Link to="/" className="brand">
                    <span className="brand-mark">S</span>
                    StudentMart
                </Link>

                <div className="landing-nav-actions">
                    <Link to="/login" className="nav-login">
                        Student Login
                    </Link>

                    <Link to="/admin/login" className="nav-admin">
                        Admin Portal
                    </Link>

                    <Link to="/register" className="nav-signup">
                        Sign Up
                    </Link>
                </div>
            </nav>

            <main className="hero">
                <div className="hero-content">
                    <span className="eyebrow">
                        THE STUDENT MARKETPLACE
                    </span>

                    <h1>
                        Your campus.
                        <br />
                        Your marketplace.
                    </h1>

                    <p className="hero-description">
                        Welcome to StudentMart. Buy, sell and discover
                        everything you need, right within your student
                        community.
                    </p>

                    <div className="hero-actions">
                        <Link to="/register" className="hero-primary">
                            Get Started
                        </Link>

                        <Link to="/login" className="hero-secondary">
                            Already a member? Login
                        </Link>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="visual-card-main">
                        <span className="visual-label">
                            BUILT FOR STUDENTS
                        </span>

                        <div className="visual-symbol">S.</div>

                        <h2>Buy. Sell. Connect.</h2>
                        <p>Your campus marketplace starts here.</p>
                    </div>

                    <div className="floating-card floating-top">
                        <span>01 / BUY</span>
                        <strong>Find what you need.</strong>
                    </div>

                    <div className="floating-card floating-bottom">
                        <span>02 / SELL</span>
                        <strong>Give things a second life.</strong>
                    </div>
                </div>
            </main>

            <footer className="landing-footer">
                <span>(c) 2026 StudentMart</span>
                <span>Made for students, by students.</span>
            </footer>
        </div>
    );
}

export default Home;