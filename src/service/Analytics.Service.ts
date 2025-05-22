// src/service/AnalyticsService.ts
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import MemberModel from "../schema/Member.model";

class AnalyticsService {
  public async getKPI() {
    const totalOrders = await OrderModel.countDocuments({
      orderStatus: "PAID",
    });
    const totalRevenueAgg = await OrderModel.aggregate([
      { $match: { orderStatus: "PAID" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const customers = await OrderModel.distinct("memberId");
    const totalCustomers = customers.length;

    const averageOrder = totalOrders ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      totalCustomers,
      averageOrder,
    };
  }

  public async getMonthlySales() {
    const result = await OrderModel.aggregate([
      { $match: { orderStatus: "PAID" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    console.log("monthlySales raw:", result);

    return result.map((entry) => ({
      month: `${entry._id.month}/${entry._id.year}`,
      total: entry.total,
      orders: entry.orders,
    }));
  }

  public async getTopCategories() {
    const result = await OrderItemModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.productCategory",
          value: { $sum: { $multiply: ["$itemPrice", "$itemQuantity"] } },
        },
      },
      { $sort: { value: -1 } },
      { $limit: 5 },
    ]);

    return result.map((entry) => ({
      name: entry._id || "Uncategorized",
      value: entry.value,
    }));
  }

  public async getTopBuyers() {
    const result = await OrderItemModel.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      { $unwind: "$order" },
      {
        $group: {
          _id: "$order.memberId",
          totalSpent: {
            $sum: { $multiply: ["$itemPrice", "$itemQuantity"] },
          },
          lastPurchase: { $max: "$order.createdAt" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
    ]);

    return await Promise.all(
      result.map(async (buyer) => {
        const member = await MemberModel.findById(buyer._id).select(
          "memberNick"
        );
        return {
          nickname: member?.memberNick || "Unknown",
          totalSpent: buyer.totalSpent,
          totalSpentFormatted: buyer.totalSpent.toLocaleString(),
          lastPurchaseFormatted: new Date(
            buyer.lastPurchase
          ).toLocaleDateString(),
        };
      })
    );
  }
}

export default AnalyticsService;
