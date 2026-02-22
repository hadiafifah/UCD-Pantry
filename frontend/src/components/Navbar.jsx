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
        <Link to="/" className="navbar__logo" aria-label="PicAPlate - Home">
          <img
            src="/images/pantry-logo.png"
            alt="The Pantry logo"
            className="navbar__logo-img"
          />
          <span className="navbar__logo-text">PicAPlate</span>
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
            <Link
              to="/"
              className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>

          <li role="none" className="navbar__item navbar__item--dropdown">
            <button
              type="button"
              className="navbar__link navbar__link--trigger"
              aria-haspopup="true"
            >
              Contribute
            </button>
            <ul className="navbar__dropdown" role="menu" aria-label="Contribute links">
              <li role="none">
                <a
                  href="https://thepantry.ucdavis.edu/"
                  className="navbar__dropdown-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Pantry website
                </a>
              </li>
              <li role="none">
                <a
                  href="https://thepantry.ucdavis.edu/donate"
                  className="navbar__dropdown-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Item Donation List
                </a>
              </li>
              <li role="none">
                <a
                  href="https://docs.google.com/forms/u/3/d/e/1FAIpQLSdtQMAAp63eq_2mC-qGADKopCWUD4H_b_cwirKYLcz7DDfSjA/viewform"
                  className="navbar__dropdown-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Volunteer at the Pantry
                </a>
              </li>
            </ul>
          </li>

          <li role="none" className="navbar__item navbar__item--dropdown">
            <button
              type="button"
              className="navbar__link navbar__link--trigger"
              aria-haspopup="true"
            >
              Resources
            </button>
            <ul className="navbar__dropdown" role="menu" aria-label="Resource links">
              <li role="none">
                <a
                  href="https://tinyurl.com/pantrywalk-in"
                  className="navbar__dropdown-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Walk In Menu
                </a>
              </li>
              <li role="none">
                <a
                  href="https://order.thepantry.ucdavis.edu/"
                  className="navbar__dropdown-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Order Grab n&apos; Go Items
                </a>
              </li>
              <li role="none">
                <a
                  href="https://docs.google.com/document/d/1y8c68m12DyACptbMXLj1FBDE77QcsKgL4ifxlkC90a4/edit?usp=sharing"
                  className="navbar__dropdown-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Pantry Living Doc
                </a>
              </li>
            </ul>
          </li>

          <li role="none" className="navbar__item navbar__item--dropdown">
            <button
              type="button"
              className="navbar__link navbar__link--trigger"
              aria-haspopup="true"
            >
              Social Media
            </button>
            <ul className="navbar__dropdown" role="menu" aria-label="Social media links">
              <li role="none">
                <a
                  href="https://www.tiktok.com/@asucdpantry"
                  className="navbar__dropdown-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  TikTok
                </a>
              </li>
              <li role="none">
                <a
                  href="https://www.youtube.com/channel/UC6HmZl3rBCG4DPs3-_208ow/"
                  className="navbar__dropdown-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  YouTube
                </a>
              </li>
            </ul>
          </li>

          <li role="none">
            <Link
              to="/detect"
              className={`navbar__link navbar__link--cta ${isActive('/detect') ? 'navbar__link--active' : ''}`}
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              PicAPlate
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
