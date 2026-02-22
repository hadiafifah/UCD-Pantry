import { useParams, Link, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  ChefHat,
  CheckCircle,
  Circle,
} from 'lucide-react'
import { getRecipeById, ingredientMatches } from '../data/recipes.js'
import './RecipePage.css'

export default function RecipePage() {
  const { id } = useParams()
  const location = useLocation()
  const recipe = getRecipeById(id)
  const selectedIngredients = Array.isArray(location.state?.selectedIngredients)
    ? location.state.selectedIngredients
    : []

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
              Back to PicAPlate
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const pantryIngredients = recipe.pantryIngredients?.length
    ? recipe.pantryIngredients
    : []
  const morePantryIngredients = pantryIngredients.filter(
    (pantryItem) => !selectedIngredients.some((ui) => ingredientMatches(ui, pantryItem))
  )

  return (
    <div className="recipe-page">
      <div className="recipe-page__inner">
        {/* Back link */}
        <Link to="/detect" className="recipe-page__back-link">
          <ArrowLeft size={16} />
          Back to PicAPlate
        </Link>

        {/* Title */}
        <header className="recipe-page__header">
          <h1 className="recipe-page__title">{recipe.title}</h1>
        </header>

        {morePantryIngredients.length > 0 && (
          <section className="recipe-page__pantry-tip" aria-labelledby="pantry-tip-heading">
            <h2 id="pantry-tip-heading" className="recipe-page__pantry-tip-title">
              More ingredients you can get at the pantry
            </h2>
            <ul className="recipe-page__pantry-tip-list">
              {morePantryIngredients.map((ing, index) => (
                <li key={`${ing}-${index}`} className="recipe-page__pantry-tip-item">
                  <Circle size={14} className="recipe-page__pantry-tip-icon" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Content: Ingredients + Instructions side by side */}
        <div className="recipe-page__content">
          {/* Full Ingredients */}
          <section className="recipe-page__ingredients" aria-labelledby="ingredients-heading">
            <h2 id="ingredients-heading" className="recipe-page__section-title">
              Ingredients
            </h2>
            <ul className="recipe-page__ingredient-list">
              {recipe.ingredients.map((ing) => (
                <li key={ing} className="recipe-page__ingredient-item">
                  {selectedIngredients.some((ui) => ingredientMatches(ui, ing)) ? (
                    <CheckCircle size={16} className="recipe-page__ingredient-icon recipe-page__ingredient-icon--checked" />
                  ) : (
                    <Circle size={16} className="recipe-page__ingredient-icon" />
                  )}
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Preparation */}
          <section className="recipe-page__instructions" aria-labelledby="instructions-heading">
            <h2 id="instructions-heading" className="recipe-page__section-title">
              Preparation
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
