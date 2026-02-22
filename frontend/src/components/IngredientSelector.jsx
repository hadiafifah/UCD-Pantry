import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import FindRecipesButton from './FindRecipesButton.jsx'
import './IngredientSelector.css'

// Client-provided pantry ingredients
const PANTRY_ITEMS = [
  'Barilla Ready Pasta Elbows',
  'Iceberg Salad',
  'Eggs',
  'Green Onions',
  'Basil',
  'Sweet Corn',
  'Canned Tuna',
  'Tomatoes',
  'Cilantro',
  'Cucumber',
  'Lemon',
  'Lime',
  'Bread',
  'Beans',
  'Pasta Noodles',
  'Spinach',
  'Oregano',
  'Bell Pepper',
  'Arugula',
  'Canned Chickpea',
  'Garlic Powder',
  'Onion Powder',
  'Smoked Paprika',
  'Salt',
  'Pepper',
  'Ginger',
  'Hot Pepper',
  'Broccoli',
  'Rice',
  'Green Beans',
  'Chicken Broth',
  'Bokchoy',
  'Poblano Peppers',
  'Leeks',
  'Turnips',
  'Garlic',
  'Parsely',
  'Daikon',
  'Persimmons',
  'Avocado',
  'Eggplants',
  'Scallion',
  'Mushroom',
  'Pomegranate',
  'Pear',
  'Red Pepper',
  'Radish',
  'Jalapenos',
  'Potatoes',
  'Celery',
  'Carrot',
  'Butternut Squash',
  'Sweet Potato',
  'Black Beans',
  'Cumin',
  'Vegetable Stock',
]

export default function IngredientSelector({
  selectedIngredients,
  onAddIngredient,
  onRemoveIngredient,
  onFindRecipes,
  loading,
}) {
  const [manualInput, setManualInput] = useState('')
  const selectedSet = new Set(selectedIngredients.map((item) => item.trim().toLowerCase()))

  const filteredItems = PANTRY_ITEMS.filter(
    (item) => !selectedSet.has(item.toLowerCase())
  )

  const handleManualAdd = (e) => {
    e.preventDefault()
    const trimmed = manualInput.trim()
    if (trimmed && !selectedSet.has(trimmed.toLowerCase())) {
      onAddIngredient(trimmed)
      setManualInput('')
    }
  }

  return (
    <div className="ingredient-selector">
      <div className="ingredient-selector__header">
        <h2 className="ingredient-selector__title">Add Ingredients</h2>
        <p className="ingredient-selector__hint">
          Select from Pantry items or type your own
        </p>
      </div>

      {/* Manual entry */}
      <form className="ingredient-selector__manual" onSubmit={handleManualAdd}>
        <div className="ingredient-selector__input-wrap">
          <Plus size={16} className="ingredient-selector__input-icon" />
          <input
            type="text"
            className="ingredient-selector__input"
            placeholder="Type an ingredient..."
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            aria-label="Add a custom ingredient"
          />
        </div>
        <button type="submit" className="ingredient-selector__add-btn" disabled={!manualInput.trim()}>
          Add
        </button>
      </form>

      {/* Pantry item buttons */}
      <div className="ingredient-selector__grid" role="group" aria-label="Available pantry items">
        {filteredItems.map((item) => (
          <button
            key={item}
            className="ingredient-selector__item"
            onClick={() => onAddIngredient(item)}
            aria-label={`Add ${item}`}
          >
            <Plus size={14} />
            {item}
          </button>
        ))}
        {filteredItems.length === 0 && (
          <p className="ingredient-selector__no-results">
            All listed pantry items are already selected.
          </p>
        )}
      </div>

      <div className="ingredient-selector__selected" aria-label="Added ingredients">
        <p className="ingredient-selector__selected-label">
          Added Ingredients ({selectedIngredients.length})
        </p>
        {selectedIngredients.length > 0 ? (
          <ul className="ingredient-selector__selected-list">
            {selectedIngredients.map((item) => (
              <li key={item} className="ingredient-selector__selected-item">
                <span>{item}</span>
                <button
                  type="button"
                  className="ingredient-selector__selected-remove"
                  onClick={() => onRemoveIngredient(item)}
                  aria-label={`Remove ${item}`}
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="ingredient-selector__selected-empty">
            No ingredients added yet.
          </p>
        )}
      </div>

      <FindRecipesButton
        className="ingredient-selector__find-btn"
        onClick={onFindRecipes}
        loading={loading}
        disabled={selectedIngredients.length === 0}
      />
    </div>
  )
}
