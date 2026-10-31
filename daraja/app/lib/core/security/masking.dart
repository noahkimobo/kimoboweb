/// Hides most of a phone number before it is shown on screen.
String maskPhone(String normalized) {
  if (normalized.length < 8) return '••••';
  return '${normalized.substring(0, 4)}••••${normalized.substring(normalized.length - 3)}';
}
