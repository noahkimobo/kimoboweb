import 'package:daraja_app/features/pricing/domain/catalog.dart';
import 'package:flutter/foundation.dart';

enum OrderStatus {
  placed('Placed'),
  inProgress('In progress'),
  inReview('In review'),
  delivered('Delivered'),
  cancelled('Cancelled');

  const OrderStatus(this.label);
  final String label;

  bool get isActive => this == placed || this == inProgress || this == inReview;
}

@immutable
class OrderLine {
  const OrderLine({
    required this.itemId,
    required this.name,
    required this.level,
    required this.priceKes,
  });

  final String itemId;
  final String name;
  final ServiceLevel level;
  final int priceKes;
}

@immutable
class OrderEvent {
  const OrderEvent({required this.at, required this.title, this.detail});

  final DateTime at;
  final String title;
  final String? detail;
}

@immutable
class Order {
  const Order({
    required this.id,
    required this.createdAt,
    required this.status,
    required this.lines,
    required this.events,
  });

  final String id;
  final DateTime createdAt;
  final OrderStatus status;
  final List<OrderLine> lines;
  final List<OrderEvent> events;

  int get totalKes => lines.fold(0, (sum, line) => sum + line.priceKes);

  String get summary => lines.length == 1
      ? lines.first.name
      : '${lines.first.name} and ${lines.length - 1} more';
}
