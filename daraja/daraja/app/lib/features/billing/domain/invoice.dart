import 'package:flutter/foundation.dart';

enum InvoiceStatus {
  paid('Paid'),
  due('Due');

  const InvoiceStatus(this.label);
  final String label;
}

@immutable
class Invoice {
  const Invoice({
    required this.id,
    required this.orderId,
    required this.issuedAt,
    required this.amountKes,
    required this.status,
    this.mpesaReceipt,
  });

  final String id;
  final String orderId;
  final DateTime issuedAt;
  final int amountKes;
  final InvoiceStatus status;
  final String? mpesaReceipt;
}
