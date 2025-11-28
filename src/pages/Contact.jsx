import React, { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    // Frontend validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus("Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending to API:", import.meta.env.VITE_BASE_URL);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/contact`,
        formData
      );

      setStatus(res.data.message);

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.log("Contact form error:", error);

      setStatus(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Banner Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-14 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-wide">
          Contact Us
        </h1>
        <p className="text-lg max-w-2xl mx-auto opacity-90 leading-relaxed">
          Have questions or need help with your booking? Reach out to us and we'll assist you promptly.
        </p>
      </div>

      {/* Contact Section */}
      <div className="flex flex-col md:flex-row my-16 px-6 md:px-20 gap-12">

        {/* Contact Info */}
        <div className="md:w-1/2 bg-gray-50 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-4">
            We are here to help you with your hotel bookings, travel plans, and any questions you may have.
          </p>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Email</h3>
            <p className="text-gray-600">support@mydreamplace.com</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Phone</h3>
            <p className="text-gray-600">+91 98765 43210</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Address</h3>
            <p className="text-gray-600">123 Dream Street, Travel City, India</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:w-1/2 bg-gray-50 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h2>

          {status && (
            <p
              className={`text-center font-semibold mb-4 ${
                status.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {status}
            </p>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="5"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="my-16 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Find Us Here</h2>
        <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
          <iframe
            title="My Dream Place Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019849618108!2d144.95565131550448!3d-37.81732787975154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5776e5d6b3b0c!2sFederation%20Square%2C%20Melbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2sin!4v1699851529572!5m2!1sen!2sin"
            width="100%"
            height="100%"
            className="border-0"
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <div className="mt-auto"></div>
    </div>
  );
};

export default Contact;
