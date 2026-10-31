import 'package:daraja_app/core/theme/app_colors.dart';
import 'package:flutter/material.dart';

/// The arch-and-deck bridge mark, drawn in code so no image asset is needed.
class DarajaMark extends StatelessWidget {
  const DarajaMark({this.size = 32, this.onDark = true, super.key});

  final double size;
  final bool onDark;

  @override
  Widget build(BuildContext context) {
    return ExcludeSemantics(
      child: CustomPaint(size: Size.square(size), painter: _MarkPainter(onDark: onDark)),
    );
  }
}

class _MarkPainter extends CustomPainter {
  const _MarkPainter({required this.onDark});

  final bool onDark;

  @override
  void paint(Canvas canvas, Size size) {
    final s = size.width / 48;
    final arch = Path()
      ..moveTo(10 * s, 34 * s)
      ..lineTo(10 * s, 26 * s)
      ..cubicTo(10 * s, 12 * s, 38 * s, 12 * s, 38 * s, 26 * s)
      ..lineTo(38 * s, 34 * s);
    canvas
      ..drawPath(
        arch,
        Paint()
          ..color = onDark ? AppColors.white : AppColors.ink
          ..style = PaintingStyle.stroke
          ..strokeWidth = 5 * s,
      )
      ..drawRRect(
        RRect.fromRectAndRadius(Rect.fromLTWH(5 * s, 32 * s, 38 * s, 6 * s), Radius.circular(3 * s)),
        Paint()..color = AppColors.amber,
      );
  }

  @override
  bool shouldRepaint(_MarkPainter old) => old.onDark != onDark;
}
