import React, { useState, useEffect } from 'react';
import RecipeList from './RecipeList';
import '../css/app.css';
import { v4 as uuidv4 } from 'uuid';
import RecipeEdit from './RecipeEdit';

export const RecipeContext = React.createContext();
const LOCAL_STORAGE_KEY = 'cookingWithReact.recipes'

function App() {
  const [selectedRecipeID, setSelectedRecipeID] = useState();
  const [recipes, setRecipes] = useState(sampleRecipes);
  const selectedRecipe = recipes.find(recipe => recipe.id === selectedRecipeID)

  // get data from local storage once, on load
  useEffect(() => {
    const recipeJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (recipeJSON != null) setRecipes(JSON.parse(recipeJSON))
  }, [])

  // set local storage each time recipes is updated
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recipes))
  }, [recipes])

  const recipeContextValue = {
    // syntax reminder: a var written once is the same as handleRecipeAdd: handleRecipeAdd;
    handleRecipeAdd,
    handleRecipeDelete,
    handleRecipeSelect,
    handleRecipeChange
  }

  function handleRecipeSelect(id) {
    setSelectedRecipeID(id)
  }

  function handleRecipeAdd(){
    // generic placeholder data
    const newRecipe = {
      id: uuidv4(),
      name: '',
      servings: 1,
      cookTime: '',
      instructions: '',
      ingredients: [
        { id: uuidv4(), 
          name:'', 
          amount: ''
        }
      ]
    }

    setSelectedRecipeID(newRecipe.id)
    /* update the state with of all the existing recipes
    and the new recipe added to the end of the array */
    setRecipes([...recipes, newRecipe])
  }

  function handleRecipeChange(id, recipe){
    const newRecipes = [...recipes]
    const index = newRecipes.findIndex(r => r.id === id)
    newRecipes[index] = recipe
    setRecipes(newRecipes)
  }

  function handleRecipeDelete(id){
    if(selectedRecipeID != null && selectedRecipeID === id){
      setSelectedRecipeID(undefined)
    }
    //filter out only the recipe matching the passed 'id'
    setRecipes(recipes.filter(r => r.id !== id))
  }

  return (
    <RecipeContext.Provider value={recipeContextValue}>
      <RecipeList 
        recipes={recipes}
      />
      {selectedRecipe && <RecipeEdit recipe={selectedRecipe}/>}
    </RecipeContext.Provider>
  )
}

const sampleRecipes = [
  {
    id: 1,
    name: 'Plain Chicken',
    servings: 3,
    cookTime: '1:45',
    instructions:  "1. Put salt on Chicken\n2. Put chicken in oven\n3. Eat the chicken",
    ingredients: [
      {
        id: 1,
        name: 'Chicken',
        amount: '2 Pounds'
      },
      {
        id: 2,
        name: 'Salt',
        amount: '1 Tbs'
      }
    ]
  },
  {
    id: 2,
    name: 'Plain Pork',
    servings: 5,
    cookTime: '0:45',
    instructions:  "1. Put paprika on Chicken\n2. Put chicken in oven\n3. Eat the chicken",
    ingredients: [
      {
        id: 1,
        name: 'Pork',
        amount: '3 Pounds'
      },
      {
        id: 2,
        name: 'Paprika',
        amount: '2 Tbs'
      }
    ]
  },
]

export default App;

/* 
additional ideas:
  - search bar
  - fullsize window when no single recipe has focus
  - recipe authors
*/