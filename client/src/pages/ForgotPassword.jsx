import React, { useState } from 'react';

export default function ForgotPassword({ onBack }) {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Handle password reset logic here
    console.log('Password reset requested');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-[#e2e2e2] to-[#c9d6ff] p-5">
      <div className="relative w-[550px] h-auto bg-white rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden max-[650px]:w-full max-[650px]:h-auto">
        
        {/* Decorative Header */}
        <div className="w-full h-[120px] bg-[#7494ec] flex items-center justify-center relative">
          <div className="absolute -bottom-[50px] w-[100px] h-[100px] bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.1)]">
            <i className="bx bxs-lock-alt text-[48px] text-[#7494ec]"></i>
          </div>
        </div>

        {/* Reset Password Form */}
        <div className="p-10 pt-[70px] pb-10 max-[400px]:p-6 max-[400px]:pt-[70px]">
          <div className="text-center mb-8">
            <h1 className="text-[32px] text-[#333] mb-2 max-[400px]:text-[28px]">Reset Password</h1>
            <p className="text-[14px] text-[#666]">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative my-[25px]">
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                required
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full py-[13px] pr-[50px] pl-5 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
              />
              <i className="bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#333]"></i>
            </div>

            <div className="relative my-[25px]">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full py-[13px] pr-[50px] pl-5 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
              />
              <i className="bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#333]"></i>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#7494ec] rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)] border-none cursor-pointer text-base text-white font-semibold mt-[25px] hover:bg-[#6383db] transition-colors"
            >
              Send Reset Link
            </button>

            <div className="text-center mt-[25px]">
              <button
                type="button"
                onClick={onBack}
                className="text-[14.5px] text-[#7494ec] hover:underline bg-transparent border-none cursor-pointer"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Boxicons CDN */}
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      />
    </div>
  );
}
