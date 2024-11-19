// Здесь можно использовать базу данных, но для простоты начнем с in-memory хранилища
const orders = new Map();

class OrderService {
    async createOrder(orderData) {
        const { orderId, userId, amount, status } = orderData;
        orders.set(orderId, {
            userId,
            amount,
            status,
            createdAt: new Date(),
            paymentMethod: orderData.paymentMethod || 'card'
        });
        return orderData;
    }

    async updateOrder(orderId, status) {
        const order = orders.get(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        order.status = status;
        order.updatedAt = new Date();
        orders.set(orderId, order);
        return order;
    }

    async getOrder(orderId) {
        const order = orders.get(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    async getUserOrders(userId) {
        const userOrders = [];
        for (const [orderId, order] of orders) {
            if (order.userId === userId) {
                userOrders.push({ orderId, ...order });
            }
        }
        return userOrders;
    }
}

module.exports = new OrderService(); 