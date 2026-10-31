import 'package:daraja_app/core/format/format.dart';
import 'package:daraja_app/core/widgets/async_body.dart';
import 'package:daraja_app/core/widgets/empty_state.dart';
import 'package:daraja_app/core/widgets/page_body.dart';
import 'package:daraja_app/core/widgets/status_chip.dart';
import 'package:daraja_app/features/orders/application/orders_providers.dart';
import 'package:daraja_app/features/orders/domain/order.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

enum _OrderFilter {
  all('All'),
  active('Active'),
  completed('Completed');

  const _OrderFilter(this.label);
  final String label;

  bool matches(Order order) => switch (this) {
        _OrderFilter.all => true,
        _OrderFilter.active => order.status.isActive,
        _OrderFilter.completed => !order.status.isActive,
      };
}

class OrdersScreen extends ConsumerStatefulWidget {
  const OrdersScreen({super.key});

  @override
  ConsumerState<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends ConsumerState<OrdersScreen> {
  _OrderFilter _filter = _OrderFilter.all;

  @override
  Widget build(BuildContext context) {
    final orders = ref.watch(ordersProvider);
    return PageBody(
      title: 'My orders',
      subtitle: 'Everything you have bought from Daraja, and where it is now.',
      children: [
        Wrap(
          spacing: 8,
          children: [
            for (final filter in _OrderFilter.values)
              ChoiceChip(
                label: Text(filter.label),
                selected: _filter == filter,
                onSelected: (_) => setState(() => _filter = filter),
              ),
          ],
        ),
        const SizedBox(height: 16),
        AsyncBody<List<Order>>(
          value: orders,
          onRetry: () => ref.invalidate(ordersProvider),
          builder: (all) {
            if (all.isEmpty) {
              return EmptyState(
                icon: Icons.receipt_long_outlined,
                title: 'No orders yet',
                message: 'Your orders will appear here after your first purchase.',
                actionLabel: 'Browse services',
                onAction: () => context.go('/services'),
              );
            }
            final shown = all.where(_filter.matches).toList();
            if (shown.isEmpty) {
              return const EmptyState(
                icon: Icons.filter_list,
                title: 'Nothing in this view',
                message: 'Try another filter.',
              );
            }
            return Column(children: [for (final order in shown) OrderTile(order: order)]);
          },
        ),
      ],
    );
  }
}

class OrderTile extends StatelessWidget {
  const OrderTile({required this.order, super.key});

  final Order order;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        title: Text('${order.id} · ${order.summary}', style: const TextStyle(fontWeight: FontWeight.w700)),
        subtitle: Text('${formatDate(order.createdAt)} · ${formatKes(order.totalKes)}'),
        trailing: StatusChip(label: order.status.label, emphasis: order.status.isActive),
        onTap: () => context.go('/orders/${Uri.encodeComponent(order.id)}'),
      ),
    );
  }
}
