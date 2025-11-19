import React from "react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Banner Section */}
      <div className="bg-gradient-to-r from-blue-300 to-blue-400 p-14 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-wide">
          About My Dream Place
        </h1>
        <p className="text-lg max-w-2xl mx-auto opacity-90 leading-relaxed">
          Discover and book the world's best hotels, experiences, and trips easily.
          My Dream Place is your companion for hassle-free travel planning.
        </p>
      </div>

      {/* Mission Section */}
      <div className="flex flex-col md:flex-row items-center justify-center my-16 px-6 md:px-20 gap-12">
        <div className="md:w-1/2 transform hover:scale-105 transition duration-300">
          <img
            src="https://img.freepik.com/premium-photo/laptop-displaying-flight-search-website-office-table-travel-planning_895561-40931.jpg"
            alt="Our Mission"
            className="rounded-xl shadow-xl"
          />
        </div>

        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Our mission is to make hotel booking simple, fast, and enjoyable.
            Find the best hotels, compare prices, and reserve your stay in just a few clicks.
            We aim to make every journey unforgettable by providing seamless travel solutions.
          </p>
        </div>
      </div>

      {/* Vision Section */}
      <div className="bg-gray-50 py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Our Vision
        </h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
          We envision a world where travelers can explore new destinations confidently.
          By combining cutting-edge technology with excellent customer service, 
          we aim to make every hotel stay comfortable, convenient, and memorable.
        </p>
      </div>

      {/* Team Section */}
      <div className="my-16 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Meet Our Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Team Member */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <img
              src="/team1.jpg"
              alt="Team Member"
              className="w-28 h-28 rounded-full mx-auto mb-4 shadow"
            />
            <h3 className="font-semibold text-gray-800 text-lg">
              Manish Verma
            </h3>
            <p className="text-gray-500 text-sm">Founder & CEO</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <img
              src="/team2.jpg"
              alt="Team Member"
              className="w-28 h-28 rounded-full mx-auto mb-4 shadow"
            />
            <h3 className="font-semibold text-gray-800 text-lg">Priya Sharma</h3>
            <p className="text-gray-500 text-sm">Booking Manager</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <img
              src="/team3.jpg"
              alt="Team Member"
              className="w-28 h-28 rounded-full mx-auto mb-4 shadow"
            />
            <h3 className="font-semibold text-gray-800 text-lg">Rahul Singh</h3>
            <p className="text-gray-500 text-sm">Travel Concierge</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <img
              src="/team4.jpg"
              alt="Team Member"
              className="w-28 h-28 rounded-full mx-auto mb-4 shadow"
            />
            <h3 className="font-semibold text-gray-800 text-lg">Sneha Tiwari</h3>
            <p className="text-gray-500 text-sm">Customer Support</p>
          </div>
        </div>
      </div>

      <div className="mt-auto"></div>
    </div>
  );
};

export default About;
