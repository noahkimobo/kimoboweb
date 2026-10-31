import 'package:daraja_app/core/config/app_config.dart';
import 'package:daraja_app/core/routing/app_router.dart';
import 'package:daraja_app/core/security/external_uri_policy.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('external links', () {
    test('allows only listed https hosts and mailto', () {
      expect(isAllowedExternalUri(Uri.parse('https://daraja.co.ke/contact/')), isTrue);
      expect(isAllowedExternalUri(Uri.parse('https://wa.me/254700000000')), isTrue);
      expect(isAllowedExternalUri(Uri.parse('mailto:hello@daraja.co.ke')), isTrue);
    });
    test('refuses everything else', () {
      expect(isAllowedExternalUri(Uri.parse('http://daraja.co.ke')), isFalse);
      expect(isAllowedExternalUri(Uri.parse('https://evil.example')), isFalse);
      expect(isAllowedExternalUri(Uri.parse('https://daraja.co.ke.evil.example')), isFalse);
      expect(isAllowedExternalUri(Uri.parse('https://user:pw@daraja.co.ke')), isFalse);
      expect(isAllowedExternalUri(Uri.parse('javascript:alert(1)')), isFalse);
      expect(isAllowedExternalUri(Uri.parse('data:text/html,hi')), isFalse);
      expect(isAllowedExternalUri(Uri.parse('mailto:')), isFalse);
    });
  });

  group('route guard', () {
    test('signed-out users only reach /login', () {
      expect(guardRedirect(loading: false, signedIn: false, location: '/orders'), '/login');
      expect(guardRedirect(loading: false, signedIn: false, location: '/login'), isNull);
    });
    test('signed-in users skip /login', () {
      expect(guardRedirect(loading: false, signedIn: true, location: '/login'), '/dashboard');
      expect(guardRedirect(loading: false, signedIn: true, location: '/orders'), isNull);
    });
    test('loading holds everyone on /loading', () {
      expect(guardRedirect(loading: true, signedIn: false, location: '/orders'), '/loading');
      expect(guardRedirect(loading: true, signedIn: false, location: '/loading'), isNull);
    });
  });

  group('config', () {
    test('real backend must be https', () {
      const http = AppConfig(apiBaseUrl: 'http://api.example.com', useFakeBackend: false, allowFakeInRelease: false, siteUrl: 'https://daraja.co.ke');
      const https = AppConfig(apiBaseUrl: 'https://api.example.com', useFakeBackend: false, allowFakeInRelease: false, siteUrl: 'https://daraja.co.ke');
      const missing = AppConfig(apiBaseUrl: '', useFakeBackend: false, allowFakeInRelease: false, siteUrl: 'https://daraja.co.ke');
      expect(http.validate(), isNotNull);
      expect(https.validate(), isNull);
      expect(missing.validate(), isNotNull);
    });
  });
}
