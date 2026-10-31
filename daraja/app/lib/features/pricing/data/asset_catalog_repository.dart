import 'dart:convert';

import 'package:daraja_app/features/pricing/domain/catalog.dart';
import 'package:daraja_app/features/pricing/domain/catalog_repository.dart';
import 'package:flutter/services.dart';

/// Reads the catalog bundled with the app (assets/data/pricing_catalog.json).
class AssetCatalogRepository implements CatalogRepository {
  AssetCatalogRepository({AssetBundle? bundle}) : _bundle = bundle ?? rootBundle;

  static const String assetPath = 'assets/data/pricing_catalog.json';
  final AssetBundle _bundle;
  Catalog? _cached;

  @override
  Future<Catalog> load() async {
    final cached = _cached;
    if (cached != null) return cached;
    final text = await _bundle.loadString(assetPath);
    final decoded = jsonDecode(text);
    if (decoded is! Map<String, Object?>) {
      throw const FormatException('Catalog root must be an object.');
    }
    return _cached = Catalog.fromJson(decoded);
  }
}
