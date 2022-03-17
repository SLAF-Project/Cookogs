import { useUserContext } from "../../context/UserContext";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axios from "axios";
import EditUser from "../../components/EditUser";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user, setUser } = useUserContext();
  const token = Cookies.get("token");
  const router = useRouter();
  const [form, setForm] = useState(false);

  const handleUpdateUser = () => {
    setForm(!form);
  };

  // delete user bloc
  const handleDeleteUser = () => {
    if (window.confirm("Es tu sûr de vouloir supprimer ton compte?")) {
      deleteUser();
    }
  };

  async function deleteUser() {
    const result = await axios.delete("/api/user/deleteUser", {
      headers: { Authorization: `Bearer ${token}` },
    });
    Cookies.remove("token");
    setUser(null);
    router.push("/");
  }

  return (
    <>
      <div className={styles.top + " row"}>
        <div className="col-3">
          <div className={styles.avatar}>
            <span className={styles.letter}>{user?.name[0].toUpperCase()}</span>
          </div>
        </div>
        <div className="col-9">
          <div>
            <p className={styles.name}>{user?.name}</p>
            <p className={styles.email}>{user?.email}</p>
          </div>
          <div>
            {" "}
            {!form && (
              <button onClick={() => handleUpdateUser()}>
                Editer mon profil
              </button>
            )}
            {form && (
              <EditUser user={user} handleUpdateUser={handleUpdateUser} />
            )}
            <button onClick={() => handleDeleteUser()}>
              <a>Supprimer mon compte</a>
            </button>
          </div>
        </div>
      </div>
      {user?.recipes.map((recipe) => (
        <>
          <h2>{recipe.name}</h2>
          <p>{recipe.description}</p>
        </>
      ))}
    </>
  );
};

export default Profile;
