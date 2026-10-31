import 'package:daraja_app/core/config/providers.dart';
import 'package:daraja_app/core/fake/fake_repositories.dart';
import 'package:daraja_app/features/checkout/domain/payment.dart';
import 'package:daraja_app/features/pricing/application/pricing_providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final paymentRepositoryProvider = Provider<PaymentRepository>((ref) {
  if (ref.watch(appConfigProvider).useFakeBackend) {
    return FakePaymentRepository(
      ref.watch(fakeDatabaseProvider),
      ref.watch(catalogRepositoryProvider),
    );
  }
  throw UnimplementedError(backendMissingMessage);
});
