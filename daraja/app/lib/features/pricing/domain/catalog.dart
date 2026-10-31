import 'package:flutter/foundation.dart';

enum ServiceLevel {
  basic('Basic'),
  standard('Standard'),
  premium('Premium');

  const ServiceLevel(this.label);
  final String label;
}

enum ServiceCategory {
  valuation('Business Valuation & Hybrid Migration'),
  graphicDesign('Visual Re-Branding & Graphic Design'),
  software('Software, M-Pesa POS & Delivery Apps'),
  socialAds('Algorithmic Social Media Ads & Audits');

  const ServiceCategory(this.label);
  final String label;
}

/// One level of one service. A null [priceKes] means "request a quote".
@immutable
class LevelOffer {
  const LevelOffer({required this.priceKes, required this.includes});

  final int? priceKes;
  final List<String> includes;
}

@immutable
class CatalogItem {
  const CatalogItem({
    required this.id,
    required this.category,
    required this.name,
    required this.description,
    required this.levels,
  });

  final String id;
  final ServiceCategory category;
  final String name;
  final String description;
  final Map<ServiceLevel, LevelOffer> levels;
}

/// A service and level the user has put in their basket. Only identifiers are
/// stored: the server works out the price, so a client can never set its own.
@immutable
class CartSelection {
  const CartSelection({required this.itemId, required this.level});

  final String itemId;
  final ServiceLevel level;

  @override
  bool operator ==(Object other) =>
      other is CartSelection && other.itemId == itemId && other.level == level;

  @override
  int get hashCode => Object.hash(itemId, level);
}

@immutable
class Catalog {
  const Catalog({required this.items, required this.isPlaceholder});

  /// Parses and validates the catalog JSON. Throws [FormatException] when invalid.
  factory Catalog.fromJson(Map<String, Object?> json) {
    if (json['schemaVersion'] != 1) {
      throw const FormatException('Unsupported catalog schema version.');
    }
    final rawItems = json['items'];
    if (rawItems is! List<Object?>) {
      throw const FormatException('Catalog items must be a list.');
    }
    final items = <CatalogItem>[];
    final seen = <String>{};
    for (final raw in rawItems) {
      if (raw is! Map<String, Object?>) {
        throw const FormatException('Catalog item must be an object.');
      }
      final item = _parseItem(raw);
      if (!seen.add(item.id)) {
        throw FormatException('Duplicate catalog id: ${item.id}');
      }
      items.add(item);
    }
    return Catalog(items: List.unmodifiable(items), isPlaceholder: json['isPlaceholder'] == true);
  }

  static CatalogItem _parseItem(Map<String, Object?> raw) {
    final id = raw['id'];
    final name = raw['name'];
    final description = raw['description'];
    final categoryName = raw['category'];
    final rawLevels = raw['levels'];
    if (id is! String || name is! String || description is! String || rawLevels is! Map<String, Object?>) {
      throw const FormatException('Catalog item is missing a required field.');
    }
    final category = ServiceCategory.values.where((c) => c.name == categoryName).firstOrNull;
    if (category == null) throw FormatException('Unknown category for $id.');
    final levels = <ServiceLevel, LevelOffer>{};
    for (final level in ServiceLevel.values) {
      final offer = rawLevels[level.name];
      if (offer is! Map<String, Object?>) {
        throw FormatException('$id is missing level ${level.name}.');
      }
      final price = offer['priceKes'];
      final includes = offer['includes'];
      if (price != null && (price is! int || price < 0)) {
        throw FormatException('$id has an invalid price for ${level.name}.');
      }
      if (includes is! List<Object?> || includes.any((e) => e is! String)) {
        throw FormatException('$id has invalid "includes" for ${level.name}.');
      }
      levels[level] = LevelOffer(
        priceKes: price as int?,
        includes: List.unmodifiable(includes.cast<String>()),
      );
    }
    return CatalogItem(
      id: id,
      category: category,
      name: name,
      description: description,
      levels: Map.unmodifiable(levels),
    );
  }

  final List<CatalogItem> items;

  /// True while the prices are samples. The UI shows a banner in that case.
  final bool isPlaceholder;

  CatalogItem? itemById(String id) => items.where((i) => i.id == id).firstOrNull;

  List<CatalogItem> inCategory(ServiceCategory category) =>
      items.where((i) => i.category == category).toList(growable: false);

  /// Price for a selection, or null when the item is unknown or needs a quote.
  int? priceOf(CartSelection selection) =>
      itemById(selection.itemId)?.levels[selection.level]?.priceKes;
}
