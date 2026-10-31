import 'dart:math' as math;

import 'package:daraja_app/core/theme/app_colors.dart';
import 'package:flutter/painting.dart';
import 'package:flutter_test/flutter_test.dart';

double _channel(double c) => c <= 0.03928 ? c / 12.92 : math.pow((c + 0.055) / 1.055, 2.4).toDouble();

double _luminance(Color c) => 0.2126 * _channel(c.r) + 0.7152 * _channel(c.g) + 0.0722 * _channel(c.b);

double ratio(Color a, Color b) {
  final la = _luminance(a);
  final lb = _luminance(b);
  return (math.max(la, lb) + 0.05) / (math.min(la, lb) + 0.05);
}

void main() {
  // WCAG 2.1 AA: 4.5:1 for normal text.
  final pairs = <String, (Color, Color)>{
    'ink on amber (buttons)': (AppColors.ink, AppColors.amber),
    'ink on paper': (AppColors.ink, AppColors.paper),
    'ink on mist': (AppColors.ink, AppColors.mist),
    'white on ink (app bar)': (AppColors.white, AppColors.ink),
    'body on white': (AppColors.body, AppColors.white),
    'body on paper': (AppColors.body, AppColors.paper),
    'body on mist': (AppColors.body, AppColors.mist),
    'muted on white': (AppColors.muted, AppColors.white),
    'muted on paper': (AppColors.muted, AppColors.paper),
    'blue on paper': (AppColors.blue, AppColors.paper),
    'blue on white': (AppColors.blue, AppColors.white),
    'success on white': (AppColors.success, AppColors.white),
    'danger on white': (AppColors.danger, AppColors.white),
    'danger on paper': (AppColors.danger, AppColors.paper),
  };

  pairs.forEach((name, pair) {
    test('$name meets 4.5:1', () {
      expect(ratio(pair.$1, pair.$2), greaterThanOrEqualTo(4.5));
    });
  });
}
