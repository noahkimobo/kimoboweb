/// Pure input validators. Each returns an error message, or null when valid.
///
/// These improve the user experience only. The server must repeat every check.
abstract final class Validators {
  static const int maxFollowerCount = 1000000000;
  static const int maxNoteLength = 280;
  static const int maxPasswordLength = 128;

  static final RegExp _email = RegExp(
    r'^[A-Za-z0-9._%+\-]{1,64}@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}$',
  );
  static final RegExp _kenyaMobile = RegExp(r'^(?:\+?254|0)([17]\d{8})$');
  static final RegExp _phoneSeparators = RegExp(r'[\s\-()]');

  static String? email(String? input) {
    final value = (input ?? '').trim();
    if (value.isEmpty) return 'Enter your email address.';
    if (value.length > 254 || !_email.hasMatch(value)) {
      return 'Enter a valid email address.';
    }
    return null;
  }

  /// Sign-in only checks presence and an upper bound. The password policy is
  /// enforced by the server, so older accounts are never locked out here.
  static String? password(String? input) {
    final value = input ?? '';
    if (value.isEmpty) return 'Enter your password.';
    if (value.length > maxPasswordLength) return 'That password is too long.';
    return null;
  }

  /// Returns the number as 2547XXXXXXXX / 2541XXXXXXXX, or null when invalid.
  static String? normalizeKenyanMobile(String? input) {
    final cleaned = (input ?? '').replaceAll(_phoneSeparators, '');
    final match = _kenyaMobile.firstMatch(cleaned);
    return match == null ? null : '254${match.group(1)}';
  }

  static String? mpesaPhone(String? input) {
    if ((input ?? '').trim().isEmpty) return 'Enter the number that will pay.';
    return normalizeKenyanMobile(input) == null
        ? 'Use a Kenyan mobile number such as 0712 345 678.'
        : null;
  }

  /// Parses a whole, non-negative follower count. Returns null when invalid.
  static int? parseCount(String? input) {
    final text = (input ?? '').trim().replaceAll(',', '');
    if (text.isEmpty || text.length > 10 || !RegExp(r'^\d+$').hasMatch(text)) {
      return null;
    }
    final value = int.tryParse(text);
    if (value == null || value > maxFollowerCount) return null;
    return value;
  }

  static String? followerCount(String? input) {
    if ((input ?? '').trim().isEmpty) return 'Enter a number.';
    return parseCount(input) == null
        ? 'Enter a whole number from 0 to 1,000,000,000.'
        : null;
  }

  static String? note(String? input) {
    if ((input ?? '').length > maxNoteLength) {
      return 'Keep notes under $maxNoteLength characters.';
    }
    return null;
  }
}
