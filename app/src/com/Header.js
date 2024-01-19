import logo from "../img/logo512.png";

function Header() {
  return (
    <nav className="navbar navbar-theme" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>
    </nav>
  );
}

export default Header;
