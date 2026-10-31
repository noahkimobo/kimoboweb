import 'package:daraja_app/features/growth/domain/growth.dart';

abstract interface class GrowthRepository {
  /// The signed-in user's entries, newest first.
  Future<List<GrowthEntry>> list();

  Future<GrowthEntry> add({
    required SocialPlatform platform,
    required int followersBefore,
    required int followersAfter,
    required String note,
  });
}
