import React from "react";
import { ShieldCheck, Phone, Info, FileWarning } from "lucide-react";
import "./App.css";

function App() {
  return (
    <div className="w-full font-sans bg-gray-50 text-gray-800 overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50 backdrop-blur-sm bg-opacity-95">
        <div className="w-full mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          
          {/* LOGO + NAME */}
          <div className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity cursor-pointer min-w-0">
            <img
              src="/assets/logo.png"
              alt="logo"
              className="w-10 sm:w-14 h-10 sm:h-14 object-contain transform hover:scale-110 transition-transform duration-300"
            />
            <h1 className="text-lg sm:text-2xl font-bold text-blue-900 truncate">
              Dengue Shield
            </h1>
          </div>

          {/* NAV LINKS */}
          <ul className="hidden md:flex gap-4 lg:gap-8 text-sm lg:text-lg font-medium">
            <li className="text-gray-700 hover:text-cyan-500 cursor-pointer transition-colors duration-300 relative group">
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </li>
            <li className="text-gray-700 hover:text-cyan-500 cursor-pointer transition-colors duration-300 relative group">
              Report Portal
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </li>
            <li className="text-gray-700 hover:text-cyan-500 cursor-pointer transition-colors duration-300 relative group">
              Contact Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </li>
          </ul>

          {/* LOGIN BUTTON */}
          <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold text-sm sm:text-base whitespace-nowrap">
            Login
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-24 sm:pt-36 pb-12 sm:pb-20 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        <div className="w-full mx-auto px-4 sm:px-6 grid md:grid-cols-2 items-center gap-6 sm:gap-10 relative z-10">
          
          {/* LEFT TEXT */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4 sm:mb-6 animate-fade-in">
              AI-Based Dengue Outbreak Risk Prediction & Monitoring
            </h1>

            <p className="text-base sm:text-lg text-gray-100 mb-6 sm:mb-8 leading-relaxed animate-fade-in animation-delay-100">
              A smart platform for Sri Lanka that helps identify dengue risk
              zones, monitor outbreaks, and provide early warnings using AI and
              environmental data.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
              <button className="bg-white text-blue-900 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-gray-100 hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base">
                Explore Portal
              </button>

              <button className="border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-white hover:text-blue-900 transform hover:scale-105 transition-all duration-300 hover:shadow-xl text-sm sm:text-base">
                Learn More
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center mt-6 sm:mt-0">
            <img
              src="/assets/logo.png"
              alt="Dengue Shield Logo"
              className="w-40 sm:w-[320px] drop-shadow-2xl animate-pulse hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="w-full mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4 sm:mb-6 animate-fade-in">
            About Us
          </h2>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-600 leading-8 animate-fade-in animation-delay-100">
            Our system is designed to support public health authorities and
            communities by predicting dengue outbreak risks using artificial
            intelligence and environmental monitoring data. The platform helps
            users stay informed and take preventive action early.
          </p>

          {/* CARDS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-14">
            
            <div className="group bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 hover:border-cyan-200">
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 flex justify-center">
                <ShieldCheck className="text-cyan-500 w-12 sm:w-14 h-12 sm:h-14" />
              </div>
              <h3 className="text-lg sm:text-2xl font-semibold text-blue-900 mb-3">Risk Prediction</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Predict high-risk dengue outbreak zones using AI models.
              </p>
            </div>

            <div className="group bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 hover:border-cyan-200">
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 flex justify-center">
                <FileWarning className="text-cyan-500 w-12 sm:w-14 h-12 sm:h-14" />
              </div>
              <h3 className="text-lg sm:text-2xl font-semibold text-blue-900 mb-3">
                Smart Monitoring
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Real-time monitoring and outbreak reporting system.
              </p>
            </div>

            <div className="group bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 hover:border-cyan-200 sm:col-span-2 lg:col-span-1">
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 flex justify-center">
                <Info className="text-cyan-500 w-12 sm:w-14 h-12 sm:h-14" />
              </div>
              <h3 className="text-lg sm:text-2xl font-semibold text-blue-900 mb-3">
                Public Awareness
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Educating communities with prevention tips and alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REPORT PORTAL SECTION */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 relative overflow-hidden">
        <div className="w-full mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4 sm:mb-6 animate-fade-in">
            Report Portal
          </h2>

          <p className="text-base sm:text-lg text-gray-700 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Report mosquito breeding areas and suspected dengue cases directly
            through the platform.
          </p>

          <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300">
            Submit Report
          </button>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="w-full mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-3 sm:mb-4 animate-fade-in">
              Contact Us
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Feel free to contact us for support and inquiries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-10">
            
            {/* CONTACT INFO */}
            <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-blue-900 mb-6">
                Get In Touch
              </h3>

              <div className="space-y-4 sm:space-y-6 text-base sm:text-lg">
                <div className="flex items-center gap-3 sm:gap-4 text-gray-700 hover:text-cyan-600 transition-colors">
                  <div className="bg-cyan-100 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                    <Phone className="text-cyan-600 w-5 sm:w-6 h-5 sm:h-6" />
                  </div>
                  <span className="font-medium text-sm sm:text-base">+94 77 123 4567</span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 text-gray-700 hover:text-cyan-600 transition-colors">
                  <div className="bg-cyan-100 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                    <span className="text-lg sm:text-xl">📧</span>
                  </div>
                  <span className="font-medium text-sm sm:text-base">support@dengueshield.lk</span>
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4 text-gray-700 hover:text-cyan-600 transition-colors">
                  <div className="bg-cyan-100 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                    <span className="text-lg sm:text-xl">📍</span>
                  </div>
                  <span className="font-medium text-sm sm:text-base">Colombo, Sri Lanka</span>
                </div>
              </div>
            </div>

            {/* CONTACT FORM */}
            <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <form className="space-y-4 sm:space-y-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 sm:p-4 rounded-lg border border-gray-300 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all duration-300 placeholder-gray-400 text-sm sm:text-base"
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 sm:p-4 rounded-lg border border-gray-300 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all duration-300 placeholder-gray-400 text-sm sm:text-base"
                />

                <textarea
                  rows={5}
                  placeholder="Your Message"
                  className="w-full p-3 sm:p-4 rounded-lg border border-gray-300 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all duration-300 placeholder-gray-400 resize-none text-sm sm:text-base"
                ></textarea>

                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 sm:py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-blue-950 to-blue-900 text-white py-8 sm:py-10 border-t border-blue-800">
        <div className="w-full mx-auto px-4 sm:px-6 flex flex-col items-center gap-4 sm:gap-6">
          
          <div className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <img
              src="/assets/logo.png"
              alt="logo"
              className="w-10 sm:w-12 h-10 sm:h-12 object-contain"
            />
            <h2 className="text-lg sm:text-xl font-semibold">
              Dengue Shield
            </h2>
          </div>

          <p className="text-gray-300 text-center text-xs sm:text-sm md:text-base">
            © 2026 Dengue Shield Sri Lanka. All Rights Reserved.
          </p>

          <div className="flex gap-3 sm:gap-4">
            <a href="#" className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-800 hover:bg-cyan-500 transition-colors duration-300 flex items-center justify-center text-xs sm:text-sm">
              f
            </a>
            <a href="#" className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-800 hover:bg-cyan-500 transition-colors duration-300 flex items-center justify-center text-xs sm:text-sm">
              t
            </a>
            <a href="#" className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-800 hover:bg-cyan-500 transition-colors duration-300 flex items-center justify-center text-xs sm:text-sm">
              in
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;