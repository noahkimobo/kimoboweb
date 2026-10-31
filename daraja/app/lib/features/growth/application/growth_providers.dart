import 'package:daraja_app/core/config/providers.dart';
import 'package:daraja_app/core/fake/fake_repositories.dart';
import 'package:daraja_app/features/auth/application/auth_providers.dart';
import 'package:daraja_app/features/growth/domain/growth.dart';
import 'package:daraja_app/features/growth/domain/growth_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final growthRepositoryProvider = Provider<GrowthRepository>((ref) {
  if (ref.watch(appConfigProvider).useFakeBackend) {
    return FakeGrowthRepository(ref.watch(fakeDatabaseProvider));
  }
  throw UnimplementedError(backendMissingMessage);
});

class GrowthController extends AsyncNotifier<List<GrowthEntry>> {
  @override
  Future<List<GrowthEntry>> build() async {
    final user = ref.watch(currentUserProvider);
    if (user == null) return const [];
    return ref.watch(growthRepositoryProvider).list();
  }

  Future<void> add({
    required SocialPlatform platform,
    required int followersBefore,
    required int followersAfter,
    required String note,
  }) async {
    final repository = ref.read(growthRepositoryProvider);
    await repository.add(
      platform: platform,
      followersBefore: followersBefore,
      followersAfter: followersAfter,
      note: note.trim(),
    );
    state = AsyncData(await repository.list());
  }
}

final growthProvider =
    AsyncNotifierProvider<GrowthController, List<GrowthEntry>>(GrowthController.new);
