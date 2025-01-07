import React, { useEffect, useState } from "react";
import axios from "axios";  // Import axios to make API calls

const Profile = () => {

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    joinDate: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setProfileData(res.data);  // Set the fetched profile data
      } catch (err) {
        setError("Error fetching profile data");
        console.error(err);
      }
    };

    fetchProfileData();
  }, []);

  const calculateJoinDate = (joinDate) => {
    const joinDateObj = new Date(joinDate);
    const now = new Date();
    const diffTime = Math.abs(now - joinDateObj);
  
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30); 
    const diffYears = Math.floor(diffMonths / 12);
  
    if (diffYears >= 1) {
      return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
    } else if (diffMonths >= 1) {
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    } else if (diffDays >= 1) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours >= 1) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    }
  };
  
  if (error) {
    return <div>{error}</div>;
  }
  
  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-details">
        <div className="profile-info">
          <h2>Username: {profileData.username || "Unknown User"}</h2>
        </div>
        <div className="profile-info">
          <h3>Email: {profileData.email || "Not Provided"}</h3>
        </div>
        <div className="profile-info">
          <h3>
            Joined:{" "}
            {profileData.joinDate
              ? calculateJoinDate(profileData.joinDate)
              : "Not Available"}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Profile;



 
