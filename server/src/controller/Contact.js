import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const savedContact = await new Contact({
      name,
      email,
      subject,
      message,
    }).save();

    // Send admin email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Message: ${subject}`,
      text: `Message from ${name} (${email}):\n\n${message}`,
    };

    transporter.sendMail(mailOptions).catch((err) => {
      console.log("Email Error:", err.message);
    });

    return res.status(201).json({
      message: "Your message has been sent successfully.",
      data: savedContact,
    });
  } catch (error) {
    console.log("Contact Error:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "All contact messages fetched successfully",
      data: contacts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};
