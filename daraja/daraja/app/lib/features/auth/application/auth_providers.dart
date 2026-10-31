import 'package:daraja_app/core/config/providers.dart';
import 'package:daraja_app/core/fake/fake_repositories.dart';
import 'package:daraja_app/features/auth/domain/app_user.dart';
import 'package:daraja_app/features/auth/domain/auth_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  if (ref.watch(appConfigProvider).useFakeBackend) {
    return FakeAuthRepository(ref.watch(fakeDatabaseProvider));
  }
  throw UnimplementedError(backendMissingMessage);
});

class AuthController extends AsyncNotifier<AppUser?> {
  @override
  Future<AppUser?> build() => ref.watch(authRepositoryProvider).restoreSession();

  /// Returns an error message to show, or null on success.
  Future<String?> signIn({required String email, required String password}) async {
    try {
      final user = await ref.read(authRepositoryProvider).signIn(
            email: email.trim(),
            password: password,
          );
      state = AsyncData(user);
      return null;
    } on AuthException catch (error) {
      return error.message;
    }
  }

  Future<void> signOut() async {
    await ref.read(authRepositoryProvider).signOut();
    state = const AsyncData(null);
  }
}

final authControllerProvider =
    AsyncNotifierProvider<AuthController, AppUser?>(AuthController.new);

/// The signed-in user, or null while loading or signed out.
final currentUserProvider = Provider<AppUser?>(
  (ref) => ref.watch(authControllerProvider).valueOrNull,
);
