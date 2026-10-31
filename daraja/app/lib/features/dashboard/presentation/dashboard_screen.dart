import 'package:daraja_app/core/format/format.dart';
import 'package:daraja_app/core/theme/app_colors.dart';
import 'package:daraja_app/core/widgets/page_body.dart';
import 'package:daraja_app/core/widgets/section_card.dart';
import 'package:daraja_app/core/widgets/sparkline.dart';
import 'package:daraja_app/features/auth/application/auth_providers.dart';
import 'package:daraja_app/features/growth/application/growth_providers.dart';
import 'package:daraja_app/features/growth/domain/growth.dart';
import 'package:daraja_app/features/growth/presentation/growth_screen.dart';
import 'package:daraja_app/features/orders/application/orders_providers.dart';
import 'package:daraja_app/features/orders/domain/order.dart';
import 'package:daraja_app/features/orders/presentation/orders_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

/// Shows a getting-started view for a new account and a data view once the
/// account has orders or growth entries.
class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final orders = ref.watch(ordersProvider);
    final growth = ref.watch(growthProvider);
    final title = user == null ? 'Dashboard' : 'Welcome, ${user.name.split(' ').first}';

    if (orders.hasError || growth.hasError) {
      return PageBody(
        title: title,
        children: [
          const Text('Something went wrong. Please try again.'),
          const SizedBox(height: 12),
          Align(
            alignment: Alignment.centerLeft,
            child: OutlinedButton(
              onPressed: () {
                ref.invalidate(ordersProvider);
                ref.invalidate(growthProvider);
              },
              child: const Text('Try again'),
            ),
          ),
        ],
      );
    }
    final ordersData = orders.valueOrNull;
    final growthData = growth.valueOrNull;
    if (ordersData == null || growthData == null) {
      return PageBody(title: title, children: const [Padding(padding: EdgeInsets.all(40), child: Center(child: CircularProgressIndicator()))]);
    }
    final isNew = ordersData.isEmpty && growthData.isEmpty;
    return PageBody(
      title: title,
      subtitle: isNew
          ? 'Your account is ready. Here is how to get started.'
          : user?.businessName,
      children: isNew ? const [_NewAccountView()] : [_ActiveView(orders: ordersData, growth: growthData)],
    );
  }
}

class _NewAccountView extends StatelessWidget {
  const _NewAccountView();

  @override
  Widget build(BuildContext context) {
    const steps = [
      (Icons.sell_outlined, 'Choose a service', 'See what each level includes and what it costs.', '/services', 'Browse services'),
      (Icons.trending_up, 'Record your starting numbers', 'Add today\'s followers so we can show your growth.', '/growth', 'Add numbers'),
      (Icons.receipt_long_outlined, 'Place your first order', 'Pay with M-Pesa and follow progress here.', '/orders', 'My orders'),
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (var i = 0; i < steps.length; i++)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: SectionCard(
              child: Row(
                children: [
                  CircleAvatar(
                    backgroundColor: AppColors.amber,
                    foregroundColor: AppColors.ink,
                    child: Text('${i + 1}', style: const TextStyle(fontWeight: FontWeight.w800)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(steps[i].$2, style: const TextStyle(fontWeight: FontWeight.w700)),
                        Text(steps[i].$3),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  OutlinedButton(onPressed: () => context.go(steps[i].$4), child: Text(steps[i].$5)),
                ],
              ),
            ),
          ),
        const SizedBox(height: 8),
        const SectionCard(
          color: AppColors.mist,
          title: 'What this dashboard will show',
          child: Text('Once you have orders and follower numbers, you will see active orders, followers gained, and a progress chart here.'),
        ),
      ],
    );
  }
}

class _ActiveView extends StatelessWidget {
  const _ActiveView({required this.orders, required this.growth});

  final List<Order> orders;
  final List<GrowthEntry> growth;

  @override
  Widget build(BuildContext context) {
    final active = orders.where((o) => o.status.isActive).length;
    final summary = GrowthSummary.from(growth);
    final spent = orders.where((o) => o.status != OrderStatus.cancelled).fold<int>(0, (s, o) => s + o.totalKes);
    final recent = orders.take(3).toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Wrap(
          spacing: 16,
          runSpacing: 16,
          children: [
            _Kpi(label: 'Active orders', value: '$active'),
            _Kpi(label: 'Followers gained', value: growth.isEmpty ? '-' : describeChange(summary.total)),
            _Kpi(label: 'Total spent', value: formatKes(spent)),
          ],
        ),
        const SizedBox(height: 20),
        SectionCard(
          title: 'Follower growth',
          child: growth.isEmpty
              ? Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Add your follower numbers to see your progress here.'),
                    const SizedBox(height: 12),
                    OutlinedButton(onPressed: () => context.go('/growth'), child: const Text('Add numbers')),
                  ],
                )
              : Sparkline(
                  values: summary.series,
                  semanticLabel: 'Followers over time, from ${formatCount(summary.series.first)} to ${formatCount(summary.series.last)}',
                ),
        ),
        const SizedBox(height: 20),
        Row(
          children: [
            Expanded(child: Text('Recent orders', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800))),
            TextButton(onPressed: () => context.go('/orders'), child: const Text('See all')),
          ],
        ),
        const SizedBox(height: 8),
        if (recent.isEmpty)
          const Text('No orders yet.')
        else
          for (final order in recent) OrderTile(order: order),
      ],
    );
  }
}

class _Kpi extends StatelessWidget {
  const _Kpi({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 240,
      child: SectionCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: Theme.of(context).textTheme.labelLarge?.copyWith(color: AppColors.muted)),
            const SizedBox(height: 4),
            Text(value, style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
          ],
        ),
      ),
    );
  }
}
