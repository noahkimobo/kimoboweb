import 'package:daraja_app/core/theme/app_colors.dart';
import 'package:daraja_app/core/widgets/logo.dart';
import 'package:daraja_app/features/pricing/application/pricing_providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class _Destination {
  const _Destination(this.path, this.label, this.icon, {this.inBottomBar = true});

  final String path;
  final String label;
  final IconData icon;
  final bool inBottomBar;
}

const List<_Destination> _destinations = [
  _Destination('/dashboard', 'Dashboard', Icons.dashboard_outlined),
  _Destination('/orders', 'Orders', Icons.receipt_long_outlined),
  _Destination('/growth', 'Growth', Icons.trending_up),
  _Destination('/services', 'Services', Icons.sell_outlined),
  _Destination('/billing', 'Billing', Icons.payments_outlined),
  _Destination('/account', 'Account', Icons.person_outline, inBottomBar: false),
];

/// Navigation frame for every signed-in screen: a rail on wide screens, a bar on narrow ones.
class AppShell extends ConsumerWidget {
  const AppShell({required this.location, required this.child, super.key});

  final String location;
  final Widget child;

  int get _selected {
    final index = _destinations.indexWhere((d) => location == d.path || location.startsWith('${d.path}/'));
    return index < 0 ? 0 : index;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final wide = MediaQuery.sizeOf(context).width >= 840;
    final basketCount = ref.watch(cartProvider).length;
    final selected = _selected;
    final appBar = AppBar(
      title: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          DarajaMark(size: 26),
          SizedBox(width: 10),
          Text('Daraja', style: TextStyle(fontWeight: FontWeight.w800)),
        ],
      ),
      actions: [
        IconButton(
          tooltip: basketCount == 0 ? 'Basket' : 'Basket, $basketCount items',
          onPressed: () => context.go('/checkout'),
          icon: Badge(
            isLabelVisible: basketCount > 0,
            label: Text('$basketCount'),
            backgroundColor: AppColors.amber,
            textColor: AppColors.ink,
            child: const Icon(Icons.shopping_basket_outlined),
          ),
        ),
        if (!wide)
          IconButton(
            tooltip: 'Account',
            onPressed: () => context.go('/account'),
            icon: const Icon(Icons.person_outline),
          ),
      ],
    );

    if (wide) {
      return Scaffold(
        appBar: appBar,
        body: Row(
          children: [
            NavigationRail(
              selectedIndex: selected,
              labelType: NavigationRailLabelType.all,
              onDestinationSelected: (i) => context.go(_destinations[i].path),
              destinations: [
                for (final d in _destinations)
                  NavigationRailDestination(icon: Icon(d.icon), label: Text(d.label)),
              ],
            ),
            const VerticalDivider(width: 1),
            Expanded(child: child),
          ],
        ),
      );
    }

    final barItems = _destinations.where((d) => d.inBottomBar).toList();
    return Scaffold(
      appBar: appBar,
      body: child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: selected < barItems.length ? selected : 0,
        onDestinationSelected: (i) => context.go(barItems[i].path),
        destinations: [
          for (final d in barItems) NavigationDestination(icon: Icon(d.icon), label: d.label),
        ],
      ),
    );
  }
}
