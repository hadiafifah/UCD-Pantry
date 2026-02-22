import { Link } from 'react-router-dom'
import {
  ChefHat,
  Camera,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero" aria-label="Welcome to PicAPlate">
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
              Launch PicAPlate
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
