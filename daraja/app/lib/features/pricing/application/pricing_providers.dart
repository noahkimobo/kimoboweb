import 'package:daraja_app/features/auth/application/auth_providers.dart';
import 'package:daraja_app/features/pricing/data/asset_catalog_repository.dart';
import 'package:daraja_app/features/pricing/domain/catalog.dart';
import 'package:daraja_app/features/pricing/domain/catalog_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final catalogRepositoryProvider = Provider<CatalogRepository>((ref) => AssetCatalogRepository());

final catalogProvider = FutureProvider<Catalog>((ref) => ref.watch(catalogRepositoryProvider).load());

/// The user's basket. Holds identifiers only; see [CartSelection].
class CartController extends Notifier<List<CartSelection>> {
  static const int maxLines = 20;

  @override
  List<CartSelection> build() {
    // A new user (or a sign-out) always starts with an empty basket.
    ref.watch(currentUserProvider);
    return const [];
  }

  /// Adds a selection, replacing any other level already chosen for the same item.
  void add(CartSelection selection) {
    final others = state.where((s) => s.itemId != selection.itemId).toList();
    if (others.length >= maxLines) return;
    state = [...others, selection];
  }

  void remove(String itemId) => state = state.where((s) => s.itemId != itemId).toList();

  void clear() => state = const [];
}

final cartProvider = NotifierProvider<CartController, List<CartSelection>>(CartController.new);

/// Total of the priced lines in the basket, or null while the catalog loads.
final cartTotalProvider = Provider<int?>((ref) {
  final catalog = ref.watch(catalogProvider).valueOrNull;
  if (catalog == null) return null;
  return ref.watch(cartProvider).fold<int>(0, (sum, s) => sum + (catalog.priceOf(s) ?? 0));
});
