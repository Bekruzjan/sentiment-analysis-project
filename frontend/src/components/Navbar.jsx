import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/login");

  };

  return (

    <nav className="navbar">

      <div className="navbar-left">

        <h2>Sentiment AI</h2>

      </div>

      <div className="navbar-right">

        {!user && (

          <div className="auth-buttons">

            <Link
              to="/login"
              className="auth-link"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="auth-link"
            >
              Register
            </Link>

          </div>

        )}

        {user && (

          <>

            <div className="nav-links">

              <Link
                to="/dashboard"
                className="nav-link"
              >
                Dashboard
              </Link>

              <Link
                to="/analyze"
                className="nav-link"
              >
                Analyze
              </Link>

              <Link
                to="/history"
                className="nav-link"
              >
                History
              </Link>

              <Link
                to="/profile"
                className="nav-link"
              >
                Profile
              </Link>

            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </>

        )}

      </div>

    </nav>

  );
}

export default Navbar;