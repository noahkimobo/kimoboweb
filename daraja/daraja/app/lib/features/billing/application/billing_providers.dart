import 'package:daraja_app/core/config/providers.dart';
import 'package:daraja_app/core/fake/fake_repositories.dart';
import 'package:daraja_app/features/auth/application/auth_providers.dart';
import 'package:daraja_app/features/billing/domain/billing_repository.dart';
import 'package:daraja_app/features/billing/domain/invoice.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final billingRepositoryProvider = Provider<BillingRepository>((ref) {
  if (ref.watch(appConfigProvider).useFakeBackend) {
    return FakeBillingRepository(ref.watch(fakeDatabaseProvider));
  }
  throw UnimplementedError(backendMissingMessage);
});

final invoicesProvider = FutureProvider<List<Invoice>>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return const [];
  return ref.watch(billingRepositoryProvider).list();
});
