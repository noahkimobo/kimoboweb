import 'package:daraja_app/features/growth/domain/growth.dart';
import 'package:flutter_test/flutter_test.dart';

GrowthEntry entry(SocialPlatform p, int before, int after, int day) => GrowthEntry(
      id: '$p$day',
      platform: p,
      followersBefore: before,
      followersAfter: after,
      recordedAt: DateTime(2026, 10, day),
    );

void main() {
  test('change and percent', () {
    const change = GrowthChange(before: 200, after: 250);
    expect(change.delta, 50);
    expect(change.percent, 25);
    expect(const GrowthChange(before: 0, after: 10).percent, isNull);
    expect(const GrowthChange(before: 100, after: 80).delta, -20);
  });

  test('summary uses first before and latest after per platform', () {
    final summary = GrowthSummary.from([
      entry(SocialPlatform.instagram, 1950, 2640, 20),
      entry(SocialPlatform.tiktok, 300, 780, 10),
      entry(SocialPlatform.instagram, 1200, 1950, 1),
    ]);
    expect(summary.byPlatform[SocialPlatform.instagram]!.before, 1200);
    expect(summary.byPlatform[SocialPlatform.instagram]!.after, 2640);
    expect(summary.total.before, 1500);
    expect(summary.total.after, 3420);
    expect(summary.series, [1950, 780, 2640]);
  });

  test('empty list gives zero totals', () {
    final summary = GrowthSummary.from(const []);
    expect(summary.total.delta, 0);
    expect(summary.series, isEmpty);
  });
}
