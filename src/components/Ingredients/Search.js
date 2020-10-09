import React, { useState, useEffect, useRef } from "react";
import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const [enterdFilter, setEnterdFilter] = useState("");
  const { onLoadingIngredient } = props;
  const ref = useRef();
  console.log({ enterdFilter });
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enterdFilter === ref.current.value) {
        const query =
          enterdFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enterdFilter}"`;
        fetch(
          "https://react-hooks-update-676a6.firebaseio.com/ingredients.json" +
            query
        )
          .then((response) => response.json())
          .then((responseData) => {
            console.log({ responseData });
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              });
            }
            console.log({ loadedIngredients });
            onLoadingIngredient(loadedIngredients);
            /* setUserIngredients(loadedIngredients); */
          });
      }
      return () => {
        clearTimeout(timer);
      };
    }, 500);
  }, [enterdFilter, onLoadingIngredient, ref]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={ref}
            type="text"
            value={enterdFilter}
            onChange={(e) => setEnterdFilter(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
