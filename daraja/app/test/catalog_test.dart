import 'dart:convert';
import 'dart:io';

import 'package:daraja_app/features/pricing/domain/catalog.dart';
import 'package:flutter_test/flutter_test.dart';

Map<String, Object?> loadJson() =>
    jsonDecode(File('assets/data/pricing_catalog.json').readAsStringSync()) as Map<String, Object?>;

void main() {
  test('bundled catalog parses and every item has all three levels', () {
    final catalog = Catalog.fromJson(loadJson());
    expect(catalog.items, isNotEmpty);
    for (final item in catalog.items) {
      expect(item.levels.keys, containsAll(ServiceLevel.values), reason: item.id);
    }
    for (final category in ServiceCategory.values) {
      expect(catalog.inCategory(category), isNotEmpty, reason: category.name);
    }
  });

  test('graphic design items are priced, quote items are null', () {
    final catalog = Catalog.fromJson(loadJson());
    const logo = CartSelection(itemId: 'gd-logo', level: ServiceLevel.standard);
    const pos = CartSelection(itemId: 'sw-pos', level: ServiceLevel.basic);
    expect(catalog.priceOf(logo), 8000);
    expect(catalog.priceOf(pos), isNull);
    expect(catalog.priceOf(const CartSelection(itemId: 'nope', level: ServiceLevel.basic)), isNull);
  });

  test('rejects malformed catalogs', () {
    expect(() => Catalog.fromJson({'schemaVersion': 2, 'items': <Object?>[]}), throwsFormatException);
    expect(() => Catalog.fromJson({'schemaVersion': 1, 'items': 'x'}), throwsFormatException);
    final bad = loadJson();
    final items = (bad['items']! as List<Object?>).cast<Map<String, Object?>>();
    items.add(Map<String, Object?>.of(items.first));
    expect(() => Catalog.fromJson(bad), throwsFormatException);
  });

  test('rejects negative prices', () {
    final json = loadJson();
    final first = (json['items']! as List<Object?>).first! as Map<String, Object?>;
    ((first['levels']! as Map<String, Object?>)['basic']! as Map<String, Object?>)['priceKes'] = -5;
    expect(() => Catalog.fromJson(json), throwsFormatException);
  });
}
