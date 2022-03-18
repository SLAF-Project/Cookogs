import { useUserContext } from "../../context/UserContext";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axios from "axios";
import UserList from "../../components/UserList";
import styles from "./Profile.module.css";
import RecipeCard from "../../components/recipeCard";
import prisma from "../../lib/prisma.ts";
import Button from "../../components/Button";

const Profile = ({ recipes, lists }) => {
  const { user, setUser } = useUserContext();
  const token = Cookies.get("token");
  const router = useRouter();

  const recipesFromUser = user
    ? recipes.filter((element) => element.cookId === user.id)
    : null;
  const listsFromUser = user
    ? lists.filter((element) => element.userId === user.id)
    : null;

  console.log(listsFromUser);
  // delete user bloc
  const handleDeleteUser = () => {
    if (window.confirm("Es tu sûr de vouloir supprimer ton compte?")) {
      deleteUser();
    }
  };

  console.log(listsFromUser);

  async function deleteUser() {
    await axios.delete("/api/user/deleteUser", {
      headers: { Authorization: `Bearer ${token}` },
    });
    Cookies.remove("token");
    setUser(null);
    router.push("/");
  }

  return (
    <>
      <UserList user={user} handleDeleteUser={handleDeleteUser} />
      <div className={styles.selector}>
        <div className={styles.selectorBlock}>
          <p className={styles.selectorText}>MES CONTRIBUTIONS</p>
        </div>
        <div className={styles.container}>
          {recipesFromUser &&
            recipesFromUser.map((recipe, index) => (
              <div key={`recipe-${index}`}>
                <RecipeCard recipe={recipe} />
              </div>
            ))}
        </div>

        <div className={styles.selectorBlock}>
          <p className={styles.selectorText}>MES LISTES</p>
          {listsFromUser &&
            listsFromUser.map((list, index) => (
              <>
                <div key={index}>
                  <h3>Liste : {list.name}</h3>
                </div>
                {list.recipes &&
                  list.recipes.map((recipe, index) => (
                    <div key={`recipe-${index}`}>
                      <p>{recipe.name}</p>
                      <Button
                        label="En savoir plus !"
                        className="primary"
                        href={`/recipes/${recipe.id}`}
                      />
                    </div>
                  ))}
              </>
            ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  console.log(context);
  const allRecipes = await prisma.recipe.findMany({
    include: {
      _count: { select: { likes: true } },
    },
  });
  const allLists = await prisma.list.findMany({
    include: {
      recipes: true,
    },
  });
  return {
    props: {
      recipes: allRecipes,
      lists: allLists,
    },
  };
}

export default Profile;
