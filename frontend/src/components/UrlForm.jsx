import React, { useState } from "react";
import { shortenUrl, isValidUrl } from "../api/urlShortener";
import { useMutation } from "@tanstack/react-query";
const UrlShortener = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setCopied(false);

    // Validate URL
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (include http:// or https://)");
      return;
    }

    // Use mutation to shorten URL
    mutation.mutate(url);
  };

  // Using TanStack Query mutation for URL shortening
  const mutation = useMutation({
    mutationFn: shortenUrl,
    onSuccess: (data) => {
      setShortUrl(data);
      setError("");
    },
    onError: (error) => {
      setError("Failed to shorten URL. Please try again.");
      console.error("Error shortening URL:", error);
    },
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleReset = () => {
    setUrl("");
    setShortUrl("");
    setError("");
    setCopied(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          URL Shortener
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter your long URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              disabled={mutation.isPending}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {mutation.isPending ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {shortUrl && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              Your shortened URL:
            </h3>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={shortUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-white border border-green-300 rounded-lg text-green-700 font-mono"
              />
              <button
                onClick={handleCopy}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Shorten another URL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;
