import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import apis from "../../../services/api-service";
import authHeader from "../../../services/auth-header";

const UsersList = () => {
  const { data, loading, error, reFetch } = useFetch(apis.admin + "users");
  const [message, setMessage] = useState("");

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (loading) {
    return <div className="loading-indicator">Loading...</div>;
  }

  if (!Array.isArray(data)) {
    return <div>No users to display.</div>;
  }
  const handleDelete = async (user) => {
    const id = user.id;
    const url = apis.admin + "user";
    try {
      const res = await axios.delete(url, {
        params: { user_id: id },
        headers: authHeader(),
        withCredentials: true,
      });
      // Check if the delete was successful
      if (res.status === 200) {
        reFetch();
        setMessage("User deleted successfully.");
      } else {
        setMessage("An error occurred while deleting the user.");
      }
    } catch (err) {
      setMessage("An error occurred while deleting the user.");
    }
  };

  return (
    <div>
      {message && <p>{message}</p>}

      <Link
        to={`/admin/editadduser/${encodeURIComponent(
          JSON.stringify({
            username: "",
            avatar: "",
            email: "",
            mobile: "",
            password: "",
            roles: [],
            organisation: "",
          })
        )}`}
      >
        <button>Add</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>UserName</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Organisation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td>
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  style={{ width: "50px", height: "50px" }}
                />
                {user.username}
              </td>
              <td>{user.email}</td>
              <td>
                {user.roles.map((role) => (
                  <p>{role}, </p>
                ))}
              </td>
              <td>{user.organisation}</td>
              <td>
                <Link
                  to={`/admin/editadduser/${encodeURIComponent(
                    JSON.stringify(user)
                  )}`}
                >
                  <button>Edit</button>
                </Link>
                <button onClick={() => handleDelete(user)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
