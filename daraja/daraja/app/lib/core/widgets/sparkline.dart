import 'package:daraja_app/core/theme/app_colors.dart';
import 'package:flutter/material.dart';

/// A minimal line chart of follower counts, oldest first.
class Sparkline extends StatelessWidget {
  const Sparkline({required this.values, required this.semanticLabel, super.key});

  final List<int> values;
  final String semanticLabel;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: semanticLabel,
      image: true,
      child: ExcludeSemantics(
        child: SizedBox(
          height: 120,
          width: double.infinity,
          child: CustomPaint(painter: _SparklinePainter(values)),
        ),
      ),
    );
  }
}

class _SparklinePainter extends CustomPainter {
  const _SparklinePainter(this.values);

  final List<int> values;

  @override
  void paint(Canvas canvas, Size size) {
    if (values.length < 2) return;
    final low = values.reduce((a, b) => a < b ? a : b);
    final high = values.reduce((a, b) => a > b ? a : b);
    final range = (high - low) == 0 ? 1 : (high - low);
    const pad = 8.0;
    Offset pointAt(int i) => Offset(
          pad + (size.width - pad * 2) * i / (values.length - 1),
          size.height - pad - (size.height - pad * 2) * (values[i] - low) / range,
        );

    final path = Path()..moveTo(pointAt(0).dx, pointAt(0).dy);
    for (var i = 1; i < values.length; i++) {
      final p = pointAt(i);
      path.lineTo(p.dx, p.dy);
    }
    canvas.drawPath(
      path,
      Paint()
        ..color = AppColors.blue
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3
        ..strokeJoin = StrokeJoin.round,
    );
    final dot = Paint()..color = AppColors.amber;
    final ring = Paint()
      ..color = AppColors.ink
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    for (var i = 0; i < values.length; i++) {
      canvas
        ..drawCircle(pointAt(i), 5, dot)
        ..drawCircle(pointAt(i), 5, ring);
    }
  }

  @override
  bool shouldRepaint(_SparklinePainter old) => !identical(old.values, values);
}
