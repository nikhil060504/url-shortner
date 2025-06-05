import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserUrls, deleteUrl } from "../api/urlShortener";
import { getErrorMessage } from "../utils/errorHandler";

const DashboardPage = ({ user }) => {
  const [copied, setCopied] = useState("");
  const queryClient = useQueryClient();

  // Fetch user's URLs
  const {
    data: urls = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getUserUrls,
    enabled: !!user, // Only fetch if user is logged in
    retry: 2,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Delete URL mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUrl,
    onSuccess: () => {
      queryClient.invalidateQueries(["userUrls"]);
    },
    onError: (error) => {
      console.error("Error deleting URL:", getErrorMessage(error));
    },
  });

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(""), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = (urlId) => {
    if (window.confirm("Are you sure you want to delete this URL?")) {
      deleteMutation.mutate(urlId);
    }
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Dashboard
          </h2>
          <p className="text-xl text-gray-600">Manage your shortened URLs</p>
          {user && (
            <p className="text-sm text-gray-500 mt-2">
              Welcome back, {user.user?.name || user.name || "User"}!
            </p>
          )}
        </div>

        {/* URLs List */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Your Shortened URLs
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => queryClient.invalidateQueries(["userUrls"])}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your URLs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-red-800 mb-2">
                  Unable to Load URL History
                </h4>
                <p className="text-red-700 mb-4">
                  Error: {getErrorMessage(error)}
                </p>
                <button
                  onClick={() => queryClient.invalidateQueries(["userUrls"])}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : urls.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                You haven't created any short URLs yet.
              </p>
              <p className="text-sm text-gray-500">
                Go to the Home page to create your first short URL!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {urls.map((urlData) => (
                <div
                  key={urlData.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {urlData.originalUrl}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        {urlData.shortUrl}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created:{" "}
                        {new Date(urlData.createdAt).toLocaleDateString()}
                        {urlData.clicks !== undefined && (
                          <span className="ml-4">Clicks: {urlData.clicks}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleCopy(urlData.shortUrl)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        {copied === urlData.shortUrl ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => handleDelete(urlData.id)}
                        disabled={deleteMutation.isPending}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        {deleteMutation.isPending ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
