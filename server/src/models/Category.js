import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    index: true,
  },
});

export default mongoose.model("Category", categorySchema);
