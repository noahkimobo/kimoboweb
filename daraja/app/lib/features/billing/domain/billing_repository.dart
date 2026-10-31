import 'package:daraja_app/features/billing/domain/invoice.dart';

abstract interface class BillingRepository {
  /// The signed-in user's invoices, newest first.
  Future<List<Invoice>> list();
}
