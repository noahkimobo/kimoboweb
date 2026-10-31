import 'package:daraja_app/core/format/format.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('formatKes groups thousands', () {
    expect(formatKes(0), 'KES 0');
    expect(formatKes(999), 'KES 999');
    expect(formatKes(1000), 'KES 1,000');
    expect(formatKes(1234567), 'KES 1,234,567');
    expect(formatKes(-2500), '-KES 2,500');
  });

  test('formatCount has no currency', () {
    expect(formatCount(12500), '12,500');
  });

  test('formatDate', () {
    expect(formatDate(DateTime(2026, 10, 5)), '5 Oct 2026');
  });
}
