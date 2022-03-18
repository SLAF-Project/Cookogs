import { useState } from "react/cjs/react.development";
import axios from "axios";
import { CheckboxGroup, Checkbox } from "@mantine/core";
import Cookies from "js-cookie";

const AddRecipesTags = ({ recipe, tags }) => {
  const [value, setValue] = useState([]);
  const token = Cookies.get("token");

  async function addTagsToRecipe(data) {
    await axios.put(
      "/api/recipe/editRecipe",
      {
        id: recipe.id,
        tags: {
          connect: data,
        },
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  const handleClick = () => {
    const newValue = [];
    value.map((element) => newValue.push({ id: parseInt(element) }));
    addTagsToRecipe(newValue);
  };

  return (
    <>
      <CheckboxGroup
        value={value}
        onChange={setValue}
        color="cyan"
        label="Tags"
        description="Choisis un ou plusieurs Tags pour identifier ta recette"
        required
      >
        {tags
          ? tags.map((tag) => <Checkbox value={tag.id} label={tag.name} />)
          : null}
      </CheckboxGroup>
      <button onClick={handleClick}>Valider mon choix</button>
    </>
  );
};

export default AddRecipesTags;
