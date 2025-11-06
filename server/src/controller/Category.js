import categoryModel from "../models/Category.js";
import slugify from "slugify";
import Post from "../models/Post.js";
import redisClient  from '../config/redis.js';

export const createCategoryController = async (req, res) => {
    try{
      const {name} = req.body;

      // check if name is provided
      if(!name){
        return res.status(401).send({
          success:false,
          message:"Name is required"
        });
      }

      //check if category already exists in mongodb
      const existingCategory = await categoryModel.findOne({name: name.trim()});
      if(existingCategory){
        return res.status(200).send({
          success:false,
          message:"Category already exists"
        });
      }

     const category = await new categoryModel({name, slug:slugify(name)}).save();

     const cacheKey = 'all_categories';

     await redisClient.del(cacheKey); // Invalidate the cache

      res.status(201).send({
        success:true,
        message:"New Category Created",
        category,
      });

    }catch(error){
      res.status(500).send({
        success:false,
        message:"Error in Category",
        error,
      })
    }
};

//update category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    // check if name is provided
    if(!name?.trim()){
      return res.status(400).send({
        success:false,
        message:"Name is required"
      });
    }

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name : name.trim(), slug: slugify(name) },
      { new: true }
    );

    // Invalidate the cache
    const cacheKey = 'all_categories';
    await redisClient.del(cacheKey);

    res.status(200).send({
      success: true,
      messsage: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

// get all categories
export const categoryController = async (req, res) => {
  try {
    const cacheKey = 'all_categories';

    // Check if categories are in cache
    const cacheData = await redisClient.get(cacheKey);
    if(cacheData){
     return res.status(200).send({
      success:true,
      message:"All Categories List",
      category: JSON.parse(cacheData),
     })
    }

    // If not in cache, fetch from database
    const category = await categoryModel.find({});

    // Store the fetched categories in cache
    await redisClient.set(cacheKey, JSON.stringify(category));

    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// single category
export const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get SIngle Category SUccessfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
};

//delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    // Invalidate the cache
    if(!deletedCategory){
      return res.status(404).send({
        success:false,
        message:"Category not found"
      });
    }

    const cacheKey = 'all_categories';
    await redisClient.del(cacheKey);

    res.status(200).send({
      success: true,
      message: "Categry Deleted Successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while deleting category",
      error,
    });
  }
};

// get products by category
export const selectedCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });

    if(!category){
      return res.status(404).send({  
        success:false,
        message:"Category not found"
      })
    }

    const products = await Post.find({ category }).populate("category");

    res.status(200).send({
      success: true,
      message: "Your selected products has been fetched",
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Selected Product API",
    });
  }
};
