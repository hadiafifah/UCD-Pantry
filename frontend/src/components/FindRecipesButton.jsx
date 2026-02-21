import { Loader, Search } from 'lucide-react'
import './FindRecipesButton.css'

export default function FindRecipesButton({
  onClick,
  onJumpToRecipes,
  loading = false,
  disabled = false,
  className = '',
}) {
  const handleClick = () => {
    onJumpToRecipes?.()
    onClick?.()
  }

  return (
    <button
      type="button"
      className={`find-recipes-btn ${className}`.trim()}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <Loader size={18} className="find-recipes-btn__spinner" />
          Finding Recipes...
        </>
      ) : (
        <>
          <Search size={18} />
          Find Recipes
        </>
      )}
    </button>
  )
}
