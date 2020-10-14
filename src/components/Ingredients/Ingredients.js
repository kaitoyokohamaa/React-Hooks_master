import React, { useReducer, useEffect, useCallback, useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there!");
  }
};
const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);

  // const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  // useEffect(() => {
  //   fetch("https://react-hooks-update-676a6.firebaseio.com/ingredients.json")
  //     .then((response) => response.json())
  //     .then((responseData) => {
  //       const loadedIngredients = [];
  //       for (const key in responseData) {
  //         loadedIngredients.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount,
  //         });
  //       }
  //      dispatch({type:"SET",ingredient:loadedIngredients})
  //     });
  // }, []);

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    /*  setUserIngredients(filterIngredients); */
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  console.log({ userIngredients });
  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch("https://react-hooks-update-676a6.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        setIsLoading(false);
        return response.json();
      })
      .then((responseData) => {
        /*  setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient },
        ]); */
        dispatch({
          type: "ADD",
          ingredient: { id: responseData.name, ...ingredient },
        });
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-update-676a6.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        setIsLoading(false);
        /*  setUserIngredients((prevIngredients) =>
          prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        ); */
        dispatch({ type: "DELETE", id: ingredientId });
      })
      .catch((err) => {
        setErr("something err");
      });
  };
  const clear = () => {
    setErr(null);
    setIsLoading(false);
  };
  return (
    <div className="App">
      {err && <ErrorModal onClose={clear}>{err}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadingIngredient={filterIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
