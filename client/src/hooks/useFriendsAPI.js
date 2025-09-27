import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:3000";

export const useFriendsAPI = (publicAddress) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch friends from API
  const fetchFriends = async (address) => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/friends/${address}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch friends");
      }

      const data = await response.json();

      if (data.success && data.data.friends) {
        // Transform API data to match frontend structure
        const transformedFriends = data.data.friends.map((friend) => ({
          id: friend.id,
          name: friend.name,
          email: friend.email,
          publicAddress: friend.publicAddress,
          walletAddress: friend.walletAddress,
          addedAt: friend.addedAt,
          avatarColor: generateAvatarColor(friend.name),
        }));

        setFriends(transformedFriends);
      } else {
        setFriends([]);
      }
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError(err.message);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a new friend
  const addFriend = async (friendData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/friends`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(friendData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add friend");
      }

      const data = await response.json();

      if (data.success && data.data) {
        const newFriend = {
          id: data.data.id,
          name: data.data.name,
          email: data.data.email,
          publicAddress: data.data.publicAddress,
          walletAddress: data.data.walletAddress,
          addedAt: data.data.createdAt,
          avatarColor: generateAvatarColor(data.data.name),
        };

        setFriends((prevFriends) => [...prevFriends, newFriend]);
        return { success: true, data: newFriend };
      }
    } catch (err) {
      console.error("Error adding friend:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Connect two users as friends
  const connectFriends = async (userPublicAddress, friendPublicAddress) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/friends/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPublicAddress,
          friendPublicAddress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to connect friends");
      }

      const data = await response.json();

      if (data.success) {
        // Refresh friends list after successful connection
        await fetchFriends(userPublicAddress);
        return { success: true, data: data.data };
      }
    } catch (err) {
      console.error("Error connecting friends:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Generate avatar color based on name
  const generateAvatarColor = (name) => {
    const colors = [
      "from-blue-400 to-purple-500",
      "from-green-400 to-blue-500",
      "from-pink-400 to-red-500",
      "from-yellow-400 to-orange-500",
      "from-purple-400 to-pink-500",
      "from-indigo-400 to-blue-500",
      "from-teal-400 to-green-500",
      "from-red-400 to-pink-500",
    ];

    const hash = name.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  // Auto-fetch friends when publicAddress changes
  useEffect(() => {
    if (publicAddress) {
      fetchFriends(publicAddress);
    }
  }, [publicAddress]);

  return {
    friends,
    loading,
    error,
    fetchFriends,
    addFriend,
    connectFriends,
    refetch: () => fetchFriends(publicAddress),
  };
};
