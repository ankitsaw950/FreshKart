import Order from "../models/Orderr.js";
import Product from "../models/Product.js";

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    // Validate input
    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // Calculate total amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }
      amount += product.offerPrice * item.quantity;
    }

    // Add 2% Tax
    amount += Math.floor(amount * 0.02);

    // Create Order
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD"
    });

    return res.json({ success: true, message: "Order Placed Successfully" });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }]
    })
    .populate("items.product")
    .populate("address")
    .sort({ createdAt: -1 });

    return res.json({ success: true, orders });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

// Get All Orders (for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }]
    })
    .populate("items.product address")
    .sort({ createdAt: -1 });

    res.json({ success: true, orders });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};
