import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="navbar" role="banner">
      <nav className="navbar__inner" aria-label="Main navigation">
        <Link to="/" className="navbar__logo" aria-label="The Pantry - Home">
          <img
            src="/images/pantry-logo.png"
            alt="The Pantry logo"
            className="navbar__logo-img"
          />
          <span className="navbar__logo-text">The Pantry</span>
        </Link>

        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul
          id="navbar-menu"
          className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}
          role="menubar"
        >
          <li role="none">
            <a
              href="https://thepantry.ucdavis.edu/"
              className="navbar__link"
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              The Pantry Website
            </a>
          </li>
          <li role="none">
            <a
              href="https://forms.gle/2NjabF5QZTwcEbQc6"
              className="navbar__link"
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              Feedback
            </a>
          </li>
          <li role="none">
            <Link
              to="/"
              className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li role="none">
            <Link
              to="/detect"
              className={`navbar__link navbar__link--cta ${isActive('/detect') ? 'navbar__link--active' : ''}`}
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              Ingredient Helper
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
