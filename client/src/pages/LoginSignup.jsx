import React, { useState } from 'react';

export default function LoginSignup({ onForgotPassword }) {
  const [isActive, setIsActive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-[#e2e2e2] to-[#c9d6ff] p-5">
      <div className={`relative w-[850px] h-[550px] bg-white rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-1800 ease-in-out max-[650px]:h-[calc(100vh-40px)] ${isActive ? 'active' : ''}`}>
        
        {/* Login Form */}
        <div className={`absolute right-0 w-1/2 h-full bg-white flex items-center text-center p-10 z-10 transition-all duration-600 ease-in-out delay-1200 max-[650px]:bottom-0 max-[650px]:w-full max-[650px]:h-[70%] max-[400px]:p-5 ${isActive ? 'right-1/2 max-[650px]:right-0 max-[650px]:bottom-[30%]' : ''}`}>
          <div className="w-full">
            <h1 className="text-[36px] text-[#333] -mt-2.5 mb-0 max-[400px]:text-[30px]">Login</h1>
            
            <div className="relative my-[30px]">
              <input
                type="text"
                placeholder="Username"
                required
                className="w-full py-[13px] pr-[50px] pl-5 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
              />
              <i className="bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#333]"></i>
            </div>

            <div className="relative my-[30px]">
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full py-[13px] pr-[50px] pl-5 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
              />
              <i className="bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#333]"></i>
            </div>

            <div className="-mt-[15px] mb-[15px]">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  onForgotPassword();
                }}
                className="text-[14.5px] text-[#333] hover:text-[#7494ec]"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full h-12 bg-[#7494ec] rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)] border-none cursor-pointer text-base text-white font-semibold"
            >
              Login
            </button>

            
          </div>
        </div>

        {/* Register Form */}
        <div className={`absolute right-0 w-1/2 h-full bg-white flex items-center text-center p-10 z-10 transition-all duration-600 ease-in-out delay-1200 max-[650px]:bottom-0 max-[650px]:w-full max-[650px]:h-[70%] max-[400px]:p-5 ${isActive ? 'right-1/2 visible max-[650px]:right-0 max-[650px]:bottom-[30%]' : 'invisible'}`}>
          <div className="w-full">
            <h1 className="text-[36px] text-[#333] -mt-2.5 mb-0 max-[400px]:text-[30px]">Registration</h1>
            
            <div className="relative my-[30px]">
              <input
                type="text"
                placeholder="Username"
                required
                className="w-full py-[13px] pr-[50px] pl-5 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
              />
              <i className="bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#333]"></i>
            </div>

            <div className="relative my-[30px]">
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full py-[13px] pr-[50px] pl-5 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
              />
              <i className="bx bxs-envelope absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#333]"></i>
            </div>

            <div className="relative my-[30px]">
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full py-[13px] pr-[50px] pl-5 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
              />
              <i className="bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#333]"></i>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full h-12 bg-[#7494ec] rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)] border-none cursor-pointer text-base text-white font-semibold"
            >
              Register
            </button>

          </div>
        </div>

        {/* Toggle Box */}
        <div className="absolute w-full h-full">
          {/* Animated Background */}
          <div className={`absolute -left-[250%] w-[300%] h-full bg-[#7494ec] rounded-[150px] z-20 transition-all duration-1800 ease-in-out max-[650px]:left-0 max-[650px]:-top-[270%] max-[650px]:w-full max-[650px]:h-[300%] max-[650px]:rounded-[20vw] ${isActive ? 'left-1/2 max-[650px]:left-0 max-[650px]:top-[70%]' : ''}`}></div>

          {/* Toggle Left Panel */}
          <div className={`absolute left-0 w-1/2 h-full text-white flex flex-col justify-center items-center z-20 transition-all duration-600 ease-in-out delay-1200 max-[650px]:w-full max-[650px]:h-[30%] max-[650px]:top-0 ${isActive ? '-left-1/2 delay-600 opacity-0 max-[650px]:left-0 max-[650px]:-top-[30%]' : 'opacity-100'}`}>
            <h1 className="text-[36px] text-white -mt-2.5 mb-0 max-[400px]:text-[30px]">Hello, Welcome!</h1>
            <p className="text-[14.5px] text-white my-[15px] mb-5">Don't have an account?</p>
            <button
              onClick={() => setIsActive(true)}
              className="w-40 h-[46px] bg-transparent border-2 border-white rounded-lg shadow-none cursor-pointer text-base text-white font-semibold"
            >
              Register
            </button>
          </div>

          {/* Toggle Right Panel */}
          <div className={`absolute -right-1/2 w-1/2 h-full text-white flex flex-col justify-center items-center z-20 transition-all duration-600 ease-in-out delay-600 max-[650px]:w-full max-[650px]:h-[30%] max-[650px]:right-0 max-[650px]:-bottom-[30%] ${isActive ? 'right-0 delay-1200 opacity-100 max-[650px]:bottom-0' : 'opacity-0'}`}>
            <h1 className="text-[36px] text-white -mt-2.5 mb-0 max-[400px]:text-[30px]">Welcome Back!</h1>
            <p className="text-[14.5px] text-white my-[15px] mb-5">Already have an account?</p>
            <button
              onClick={() => setIsActive(false)}
              className="w-40 h-[46px] bg-transparent border-2 border-white rounded-lg shadow-none cursor-pointer text-base text-white font-semibold"
            >
              Login
            </button>
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
}