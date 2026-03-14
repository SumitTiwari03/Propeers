import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart, FaExternalLinkAlt, FaUser } from "react-icons/fa";

const baseUrl = import.meta.env.VITE_URL;

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/projects/favorites`, {
        withCredentials: true,
      });
      const safeFavorites = (Array.isArray(response.data) ? response.data : []).map((project) => ({
        ...project,
        title: project?.title || "Untitled Project",
        description: project?.description || "",
        imgUrl: project?.imgUrl || "",
        projectUrl: project?.projectUrl || "#",
        techStack: Array.isArray(project?.techStack) ? project.techStack : [],
        createdByUsername: project?.createdByUsername || project?.createdBy?.username || "Unknown",
      }));
      setFavorites(safeFavorites);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Please login to view your favorite projects.");
      } else {
        setError("Unable to load favorite projects right now.");
      }
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const toggleFavorite = async (projectId) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/projects/${projectId}/favorite`,
        {},
        { withCredentials: true },
      );

      if (response.data && response.data.isFavorite === false) {
        setFavorites((prev) => prev.filter((project) => project._id !== projectId));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold dark:text-white">My Favorite Projects</h2>
          <Link
            to="/projects"
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
          >
            Browse Projects
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!error && favorites.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-10 text-center">
            <FaRegHeart className="mx-auto text-4xl text-gray-400 mb-3" />
            <h3 className="text-xl font-semibold dark:text-white mb-2">No favorites yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Click the heart icon on any project to save it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((project) => (
              <div key={project._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
                <img
                  src={project.imgUrl || "https://via.placeholder.com/400x200"}
                  alt={project.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold dark:text-white mb-2 line-clamp-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">{project.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                    <FaUser className="mr-2" /> {project.createdByUsername}
                  </p>

                  <div className="mt-auto flex gap-2">
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm flex items-center justify-center"
                    >
                      <FaExternalLinkAlt className="mr-2" /> Visit
                    </a>
                    <button
                      onClick={() => toggleFavorite(project._id)}
                      className="border-2 border-red-500 px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-gray-700"
                      title="Remove from favorites"
                    >
                      <FaHeart className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
