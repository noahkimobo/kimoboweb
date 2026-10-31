import 'package:daraja_app/core/theme/app_colors.dart';
import 'package:flutter/material.dart';

/// A small label. Meaning is carried by the text, not by colour alone.
class StatusChip extends StatelessWidget {
  const StatusChip({required this.label, this.emphasis = false, super.key});

  final String label;
  final bool emphasis;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: emphasis ? AppColors.amber : AppColors.mist,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: const TextStyle(color: AppColors.ink, fontWeight: FontWeight.w700, fontSize: 12),
      ),
    );
  }
}
