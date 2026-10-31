import 'package:daraja_app/features/pricing/domain/catalog.dart';
import 'package:flutter/foundation.dart';

class PaymentException implements Exception {
  const PaymentException(this.message);

  /// Safe to show to the user.
  final String message;

  @override
  String toString() => 'PaymentException: $message';
}

@immutable
class PaymentRequest {
  const PaymentRequest({required this.id, required this.amountKes, required this.maskedPhone});

  final String id;

  /// Worked out by the server from the selections, never sent by the client.
  final int amountKes;
  final String maskedPhone;
}

enum PaymentState { pending, succeeded, failed }

@immutable
class PaymentStatus {
  const PaymentStatus.pending() : this._(PaymentState.pending);
  const PaymentStatus.succeeded(String orderId) : this._(PaymentState.succeeded, orderId: orderId);
  const PaymentStatus.failed(String message) : this._(PaymentState.failed, message: message);
  const PaymentStatus._(this.state, {this.orderId, this.message});

  final PaymentState state;
  final String? orderId;
  final String? message;
}

/// The server starts the M-Pesa STK push and creates the order once Safaricom
/// confirms payment. The app only asks, then polls. It never holds Daraja API
/// credentials and never decides an amount or an order's paid state.
abstract interface class PaymentRepository {
  Future<PaymentRequest> requestStkPush({
    required String phone,
    required List<CartSelection> selections,
  });

  Future<PaymentStatus> status(String requestId);
}
