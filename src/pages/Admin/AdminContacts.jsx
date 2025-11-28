import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/contact/get`
        );
        setMessages(res.data.data || []);
      } catch (err) {
        setError("Failed to load messages");
        console.log("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    // ⭐ Only this changed → full height & flex
    <div className="min-h-screen flex ml-16 mt-8 stretch">

      {/* ⭐ Wrap navbar to stretch full height */}
      <div className="h-full">
        <Navbar />
      </div>

      <div className="flex-1 p-5">
        <h1 className="text-3xl flex justify-center font-bold mb-6">
          Contact Messages
        </h1>

        <div className="bg-white shadow-lg rounded-lg p-5 overflow-x-auto">
          {loading && (
            <p className="text-center py-4 text-lg font-medium">Loading...</p>
          )}

          {error && (
            <p className="text-center text-red-500 py-3 font-medium">
              {error}
            </p>
          )}

          {!loading && !error && (
            <table className="w-full border text-sm md:text-base">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Subject</th>
                  <th className="p-3 border">Message</th>
                  <th className="p-3 border">Date</th>
                </tr>
              </thead>

              <tbody>
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <tr key={msg._id} className="border hover:bg-gray-100">
                      <td className="p-3 border">{msg.name}</td>
                      <td className="p-3 border">{msg.email}</td>
                      <td className="p-3 border">{msg.subject}</td>
                      <td className="p-3 border">{msg.message}</td>
                      <td className="p-3 border">
                        {new Date(msg.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4">
                      No messages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;
