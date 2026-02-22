import { Link } from 'react-router-dom'
import { ChefHat, ArrowRight } from 'lucide-react'
import { ingredientMatches } from '../data/recipes.js'
import './RecipeSidebar.css'

export default function RecipeSidebar({
  recipes,
  loading,
  userIngredients,
  hasSearched,
}) {
  return (
    <aside className="recipe-sidebar" aria-label="Recipe suggestions">
      <div className="recipe-sidebar__header">
        <h2 className="recipe-sidebar__title">
          <ChefHat size={20} />
          Recipe Suggestions
        </h2>
      </div>

      <div className="recipe-sidebar__list">
        {recipes.map((recipe) => {
          const recipeIngredients = recipe.ingredients
          const previewIngredients = recipeIngredients.slice(0, 5)
          const hiddenCount = Math.max(recipeIngredients.length - previewIngredients.length, 0)
          const matchedCount = recipeIngredients.filter((ing) =>
            userIngredients.some(
              (ui) => ingredientMatches(ui, ing)
            )
          ).length

          return (
            <article key={recipe.id} className="recipe-card">
              <div className="recipe-card__top">
                <h3 className="recipe-card__title">{recipe.title}</h3>
                <div className="recipe-card__meta">
                  <span className="recipe-card__match">
                    {matchedCount}/{recipeIngredients.length} ingredients
                  </span>
                </div>
              </div>

              <ul className="recipe-card__ingredients">
                {previewIngredients.map((ing, index) => {
                  const hasIt = userIngredients.some(
                    (ui) => ingredientMatches(ui, ing)
                  )
                  return (
                    <li
                      key={`${ing}-${index}`}
                      className={`recipe-card__ingredient ${hasIt ? 'recipe-card__ingredient--have' : ''}`}
                    >
                      <span
                        className="recipe-card__check"
                        aria-hidden="true"
                      >
                        {hasIt ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <span className="recipe-card__check-empty" />
                        )}
                      </span>
                      <span className={hasIt ? '' : 'recipe-card__ingredient-missing'}>
                        {ing}
                      </span>
                    </li>
                  )
                })}
                {hiddenCount > 0 && (
                  <li className="recipe-card__ingredient recipe-card__ingredient--more">
                    +{hiddenCount} more ingredients
                  </li>
                )}
              </ul>

              <Link
                to={`/recipe/${recipe.id}`}
                state={{ selectedIngredients: userIngredients }}
                className="recipe-card__link"
              >
                View Full Recipe
                <ArrowRight size={14} />
              </Link>
            </article>
          )
        })}

        {hasSearched && recipes.length === 0 && !loading && (
          <div className="recipe-sidebar__empty">
            <ChefHat size={32} />
            <p>No recipes found for these ingredients. Try adding more items.</p>
          </div>
        )}
      </div>
    </aside>
  )
}
