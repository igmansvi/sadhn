import React, { useState } from "react";
import Skills from "../components/profileForm/Skills.jsx";
import Certification from "../components/profileForm/Certification.jsx";
import Education from "../components/profileForm/Education.jsx";
import Experience from "../components/profileForm/Experience.jsx";
import Profile from "../components/profileForm/Profile.jsx";
import CompanyDetails from "../components/profileForm/CompanyDetails.jsx";

const ProfileForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { name: "Profile", component: Profile, icon: "bxs-user" },
    { name: "Company", component: CompanyDetails, icon: "bxs-buildings" },
    { name: "Education", component: Education, icon: "bxs-graduation" },
    { name: "Experience", component: Experience, icon: "bxs-briefcase" },
    { name: "Skills", component: Skills, icon: "bxs-brain" },
    {
      name: "Certifications",
      component: Certification,
      icon: "bxs-badge-check",
    },
  ];

  const CurrentComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (index) => {
    setCurrentStep(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-[36px] text-[#333] font-bold mb-2 max-[400px]:text-[28px]">
              Complete Your Profile
            </h1>
            <p className="text-[14px] text-[#666]">
              Fill in your details to get started on your journey
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 bg-white/50 rounded-full px-2 pb-5 backdrop-blur-sm">
            <div
              className="h-2 bg-[#7494ec] rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>

          {/* Stepper */}
          <div className="flex justify-between items-center relative max-[768px]:flex-wrap max-[768px]:gap-3">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 w-full h-[3px] bg-[#eee] -z-10 max-[768px]:hidden">
              <div
                className="h-full bg-[#7494ec] transition-all duration-500 ease-in-out"
                style={{
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
              ></div>
            </div>

            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => handleStepClick(index)}
                className="flex flex-col items-center cursor-pointer group flex-1 max-[768px]:flex-initial"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index <= currentStep
                      ? "bg-[#7494ec] text-white shadow-[0_0_15px_rgba(116,148,236,0.4)]"
                      : "bg-[#eee] text-[#888]"
                  } group-hover:scale-110`}
                >
                  <i className={`bx ${step.icon} text-xl`}></i>
                </div>
                <span
                  className={`text-[12px] mt-2 font-medium transition-colors max-[768px]:text-[10px] ${
                    index <= currentStep ? "text-[#7494ec]" : "text-[#888]"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content Card */}
        <div className="bg-white rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden">
          <div className="p-8 max-[400px]:p-4">
            <CurrentComponent />
          </div>

          {/* Navigation Buttons */}
          <div className="border-t border-[#eee] p-6 flex justify-between items-center bg-[#f9f9f9]">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 0
                  ? "bg-[#eee] text-[#999] cursor-not-allowed"
                  : "bg-white border-2 border-[#7494ec] text-[#7494ec] hover:bg-[#7494ec] hover:text-white shadow-[0_0_10px_rgba(0,0,0,0.1)]"
              }`}
            >
              <i className="bx bx-chevron-left text-xl align-middle"></i>
              Previous
            </button>

            <div className="text-[#666] text-sm font-medium">
              Step {currentStep + 1} of {steps.length}
            </div>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-[#7494ec] text-white rounded-lg font-semibold hover:bg-[#6383db] transition-all shadow-[0_0_10px_rgba(0,0,0,0.1)]"
              >
                Next
                <i className="bx bx-chevron-right text-xl align-middle"></i>
              </button>
            ) : (
              <button
                onClick={() => console.log("Form submitted!")}
                className="px-6 py-3 bg-[#7494ec] text-white rounded-lg font-semibold hover:bg-[#6383db] transition-all shadow-[0_0_10px_rgba(0,0,0,0.1)]"
              >
                Submit Profile
                <i className="bx bx-check text-xl align-middle ml-1"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Boxicons CDN */}
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      />
    </div>
  );
};

export default ProfileForm;
