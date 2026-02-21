import { Link } from 'react-router-dom'
import {
  ChefHat,
  Camera,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Heart,
  Users,
  ShoppingBag,
  ClipboardList,
  FileText,
} from 'lucide-react'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero" aria-label="Welcome to The Pantry Ingredient Helper">
        <div className="hero__content">
          <p className="hero__badge">ASUCD Pantry</p>
          <h1 className="hero__title">
            Turn Your Pantry Haul Into
            <span className="hero__title-accent"> Delicious Meals</span>
          </h1>
          <p className="hero__subtitle">
            Point your camera at your pantry ingredients and let our AI
            discover recipes you can cook right now. Built for Aggies, by
            Aggies.
          </p>
          <div className="hero__actions">
            <Link to="/detect" className="btn btn--primary btn--lg">
              <Camera size={20} />
              Launch Detect-n-Dish
              <ArrowRight size={18} />
            </Link>
            <a
              href="https://thepantry.ucdavis.edu/"
              className="btn btn--outline-dark btn--lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit The Pantry
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" aria-labelledby="how-heading">
        <div className="section__inner">
          <h2 id="how-heading" className="section__heading">
            How It Works
          </h2>
          <p className="section__subheading">
            Three simple steps to go from ingredients to a home-cooked meal.
          </p>
          <div className="steps">
            <article className="step-card">
              <div className="step-card__icon">
                <Camera size={28} />
              </div>
              <div className="step-card__number">1</div>
              <h3 className="step-card__title">Scan Your Ingredients</h3>
              <p className="step-card__desc">
                Use your webcam to scan the items from your latest Pantry haul.
                Our AI model detects common ingredients automatically.
              </p>
            </article>
            <article className="step-card">
              <div className="step-card__icon">
                <ChefHat size={28} />
              </div>
              <div className="step-card__number">2</div>
              <h3 className="step-card__title">Get Recipe Suggestions</h3>
              <p className="step-card__desc">
                Based on detected and selected ingredients, we surface simple,
                nourishing recipes that match what you have on hand.
              </p>
            </article>
            <article className="step-card">
              <div className="step-card__icon">
                <BookOpen size={28} />
              </div>
              <div className="step-card__number">3</div>
              <h3 className="step-card__title">Cook and Enjoy</h3>
              <p className="step-card__desc">
                Follow step-by-step instructions, watch embedded video guides,
                and turn your groceries into fuel for academic success.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links" aria-labelledby="links-heading">
        <div className="section__inner">
          <h2 id="links-heading" className="section__heading">
            Pantry Resources
          </h2>
          <p className="section__subheading">
            Everything you need from The ASUCD Pantry in one place.
          </p>

          <div className="link-groups">
            {/* Join & Contribute */}
            <div className="link-group">
              <h3 className="link-group__title">
                <Heart size={18} />
                Join Us & Contribute
              </h3>
              <ul className="link-group__list">
                <li>
                  <a
                    href="https://thepantry.ucdavis.edu/donate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <ShoppingBag size={16} />
                    <span>Item Donation List</span>
                    <ExternalLink size={14} className="resource-link__ext" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.google.com/forms/u/3/d/e/1FAIpQLSdtQMAAp63eq_2mC-qGADKopCWUD4H_b_cwirKYLcz7DDfSjA/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <Users size={16} />
                    <span>Volunteer at the Pantry</span>
                    <ExternalLink size={14} className="resource-link__ext" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="link-group">
              <h3 className="link-group__title">
                <BookOpen size={18} />
                Resources
              </h3>
              <ul className="link-group__list">
                <li>
                  <a
                    href="https://tinyurl.com/pantrywalk-in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <ClipboardList size={16} />
                    <span>Walk-In Menu</span>
                    <ExternalLink size={14} className="resource-link__ext" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://order.thepantry.ucdavis.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <ShoppingBag size={16} />
                    <span>Order Grab-n-Go Items</span>
                    <ExternalLink size={14} className="resource-link__ext" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.google.com/document/d/1y8c68m12DyACptbMXLj1FBDE77QcsKgL4ifxlkC90a4/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <FileText size={16} />
                    <span>The Pantry Living Doc</span>
                    <ExternalLink size={14} className="resource-link__ext" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Socials */}
            <div className="link-group">
              <h3 className="link-group__title">
                <Users size={18} />
                Connect With Us
              </h3>
              <ul className="link-group__list">
                <li>
                  <a
                    href="https://www.tiktok.com/@asucdpantry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <span className="resource-link__social-icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.77a8.18 8.18 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.2z" />
                      </svg>
                    </span>
                    <span>TikTok</span>
                    <ExternalLink size={14} className="resource-link__ext" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/channel/UC6HmZl3rBCG4DPs3-_208ow/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <span className="resource-link__social-icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.84.55 9.38.55 9.38.55s7.54 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
                      </svg>
                    </span>
                    <span>YouTube</span>
                    <ExternalLink size={14} className="resource-link__ext" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner" aria-label="Get started">
        <div className="section__inner">
          <div className="cta-banner__content">
            <h2 className="cta-banner__title">Ready to Cook?</h2>
            <p className="cta-banner__text">
              Scan your pantry ingredients and discover what you can make tonight.
            </p>
            <Link to="/detect" className="btn btn--primary btn--lg">
              <Camera size={20} />
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="footer__inner">
          <div className="footer__brand">
            <img
              src="/images/pantry-logo.png"
              alt="The Pantry logo"
              className="footer__logo"
            />
            <div>
              <p className="footer__name">The ASUCD Pantry</p>
              <p className="footer__tagline">
                Fueling Aggies since 2010
              </p>
            </div>
          </div>
          <p className="footer__copy">
            Built with care for UC Davis students.
          </p>
        </div>
      </footer>
    </div>
  )
}
