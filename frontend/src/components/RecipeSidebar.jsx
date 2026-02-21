import { Link } from 'react-router-dom'
import { Clock, ChefHat, ArrowRight } from 'lucide-react'
import FindRecipesButton from './FindRecipesButton.jsx'
import './RecipeSidebar.css'

export default function RecipeSidebar({
  recipes,
  loading,
  userIngredients,
  onRemoveIngredient,
  onFindRecipes,
  hasSearched,
}) {
  return (
    <aside className="recipe-sidebar" aria-label="Recipe suggestions">
      <div className="recipe-sidebar__header">
        <h2 className="recipe-sidebar__title">
          <ChefHat size={20} />
          Recipe Suggestions
        </h2>
        <div className="recipe-sidebar__selected">
          <p className="recipe-sidebar__selected-label">Selected Ingredients</p>
          {userIngredients.length > 0 ? (
            <ul className="recipe-sidebar__selected-list" aria-label="Selected ingredients">
              {userIngredients.map((ingredient) => (
                <li key={ingredient} className="recipe-sidebar__selected-item">
                  <span>{ingredient}</span>
                  <button
                    type="button"
                    className="recipe-sidebar__selected-remove"
                    onClick={() => onRemoveIngredient?.(ingredient)}
                    aria-label={`Remove ${ingredient}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="recipe-sidebar__selected-empty">No ingredients selected yet.</p>
          )}
        </div>
      </div>

      <FindRecipesButton
        className="recipe-sidebar__find-btn"
        onClick={onFindRecipes}
        loading={loading}
        disabled={userIngredients.length === 0}
      />

      {userIngredients.length === 0 && !hasSearched && (
        <p className="recipe-sidebar__hint">
          Add some ingredients first, then click "Find Recipes" to see
          suggestions.
        </p>
      )}

      <div className="recipe-sidebar__list">
        {recipes.map((recipe) => {
          const matchedCount = recipe.ingredients.filter((ing) =>
            userIngredients.some(
              (ui) => ui.toLowerCase() === ing.toLowerCase()
            )
          ).length

          return (
            <article key={recipe.id} className="recipe-card">
              <div className="recipe-card__top">
                <h3 className="recipe-card__title">{recipe.title}</h3>
                <div className="recipe-card__meta">
                  <span className="recipe-card__time">
                    <Clock size={14} />
                    {recipe.prepTime + recipe.cookTime} min
                  </span>
                  <span className="recipe-card__match">
                    {matchedCount}/{recipe.ingredients.length} ingredients
                  </span>
                </div>
              </div>

              <ul className="recipe-card__ingredients">
                {recipe.ingredients.map((ing) => {
                  const hasIt = userIngredients.some(
                    (ui) => ui.toLowerCase() === ing.toLowerCase()
                  )
                  return (
                    <li
                      key={ing}
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
              </ul>

              <Link to={`/recipe/${recipe.id}`} className="recipe-card__link">
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
