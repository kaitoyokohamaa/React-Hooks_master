import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";
const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => {
    fetch("https://react-hooks-update-676a6.firebaseio.com/ingredients.json")
      .then((response) => response.json())
      .then((responseData) => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount,
          });
        }
        setUserIngredients(loadedIngredients);
      });
  }, []);

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  const filterIngredientsHandler = useCallback(
    (filterIngredients) => {
      setUserIngredients(filterIngredients);
      console.log({ filterIngredients });
    },
    [setUserIngredients]
  );

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
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-update-676a6.firebaseio.com/ingredients/${ingredientId}.jon`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        setIsLoading(false);
        setUserIngredients((prevIngredients) =>
          prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        );
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
