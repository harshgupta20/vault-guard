import { useState } from "react";

const USER_API_BASE_URL = "http://localhost:3000";

export const useUserAPI = () => {
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userError, setUserError] = useState(null);

  // Create a new user
  const createUser = async (publicAddress) => {
    if (!publicAddress) {
      throw new Error("Public address is required");
    }

    setIsCreatingUser(true);
    setUserError(null);

    try {
      const response = await fetch(`${USER_API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // If user already exists, that's not an error for our use case
        if (response.status === 409) {
          console.log("User already exists:", publicAddress);
          return {
            success: true,
            data: { publicAddress },
            message: "User already exists",
          };
        }

        throw new Error(errorData.error || "Failed to create user");
      }

      const data = await response.json();
      console.log("User created successfully:", data);
      return { success: true, data, message: "User created successfully" };
    } catch (err) {
      console.error("Error creating user:", err);
      setUserError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsCreatingUser(false);
    }
  };

  return {
    createUser,
    isCreatingUser,
    userError,
  };
};
