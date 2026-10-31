import 'package:daraja_app/core/theme/app_colors.dart';
import 'package:flutter/material.dart';

/// Shown when a list has nothing in it yet. Always says what to do next.
class EmptyState extends StatelessWidget {
  const EmptyState({
    required this.icon,
    required this.title,
    required this.message,
    this.actionLabel,
    this.onAction,
    super.key,
  });

  final IconData icon;
  final String title;
  final String message;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    return Card(
      color: AppColors.mist,
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          children: [
            Icon(icon, size: 40, color: AppColors.blue),
            const SizedBox(height: 12),
            Text(title, style: text.titleMedium?.copyWith(fontWeight: FontWeight.w700), textAlign: TextAlign.center),
            const SizedBox(height: 6),
            Text(message, textAlign: TextAlign.center),
            if (actionLabel != null && onAction != null) ...[
              const SizedBox(height: 16),
              FilledButton(onPressed: onAction, child: Text(actionLabel!)),
            ],
          ],
        ),
      ),
    );
  }
}
