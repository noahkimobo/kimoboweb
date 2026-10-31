import 'package:flutter/foundation.dart';

/// Build-time configuration, supplied with `--dart-define`. Nothing secret
/// belongs here: a Flutter Web bundle is public.
@immutable
class AppConfig {
  const AppConfig({
    required this.apiBaseUrl,
    required this.useFakeBackend,
    required this.allowFakeInRelease,
    required this.siteUrl,
  });

  static const AppConfig current = AppConfig(
    apiBaseUrl: String.fromEnvironment('API_BASE_URL'),
    useFakeBackend: bool.fromEnvironment('USE_FAKE_BACKEND', defaultValue: !kReleaseMode),
    allowFakeInRelease: bool.fromEnvironment('ALLOW_FAKE_IN_RELEASE'),
    siteUrl: String.fromEnvironment('SITE_URL', defaultValue: 'https://daraja.co.ke'),
  );

  final String apiBaseUrl;
  final bool useFakeBackend;
  final bool allowFakeInRelease;
  final String siteUrl;

  /// Returns a human-readable problem, or null when the configuration is safe.
  String? validate() {
    if (useFakeBackend) {
      if (kReleaseMode && !allowFakeInRelease) {
        return 'The demo backend is disabled in release builds. '
            'Set API_BASE_URL, or pass ALLOW_FAKE_IN_RELEASE=true for a staging demo.';
      }
      return null;
    }
    final uri = Uri.tryParse(apiBaseUrl);
    if (uri == null || uri.host.isEmpty) {
      return 'API_BASE_URL is missing or invalid.';
    }
    final isLocalDebug = !kReleaseMode && uri.host == 'localhost';
    if (uri.scheme != 'https' && !isLocalDebug) {
      return 'API_BASE_URL must use https.';
    }
    return null;
  }
}
