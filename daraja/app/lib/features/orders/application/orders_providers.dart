import 'package:daraja_app/core/config/providers.dart';
import 'package:daraja_app/core/fake/fake_repositories.dart';
import 'package:daraja_app/features/auth/application/auth_providers.dart';
import 'package:daraja_app/features/orders/domain/order.dart';
import 'package:daraja_app/features/orders/domain/orders_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final ordersRepositoryProvider = Provider<OrdersRepository>((ref) {
  if (ref.watch(appConfigProvider).useFakeBackend) {
    return FakeOrdersRepository(ref.watch(fakeDatabaseProvider));
  }
  throw UnimplementedError(backendMissingMessage);
});

/// The signed-in user's orders. Reloads whenever the signed-in user changes.
final ordersProvider = FutureProvider<List<Order>>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return const [];
  return ref.watch(ordersRepositoryProvider).list();
});
