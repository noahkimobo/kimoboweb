import 'package:daraja_app/features/auth/domain/app_user.dart';

class AuthException implements Exception {
  const AuthException(this.message);

  /// Safe to show to the user.
  final String message;

  @override
  String toString() => 'AuthException: $message';
}

/// The session lives in an httpOnly, Secure, SameSite cookie set by the server.
/// The app never sees or stores a token, so there is nothing to steal from
/// localStorage. See docs/BACKEND_CONTRACT.md.
abstract interface class AuthRepository {
  /// The user for the current cookie session, or null when signed out.
  Future<AppUser?> restoreSession();

  Future<AppUser> signIn({required String email, required String password});

  Future<void> signOut();
}
