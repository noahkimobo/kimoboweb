import 'package:daraja_app/core/theme/app_colors.dart';
import 'package:daraja_app/core/widgets/page_body.dart';
import 'package:daraja_app/core/widgets/section_card.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ConfirmedScreen extends StatelessWidget {
  const ConfirmedScreen({required this.orderId, super.key});

  final String orderId;

  @override
  Widget build(BuildContext context) {
    const steps = [
      'We confirm your order and contact you to get started.',
      'Work begins. You can follow progress under My orders.',
      'You review the result and ask for changes if the level includes them.',
    ];
    return PageBody(
      title: 'Payment received',
      subtitle: 'Thank you. Your order $orderId is in.',
      children: [
        SectionCard(
          title: 'What happens next',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (var i = 0; i < steps.length; i++)
                Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      CircleAvatar(
                        radius: 14,
                        backgroundColor: AppColors.amber,
                        foregroundColor: AppColors.ink,
                        child: Text('${i + 1}', style: const TextStyle(fontWeight: FontWeight.w800)),
                      ),
                      const SizedBox(width: 12),
                      Expanded(child: Text(steps[i])),
                    ],
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            FilledButton(
              onPressed: () => context.go('/orders/${Uri.encodeComponent(orderId)}'),
              child: const Text('View this order'),
            ),
            OutlinedButton(onPressed: () => context.go('/billing'), child: const Text('See invoice')),
          ],
        ),
      ],
    );
  }
}
