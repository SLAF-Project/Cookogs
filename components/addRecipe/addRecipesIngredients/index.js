import React from "react";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import classes from "./AddRecipesIngredients.module.css";
import Button from "../../Button";
import { useNotifications } from "@mantine/notifications";

const AddRecipesIngredients = ({ recipe, ingredients, units }) => {
  const notifications = useNotifications();
  const formRef = useRef();
  const token = Cookies.get("token");
  const [submitted, setSubmitted] = useState(false);

  async function addRecipeIngredients(params) {
    const { addIngredient, addUnit, addQuantity } = formRef.current;
    const ingredient = addIngredient.value;
    const quantity = addQuantity.value;
    const unit = addUnit.value;
    if (!quantity || !unit || !ingredient) {
      notifications.showNotification({
        title: "Erreur dans votre formulaire !",
        message: "Un ou plusieurs éléments sont manquants",
        color: "red",
      });
    } else {
      await axios.put(
        "/api/recipe/editRecipe",
        {
          id: recipe.id,
          ingredientsUnit: {
            create: [
              {
                ingredientId: parseInt(ingredient),
                unitId: parseInt(unit),
                quantity: parseInt(quantity),
              },
            ],
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitted(true);
    }
  }

  return (
    <>
    <div className={classes.block}>
      <form ref={formRef} className="row">
        <div className="col-3">
          <label className={classes.label}>Quantité (chiffre)</label>
          <input className={classes.input} name="addQuantity" type="text" />
        </div>
        <div className="col-3">
          <label className={classes.label}>Unité</label>
          <select className={classes.select} name="addUnit">
            {units.map((unit) => (
              <option value={unit.id} key={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6">
          <label className={classes.label}>Ingrédient</label>
          <select className={classes.select} name="addIngredient">
            {ingredients.map((ingredient) => (
              <option value={ingredient.id} key={ingredient.id}>
                {ingredient.name}
              </option>
            ))}
          </select>
        </div>
      </form>
      <div className={classes.button}>
        {submitted ? (
          <p>Ajouté!</p>
        ) : (
          <Button
            label="Ajouter cet ingrédient"
            type="success"
            handleClick={() => addRecipeIngredients()}
            href="#"
          />
        )}
      </div>
    </div>
    </>
  );
};

export default AddRecipesIngredients;
