import 'package:flutter/foundation.dart';

enum SocialPlatform {
  instagram('Instagram'),
  tiktok('TikTok'),
  facebook('Facebook'),
  youtube('YouTube');

  const SocialPlatform(this.label);
  final String label;
}

@immutable
class GrowthEntry {
  const GrowthEntry({
    required this.id,
    required this.platform,
    required this.followersBefore,
    required this.followersAfter,
    required this.recordedAt,
    this.note = '',
  });

  final String id;
  final SocialPlatform platform;
  final int followersBefore;
  final int followersAfter;
  final DateTime recordedAt;
  final String note;

  int get change => followersAfter - followersBefore;
}

/// Change in followers, shared by the form preview, the list and the dashboard.
@immutable
class GrowthChange {
  const GrowthChange({required this.before, required this.after});

  final int before;
  final int after;

  int get delta => after - before;

  /// Percentage change, or null when there was no starting audience to compare to.
  double? get percent => before == 0 ? null : delta / before * 100;
}

@immutable
class GrowthSummary {
  const GrowthSummary._({required this.total, required this.byPlatform, required this.series});

  factory GrowthSummary.from(List<GrowthEntry> entries) {
    final ordered = [...entries]..sort((a, b) => a.recordedAt.compareTo(b.recordedAt));
    final firstByPlatform = <SocialPlatform, GrowthEntry>{};
    final lastByPlatform = <SocialPlatform, GrowthEntry>{};
    for (final entry in ordered) {
      firstByPlatform.putIfAbsent(entry.platform, () => entry);
      lastByPlatform[entry.platform] = entry;
    }
    final byPlatform = <SocialPlatform, GrowthChange>{
      for (final platform in lastByPlatform.keys)
        platform: GrowthChange(
          before: firstByPlatform[platform]!.followersBefore,
          after: lastByPlatform[platform]!.followersAfter,
        ),
    };
    final total = GrowthChange(
      before: byPlatform.values.fold(0, (sum, c) => sum + c.before),
      after: byPlatform.values.fold(0, (sum, c) => sum + c.after),
    );
    return GrowthSummary._(
      total: total,
      byPlatform: byPlatform,
      series: ordered.map((e) => e.followersAfter).toList(growable: false),
    );
  }

  /// First "before" to latest "after", summed across platforms.
  final GrowthChange total;
  final Map<SocialPlatform, GrowthChange> byPlatform;

  /// The "after" value of each entry, oldest first, for the chart.
  final List<int> series;
}
