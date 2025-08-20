import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.js";

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData); // Parses product data from request body

    const images = req.files; // Access uploaded files (via multer or similar)

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url; // Get URL after upload
      })
    );

    await Product.create({ ...productData, image: imagesUrl }); // Save to DB

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// Get Product : /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({}); // Fetch all products from DB
    res.json({ success: true, products });   // Send products in response
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// Get single Product : /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// Change Product inStock : /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "Stock Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
