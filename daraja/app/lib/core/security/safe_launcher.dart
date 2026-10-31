import 'package:daraja_app/core/security/external_uri_policy.dart';
import 'package:url_launcher/url_launcher.dart';

/// Opens a link only when it passes [isAllowedExternalUri]. Returns whether it opened.
Future<bool> openExternal(Uri uri) async {
  if (!isAllowedExternalUri(uri)) return false;
  return launchUrl(uri, mode: LaunchMode.externalApplication);
}
