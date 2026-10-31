import 'package:daraja_app/core/format/format.dart';
import 'package:daraja_app/core/widgets/async_body.dart';
import 'package:daraja_app/core/widgets/page_body.dart';
import 'package:daraja_app/core/widgets/section_card.dart';
import 'package:daraja_app/core/widgets/status_chip.dart';
import 'package:daraja_app/features/orders/application/orders_providers.dart';
import 'package:daraja_app/features/orders/domain/order.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class OrderDetailScreen extends ConsumerWidget {
  const OrderDetailScreen({required this.orderId, super.key});

  final String orderId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orders = ref.watch(ordersProvider);
    return PageBody(
      title: 'Order $orderId',
      trailing: TextButton.icon(
        onPressed: () => context.go('/orders'),
        icon: const Icon(Icons.arrow_back),
        label: const Text('All orders'),
      ),
      children: [
        AsyncBody<List<Order>>(
          value: orders,
          onRetry: () => ref.invalidate(ordersProvider),
          builder: (all) {
            final order = all.where((o) => o.id == orderId).firstOrNull;
            if (order == null) {
              return const SectionCard(child: Text('We could not find that order. It may belong to another account.'));
            }
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: [StatusChip(label: order.status.label, emphasis: order.status.isActive)]),
                const SizedBox(height: 16),
                SectionCard(
                  title: 'What you ordered',
                  child: Column(
                    children: [
                      for (final line in order.lines)
                        ListTile(
                          contentPadding: EdgeInsets.zero,
                          title: Text(line.name),
                          subtitle: Text(line.level.label),
                          trailing: Text(formatKes(line.priceKes)),
                        ),
                      const Divider(),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Total', style: TextStyle(fontWeight: FontWeight.w800)),
                          Text(formatKes(order.totalKes), style: const TextStyle(fontWeight: FontWeight.w800)),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                SectionCard(
                  title: 'Progress',
                  child: Column(
                    children: [
                      for (final event in order.events)
                        ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: const Icon(Icons.check_circle_outline),
                          title: Text(event.title),
                          subtitle: Text([formatDate(event.at), if (event.detail != null) event.detail!].join(' · ')),
                        ),
                    ],
                  ),
                ),
              ],
            );
          },
        ),
      ],
    );
  }
}
