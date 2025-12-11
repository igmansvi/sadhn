import React, { useState } from "react";
import { Button } from "../ui/button";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribing email:", email);
  };

  return (
    <div className="relative px-12 pt-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Main Newsletter Section */}
        <div className="bg-gradient-to-br from-orange-100/60 via-white to-cyan-100/60 rounded-3xl p-12 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-3xl">📬</span>
                <h2 className="text-3xl font-bold text-gray-900">
                  Stay Updated With New Programs
                </h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Get alerts on upcoming courses, job fairs, and skill
                initiatives. Never miss an opportunity to upskill!
              </p>

              {/* Benefits List */}
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Weekly course updates and new program launches
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Exclusive job fair invitations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Career tips and success stories
                  </span>
                </li>
              </ul>
            </div>

            {/* Right - Subscription Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Join Our Learning Community
              </h3>
              <p className="text-gray-600 mb-6">
                Subscribe to receive weekly updates and career tips directly to
                your inbox.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Subscribe Now
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By subscribing, you agree to receive updates from Skill India.
                  Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-cyan-500 mb-2">
              50K+
            </div>
            <p className="text-gray-600 font-medium">Newsletter Subscribers</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-cyan-500 mb-2">
              Weekly
            </div>
            <p className="text-gray-600 font-medium">Updates & Tips</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-cyan-500 mb-2">
              100%
            </div>
            <p className="text-gray-600 font-medium">Free to Join</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
