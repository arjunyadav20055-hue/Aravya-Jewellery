import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <p className="p-6 text-gray-700">Please login to view your profile.</p>;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#fffafb] min-h-screen">
      {/* Profile Card */}
      <motion.div
        className="bg-white border border-[#fdecef] shadow-lg rounded-xl p-6 flex flex-col md:flex-row items-center gap-6"
        whileHover={{ scale: 1.02 }}
      >
        {/* Avatar */}
        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-pink-200">
          <img
            src={`https://ui-avatars.com/api/?name=${user.name}&background=f9c5d1&color=fff&size=128`}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-600 mt-1">{user.email}</p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <Link
          to="/my-orders"
          className="flex-1 text-center border border-[#fdecef] px-4 py-3 rounded-lg bg-white text-gray-900 font-medium hover:bg-[#fdecef] transition"
        >
          My Orders
        </Link>

        <button
          onClick={handleLogout}
          className="flex-1 text-center bg-pink-400 text-white px-4 py-3 rounded-lg font-medium hover:bg-pink-500 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
