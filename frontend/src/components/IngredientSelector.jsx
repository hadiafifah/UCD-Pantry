import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import './IngredientSelector.css'

// Common pantry items available at the ASUCD Pantry
const PANTRY_ITEMS = [
  'Rice', 'Pasta', 'Canned Beans', 'Canned Tomatoes', 'Lentils',
  'Oats', 'Peanut Butter', 'Bread', 'Eggs', 'Milk',
  'Cheese', 'Butter', 'Onion', 'Garlic', 'Potatoes',
  'Carrots', 'Bell Pepper', 'Tomatoes', 'Spinach', 'Lettuce',
  'Chicken', 'Ground Beef', 'Tofu', 'Tortillas', 'Cereal',
  'Canned Tuna', 'Soy Sauce', 'Olive Oil', 'Salt', 'Pepper',
  'Flour', 'Sugar', 'Canned Corn', 'Frozen Vegetables', 'Ramen',
  'Bananas', 'Apples', 'Oranges', 'Yogurt', 'Granola Bars',
]

export default function IngredientSelector({ selectedIngredients, onAddIngredient }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [manualInput, setManualInput] = useState('')

  const filteredItems = PANTRY_ITEMS.filter(
    (item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedIngredients.includes(item)
  )

  const handleManualAdd = (e) => {
    e.preventDefault()
    const trimmed = manualInput.trim()
    if (trimmed && !selectedIngredients.includes(trimmed)) {
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

      {/* Search filter */}
      <div className="ingredient-selector__search">
        <Search size={16} className="ingredient-selector__search-icon" />
        <input
          type="text"
          className="ingredient-selector__search-input"
          placeholder="Search pantry items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search pantry items"
        />
      </div>

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
            No matching items. Use the field above to add a custom ingredient.
          </p>
        )}
      </div>
    </div>
  )
}
