import { useState, useCallback, useRef } from 'react'
import WebcamView from '../components/WebcamView.jsx'
import IngredientSelector from '../components/IngredientSelector.jsx'
import RecipeSidebar from '../components/RecipeSidebar.jsx'
import { findRecipesByIngredients } from '../data/recipes.js'
import './DetectionPage.css'

export default function DetectionPage() {
  const recipeSuggestionsRef = useRef(null)
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

  const handleJumpToRecipes = useCallback(() => {
    const target = recipeSuggestionsRef.current
    if (!target) return

    const top = target.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({
      top: Math.max(top, 0),
      behavior: 'smooth',
    })
  }, [])

  const handleFindRecipesFromSelector = useCallback(async () => {
    handleJumpToRecipes()
    await handleFindRecipes()
    requestAnimationFrame(() => {
      handleJumpToRecipes()
    })
  }, [handleFindRecipes, handleJumpToRecipes])

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
        {/* Left column: Webcam + Recipe Sidebar */}
        <div className="detection-page__left">
          <WebcamView
            detectedIngredients={ingredients}
            onRemoveIngredient={removeIngredient}
          />
          <div ref={recipeSuggestionsRef} className="detection-page__recipe-suggestions">
            <RecipeSidebar
              recipes={recipes}
              loading={loading}
              userIngredients={ingredients}
              onRemoveIngredient={removeIngredient}
              onFindRecipes={handleFindRecipes}
              hasSearched={hasSearched}
            />
          </div>
        </div>

        {/* Right column: Ingredient Selector */}
        <div className="detection-page__right">
          <IngredientSelector
            selectedIngredients={ingredients}
            onAddIngredient={addIngredient}
            onFindRecipes={handleFindRecipesFromSelector}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
