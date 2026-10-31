import 'package:daraja_app/core/security/masking.dart';
import 'package:daraja_app/core/security/validators.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('email', () {
    test('accepts normal addresses', () {
      expect(Validators.email('amina@example.co.ke'), isNull);
      expect(Validators.email('  a.b+tag@mail.example.com '), isNull);
    });
    test('rejects bad input', () {
      expect(Validators.email(''), isNotNull);
      expect(Validators.email(null), isNotNull);
      expect(Validators.email('no-at-sign'), isNotNull);
      expect(Validators.email('a@b'), isNotNull);
      expect(Validators.email('a b@example.com'), isNotNull);
      expect(Validators.email('${'a' * 300}@example.com'), isNotNull);
    });
  });

  group('password', () {
    test('requires a value and caps length', () {
      expect(Validators.password(''), isNotNull);
      expect(Validators.password('x'), isNull);
      expect(Validators.password('x' * 129), isNotNull);
    });
  });

  group('kenyan mobile', () {
    test('normalises common formats', () {
      expect(Validators.normalizeKenyanMobile('0712 345 678'), '254712345678');
      expect(Validators.normalizeKenyanMobile('+254712345678'), '254712345678');
      expect(Validators.normalizeKenyanMobile('254112345678'), '254112345678');
      expect(Validators.normalizeKenyanMobile('0712-345-678'), '254712345678');
    });
    test('rejects invalid numbers', () {
      expect(Validators.normalizeKenyanMobile('0612345678'), isNull);
      expect(Validators.normalizeKenyanMobile('071234567'), isNull);
      expect(Validators.normalizeKenyanMobile('07123456789'), isNull);
      expect(Validators.normalizeKenyanMobile('abc'), isNull);
      expect(Validators.mpesaPhone(''), isNotNull);
      expect(Validators.mpesaPhone('0712345678'), isNull);
    });
    test('masks for display', () {
      expect(maskPhone('254712345678'), '2547••••678');
    });
  });

  group('follower counts', () {
    test('parses whole non-negative numbers', () {
      expect(Validators.parseCount('0'), 0);
      expect(Validators.parseCount('12,500'), 12500);
      expect(Validators.parseCount(' 42 '), 42);
    });
    test('rejects everything else', () {
      expect(Validators.parseCount(''), isNull);
      expect(Validators.parseCount('-1'), isNull);
      expect(Validators.parseCount('1.5'), isNull);
      expect(Validators.parseCount('1e5'), isNull);
      expect(Validators.parseCount('1000000001'), isNull);
      expect(Validators.parseCount('99999999999'), isNull);
      expect(Validators.followerCount('abc'), isNotNull);
      expect(Validators.followerCount('100'), isNull);
    });
  });

  test('note length is bounded', () {
    expect(Validators.note('x' * 280), isNull);
    expect(Validators.note('x' * 281), isNotNull);
  });
}
