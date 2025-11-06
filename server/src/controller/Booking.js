
// new code 

import Booking from "../models/Booking.js";
import Post from "../models/Post.js";
import Stripe from "stripe";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";


//  Initialize Stripe securely from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//  Search Bookings or Posts
export const searchBookings = async (req, res) => {
  try {
    const { keyword } = req.params;
    const words = keyword.split(" ");

    const results = await Post.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        {
          description: {
            $regex: words.join("|"),
            $options: "i",
          },
        },
      ],
    }).select("title hotelLocation images description");

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Error In Search Product API",
      error: error.message,
    });
  }
};

// Create Stripe Payment Intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, description, customerName, customerAddress } = req.body;

    // Validate required fields
    if (
      !amount ||
      !currency?.trim() ||
      !description?.trim() ||
      !customerName?.trim() ||
      !customerAddress ||
      !customerAddress.line1 ||
      !customerAddress.city ||
      !customerAddress.state ||
      !customerAddress.postalCode ||
      !customerAddress.country
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: amount, currency, description, customerName, and full customerAddress",
      });
    }

    // Convert amount to cents if not already
    const amountInCents = Math.round(amount * 100);

    // Create the Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      payment_method_types: ["card"],
      description: description.trim(),
      shipping: {
        name: customerName.trim(),
        address: {
          line1: customerAddress.line1.trim(),
          city: customerAddress.city.trim(),
          state: customerAddress.state.trim(),
          postal_code: customerAddress.postalCode.trim(),
          country: customerAddress.country.trim(),
        },
      },
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
};

//  Update Availability
export const updateAvailability = async (req, res) => {
  const { postId, isAvailable } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: "Invalid postId format." });
  }

  try {
    const post = await Post.findByIdAndUpdate(postId, { isAvailable }, { new: true });
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Create Booking
export const createBooking = async (req, res) => {
  try {
    const { token, postId, bookingDate, transactionId } = req.body;

    if (!token || !postId || !bookingDate || !transactionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: token, postId, bookingDate, transactionId.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    const userId = decoded.id;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const booking = new Booking({
      user: userId,
      post: postId,
      bookingDate,
      transactionId,
      paymentStatus: "paid",
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

//  Get All Bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user post", "name title");
    return res.status(200).json({
      success: true,
      message: "All Bookings List",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};
