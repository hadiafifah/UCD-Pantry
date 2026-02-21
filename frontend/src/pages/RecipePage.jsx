import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  CheckCircle,
  Circle,
} from 'lucide-react'
import { getRecipeById } from '../data/recipes.js'
import './RecipePage.css'

export default function RecipePage() {
  const { id } = useParams()
  const recipe = getRecipeById(id)

  if (!recipe) {
    return (
      <div className="recipe-page">
        <div className="recipe-page__inner">
          <div className="recipe-page__not-found">
            <ChefHat size={48} />
            <h1>Recipe Not Found</h1>
            <p>
              We couldn&apos;t find the recipe you&apos;re looking for.
            </p>
            <Link to="/detect" className="recipe-page__back-btn">
              <ArrowLeft size={16} />
              Back to Ingredient Helper
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalTime = recipe.prepTime + recipe.cookTime
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${recipe.youtubeId}`

  return (
    <div className="recipe-page">
      <div className="recipe-page__inner">
        {/* Back link */}
        <Link to="/detect" className="recipe-page__back-link">
          <ArrowLeft size={16} />
          Back to Ingredient Helper
        </Link>

        {/* Title + Meta */}
        <header className="recipe-page__header">
          <div className="recipe-page__tags">
            {recipe.tags.map((tag) => (
              <span key={tag} className="recipe-page__tag">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="recipe-page__title">{recipe.title}</h1>
          <div className="recipe-page__meta">
            <div className="recipe-page__meta-item">
              <Clock size={18} />
              <div>
                <span className="recipe-page__meta-label">Total Time</span>
                <span className="recipe-page__meta-value">{totalTime} min</span>
              </div>
            </div>
            <div className="recipe-page__meta-item">
              <Clock size={18} />
              <div>
                <span className="recipe-page__meta-label">Prep</span>
                <span className="recipe-page__meta-value">{recipe.prepTime} min</span>
              </div>
            </div>
            <div className="recipe-page__meta-item">
              <ChefHat size={18} />
              <div>
                <span className="recipe-page__meta-label">Cook</span>
                <span className="recipe-page__meta-value">{recipe.cookTime} min</span>
              </div>
            </div>
            <div className="recipe-page__meta-item">
              <Users size={18} />
              <div>
                <span className="recipe-page__meta-label">Servings</span>
                <span className="recipe-page__meta-value">{recipe.servings}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Video */}
        <section className="recipe-page__video" aria-label="Recipe video">
          <iframe
            src={youtubeEmbedUrl}
            title={`Video guide for ${recipe.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="recipe-page__iframe"
          />
        </section>

        {/* Content: Ingredients + Instructions side by side */}
        <div className="recipe-page__content">
          {/* Ingredients */}
          <section className="recipe-page__ingredients" aria-labelledby="ingredients-heading">
            <h2 id="ingredients-heading" className="recipe-page__section-title">
              Ingredients
            </h2>
            <ul className="recipe-page__ingredient-list">
              {recipe.ingredients.map((ing) => (
                <li key={ing} className="recipe-page__ingredient-item">
                  <Circle size={16} className="recipe-page__ingredient-icon" />
                  {ing}
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section className="recipe-page__instructions" aria-labelledby="instructions-heading">
            <h2 id="instructions-heading" className="recipe-page__section-title">
              Instructions
            </h2>
            <ol className="recipe-page__step-list">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="recipe-page__step">
                  <div className="recipe-page__step-number">
                    {i + 1}
                  </div>
                  <p className="recipe-page__step-text">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="recipe-page__footer-cta">
          <CheckCircle size={20} />
          <span>Made this recipe? Give us feedback!</span>
          <a
            href="https://forms.gle/2NjabF5QZTwcEbQc6"
            target="_blank"
            rel="noopener noreferrer"
            className="recipe-page__feedback-btn"
          >
            Share Feedback
          </a>
        </div>
      </div>
    </div>
  )
}
