import { useState, useCallback } from 'react'
import WebcamView from '../components/WebcamView.jsx'
import IngredientSelector from '../components/IngredientSelector.jsx'
import RecipeSidebar from '../components/RecipeSidebar.jsx'
import { findRecipesByIngredients } from '../data/recipes.js'
import './DetectionPage.css'

export default function DetectionPage() {
  const [ingredients, setIngredients] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const addIngredient = useCallback((item) => {
    setIngredients((prev) => {
      if (prev.some((i) => i.toLowerCase() === item.toLowerCase())) return prev
      return [...prev, item]
    })
  }, [])

  const removeIngredient = useCallback((item) => {
    setIngredients((prev) => prev.filter((i) => i !== item))
  }, [])

  const handleFindRecipes = useCallback(async () => {
    setLoading(true)
    setHasSearched(true)
    // Simulate a brief loading state (replace with real API call)
    await new Promise((resolve) => setTimeout(resolve, 600))
    const results = findRecipesByIngredients(ingredients)
    setRecipes(results)
    setLoading(false)
  }, [ingredients])

  return (
    <div className="detection-page">
      <div className="detection-page__header">
        <h1 className="detection-page__title">Ingredient Helper</h1>
        <p className="detection-page__subtitle">
          Scan ingredients with your webcam, add them manually, and discover
          recipes you can make right now.
        </p>
      </div>

      <div className="detection-page__layout">
        {/* Left column: Webcam + Ingredient Selector */}
        <div className="detection-page__left">
          <WebcamView
            detectedIngredients={ingredients}
            onRemoveIngredient={removeIngredient}
          />
          <IngredientSelector
            selectedIngredients={ingredients}
            onAddIngredient={addIngredient}
          />
        </div>

        {/* Right column: Recipe Sidebar */}
        <div className="detection-page__right">
          <RecipeSidebar
            recipes={recipes}
            loading={loading}
            userIngredients={ingredients}
            onFindRecipes={handleFindRecipes}
            hasSearched={hasSearched}
          />
        </div>
      </div>
    </div>
  )
}
