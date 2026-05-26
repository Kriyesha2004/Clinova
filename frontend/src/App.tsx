//import React from "react";
import { ShieldCheck, Phone, Info, FileWarning } from "lucide-react";
import logo from "./assets/logo.png";
import "./App.css";

function App() {
  return (
    <div className="w-full font-sans bg-slate-950 text-white overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-slate-900 shadow-2xl z-50 backdrop-blur-md bg-opacity-98">
        <div className="w-full mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          
          {/* LOGO + NAME */}
          <div className="flex items-center gap-2 sm:gap-3 hover:opacity-85 transition-all duration-300 cursor-pointer min-w-0 group">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-2 rounded-lg group-hover:shadow-lg transition-all duration-300">
              <img 
                src={logo} 
                alt="Clinova Logo" 
                className="w-8 sm:w-10 h-8 sm:h-10 object-contain filter brightness-0 invert" 
              />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent truncate">
              Clinova Sri Lanka
            </h1>
          </div>

          {/* NAV LINKS */}
          <ul className="hidden md:flex gap-6 lg:gap-8 text-sm lg:text-base font-medium">
            <li className="text-gray-700 hover:text-cyan-600 cursor-pointer transition-colors duration-300 relative group">
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </li>
            <li className="text-gray-700 hover:text-cyan-600 cursor-pointer transition-colors duration-300 relative group">
              Report Portal
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </li>
            <li className="text-gray-700 hover:text-cyan-600 cursor-pointer transition-colors duration-300 relative group">
              Contact Us
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </li>
          </ul>

          {/* LOGIN BUTTON */}
          <button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-4 sm:px-7 py-2.5 sm:py-3 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 font-semibold text-xs sm:text-base whitespace-nowrap">
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
              <button className="bg-slate-900 text-blue-900 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-gray-100 hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base">
                Explore Portal
              </button>

              <button className="border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-slate-900 hover:text-blue-900 transform hover:scale-105 transition-all duration-300 hover:shadow-xl text-sm sm:text-base">
                Learn More
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center mt-8 sm:mt-0 p-4 sm:p-0">
            <div className="bg-slate-900 bg-opacity-10 backdrop-blur-lg p-8 sm:p-12 rounded-2xl border border-white border-opacity-20 hover:border-opacity-40 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20">
              <img 
                src={logo} 
                alt="Clinova Logo" 
                className="w-32 sm:w-64 md:w-80 h-32 sm:h-64 md:h-80 object-contain drop-shadow-2xl animate-pulse hover:scale-110 transition-transform duration-500 filter brightness-125" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="w-full mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4 sm:mb-6 animate-fade-in">
            About Us
          </h2>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-8 animate-fade-in animation-delay-100">
            Our system is designed to support public health authorities and
            communities by predicting dengue outbreak risks using artificial
            intelligence and environmental monitoring data. The platform helps
            users stay informed and take preventive action early.
          </p>

          {/* CARDS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-14">
            
            <div className="group bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border border-gray-100 hover:border-cyan-300 hover:bg-gradient-to-br hover:from-slate-900 hover:to-cyan-50">
              <div className="mb-6 transform group-hover:scale-125 transition-transform duration-300 flex justify-center">
                <div className="bg-gradient-to-br from-cyan-100 to-blue-100 p-4 rounded-xl">
                  <ShieldCheck className="text-cyan-600 w-8 sm:w-10 h-8 sm:h-10" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-3">Risk Prediction</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Predict high-risk dengue outbreak zones using advanced AI models and real-time data.
              </p>
            </div>

            <div className="group bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border border-gray-100 hover:border-cyan-300 hover:bg-gradient-to-br hover:from-slate-900 hover:to-cyan-50">
              <div className="mb-6 transform group-hover:scale-125 transition-transform duration-300 flex justify-center">
                <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-4 rounded-xl">
                  <FileWarning className="text-orange-600 w-8 sm:w-10 h-8 sm:h-10" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-3">
                Smart Monitoring
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Real-time monitoring and instant outbreak reporting system for rapid response.
              </p>
            </div>

            <div className="group bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border border-gray-100 hover:border-cyan-300 hover:bg-gradient-to-br hover:from-slate-900 hover:to-cyan-50 sm:col-span-2 lg:col-span-1">
              <div className="mb-6 transform group-hover:scale-125 transition-transform duration-300 flex justify-center">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-xl">
                  <Info className="text-blue-600 w-8 sm:w-10 h-8 sm:h-10" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-3">
                Public Awareness
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Educating communities with prevention tips, alerts, and health guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REPORT PORTAL SECTION */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="w-full mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-6 sm:mb-8 animate-fade-in">
            Report Dengue Cases & Breeding Sites
          </h2>

          <p className="text-base sm:text-lg text-gray-700 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Help us combat dengue by reporting mosquito breeding areas and suspected dengue cases directly through our secure platform. Your reports help save lives.
          </p>

          <button className="bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:from-cyan-600 hover:via-blue-600 hover:to-blue-700 text-white px-10 sm:px-14 py-4 sm:py-5 rounded-full text-base sm:text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 inline-block">
            📝 Submit Report Now
          </button>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="w-full mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 to-cyan-600 bg-clip-text text-transparent mb-4 sm:mb-6 animate-fade-in">
              Get In Touch With Us
            </h2>
            <p className="text-gray-700 text-base sm:text-lg font-medium">
              Have questions or need support? We're here to help you fight dengue.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto">
            
            {/* CONTACT INFO */}
            <div className="bg-slate-900 p-8 sm:p-12 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-cyan-200 transition-all duration-300 hover:-translate-y-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-8">
                📞 Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="bg-gradient-to-br from-cyan-100 to-blue-100 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Phone className="text-cyan-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Phone</p>
                    <p className="text-slate-300 text-sm sm:text-base">+94 77 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Email</p>
                    <p className="text-slate-300 text-sm sm:text-base">support@dengueshield.lk</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="bg-gradient-to-br from-red-100 to-pink-100 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Location</p>
                    <p className="text-slate-300 text-sm sm:text-base">Colombo, Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTACT FORM */}
            <div className="bg-slate-900 p-8 sm:p-12 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-cyan-200 transition-all duration-300 hover:-translate-y-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-8">
                ✉️ Send us a Message
              </h3>
              <form className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-3 sm:p-4 rounded-lg border-2 border-gray-200 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all duration-300 placeholder-gray-400 font-medium text-sm sm:text-base"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full p-3 sm:p-4 rounded-lg border-2 border-gray-200 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all duration-300 placeholder-gray-400 font-medium text-sm sm:text-base"
                  />
                </div>

                <div>
                  <textarea
                    rows={5}
                    placeholder="Your Message"
                    className="w-full p-3 sm:p-4 rounded-lg border-2 border-gray-200 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all duration-300 placeholder-gray-400 resize-none font-medium text-sm sm:text-base"
                  ></textarea>
                </div>

                <button className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:from-cyan-600 hover:via-blue-600 hover:to-blue-700 text-white px-6 py-3 sm:py-4 rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                  Send Message ➜
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-900 text-white py-12 sm:py-16 border-t-4 border-cyan-500">
        <div className="w-full mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center gap-6 sm:gap-8">
            
            <div className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer group">
              <div className="bg-slate-900 bg-opacity-10 p-2.5 rounded-lg group-hover:bg-opacity-20 transition-all duration-300">
                <img 
                src={logo} 
                alt="Clinova  Logo" 
                className="w-14 h-14 object-contain object-contain drop-shadow-2xl animate-pulse hover:scale-110 transition-transform duration-500 filter brightness-125" 
              />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Clinova Sri Lanka
              </h2>
            </div>

            <p className="text-gray-200 text-center text-xs sm:text-sm max-w-2xl leading-relaxed">
              Protecting Sri Lanka from dengue through AI-powered prediction, real-time monitoring, and community awareness.
            </p>

            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-slate-900 bg-opacity-10 hover:bg-cyan-500 transition-all duration-300 flex items-center justify-center font-semibold text-lg hover:scale-110 transform">
                f
              </a>
              <a href="#" className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-slate-900 bg-opacity-10 hover:bg-cyan-500 transition-all duration-300 flex items-center justify-center font-semibold text-lg hover:scale-110 transform">
                𝕏
              </a>
              <a href="#" className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-slate-900 bg-opacity-10 hover:bg-cyan-500 transition-all duration-300 flex items-center justify-center font-semibold text-lg hover:scale-110 transform">
                in
              </a>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>

            <p className="text-gray-300 text-center text-xs sm:text-sm">
              © 2026 Clinova Sri Lanka. All Rights Reserved. | Built with ❤️ for public health
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;