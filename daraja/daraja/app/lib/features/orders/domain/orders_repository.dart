import 'package:daraja_app/features/orders/domain/order.dart';

abstract interface class OrdersRepository {
  /// The signed-in user's orders, newest first.
  Future<List<Order>> list();
}
