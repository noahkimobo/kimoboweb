/// Decides which links the app may open outside itself.
///
/// Anything not on this list is refused, so data coming from a server can never
/// make the app open an arbitrary or `javascript:` URL.
const Set<String> allowedExternalHosts = {'daraja.co.ke', 'www.daraja.co.ke', 'wa.me'};

bool isAllowedExternalUri(Uri uri) {
  switch (uri.scheme) {
    case 'https':
      return allowedExternalHosts.contains(uri.host) && uri.userInfo.isEmpty;
    case 'mailto':
      return uri.path.isNotEmpty;
    default:
      return false;
  }
}
