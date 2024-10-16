import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        email: email,
      });
      setResult(response.data.prediction);
      setLoading(false);
    } catch (err) {
      setError("Error making request. Please check your API.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-xl w-full border border-gray-200">
        <h1 className="text-5xl mb-6 font-extrabold text-gray-900 text-center">
          Spam Detector
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Paste the content of an email and check whether it’s spam or not.
        </p>

        {/* Form to input email content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-lg font-semibold text-gray-700 mb-2"
              htmlFor="email"
            >
              Email Content:
            </label>
            <textarea
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-lg transition duration-200"
              rows="6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Paste your email content here..."
              required
            ></textarea>
          </div>

          <div className="flex items-center justify-center">
            <button
              className={`bg-indigo-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-transform transform ${
                loading ? "hover:scale-100" : "hover:scale-105"
              } duration-200 ease-in-out ${
                loading
                  ? "cursor-not-allowed opacity-60"
                  : "hover:bg-indigo-700"
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Checking..." : "Check for Spam"}
            </button>
          </div>
        </form>

        {/* Show loading, result, or error */}
        {loading && (
          <p className="mt-6 text-center text-indigo-500 font-medium text-lg animate-pulse">
            Analyzing email content...
          </p>
        )}
        {result && (
          <div
            className={`mt-6 text-xl font-bold text-center py-4 px-6 rounded-lg shadow-md transition-all duration-300 ${
              result === "spam"
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            {result === "spam"
              ? "🚨 This email is SPAM!"
              : "✅ This email is NOT SPAM."}
          </div>
        )}
        {error && (
          <p className="mt-6 text-center text-red-500 font-semibold text-lg">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
