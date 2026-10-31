import 'package:daraja_app/core/format/format.dart';
import 'package:daraja_app/core/security/safe_launcher.dart';
import 'package:daraja_app/core/theme/app_colors.dart';
import 'package:daraja_app/core/widgets/async_body.dart';
import 'package:daraja_app/core/widgets/page_body.dart';
import 'package:daraja_app/core/widgets/section_card.dart';
import 'package:daraja_app/features/pricing/application/pricing_providers.dart';
import 'package:daraja_app/features/pricing/domain/catalog.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class PricingScreen extends ConsumerWidget {
  const PricingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final catalog = ref.watch(catalogProvider);
    final cart = ref.watch(cartProvider);
    final total = ref.watch(cartTotalProvider);
    return PageBody(
      title: 'Services and pricing',
      subtitle: 'Choose a level for each service. Everything included is listed before you pay.',
      children: [
        AsyncBody<Catalog>(
          value: catalog,
          onRetry: () => ref.invalidate(catalogProvider),
          builder: (data) => Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (data.isPlaceholder) ...[
                const _SampleBanner(),
                const SizedBox(height: 16),
              ],
              for (final category in ServiceCategory.values) ...[
                Semantics(
                  header: true,
                  child: Text(category.label, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
                ),
                const SizedBox(height: 12),
                for (final item in data.inCategory(category))
                  Padding(padding: const EdgeInsets.only(bottom: 12), child: _ItemCard(item: item)),
                const SizedBox(height: 12),
              ],
            ],
          ),
        ),
        if (cart.isNotEmpty)
          SectionCard(
            color: AppColors.mist,
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    '${cart.length} ${cart.length == 1 ? 'service' : 'services'} in your basket'
                    '${total == null ? '' : ' · ${formatKes(total)}'}',
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                ),
                FilledButton(onPressed: () => context.go('/checkout'), child: const Text('Checkout')),
              ],
            ),
          ),
      ],
    );
  }
}

class _SampleBanner extends StatelessWidget {
  const _SampleBanner();

  @override
  Widget build(BuildContext context) {
    return const SectionCard(
      color: AppColors.mist,
      child: Text('These prices are samples for review and may change before launch.'),
    );
  }
}

class _ItemCard extends ConsumerStatefulWidget {
  const _ItemCard({required this.item});

  final CatalogItem item;

  @override
  ConsumerState<_ItemCard> createState() => _ItemCardState();
}

class _ItemCardState extends ConsumerState<_ItemCard> {
  ServiceLevel _level = ServiceLevel.standard;

  @override
  Widget build(BuildContext context) {
    final item = widget.item;
    final offer = item.levels[_level]!;
    final price = offer.priceKes;
    final inCart = ref.watch(cartProvider).any((s) => s.itemId == item.id && s.level == _level);
    final text = Theme.of(context).textTheme;
    return SectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(item.name, style: text.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text(item.description),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final level in ServiceLevel.values)
                ChoiceChip(
                  label: Text(level.label),
                  selected: _level == level,
                  onSelected: (_) => setState(() => _level = level),
                ),
            ],
          ),
          const SizedBox(height: 12),
          for (final line in offer.includes)
            Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.check, size: 18, color: AppColors.success),
                  const SizedBox(width: 8),
                  Expanded(child: Text(line)),
                ],
              ),
            ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Text(
                  price == null ? 'Request a quote' : formatKes(price),
                  style: text.titleLarge?.copyWith(fontWeight: FontWeight.w800),
                ),
              ),
              if (price == null)
                OutlinedButton(
                  onPressed: () => openExternal(Uri.parse('https://daraja.co.ke/contact/')),
                  child: const Text('Ask for a quote'),
                )
              else if (inCart)
                OutlinedButton(
                  onPressed: () => ref.read(cartProvider.notifier).remove(item.id),
                  child: const Text('Remove'),
                )
              else
                FilledButton(
                  onPressed: () => ref.read(cartProvider.notifier).add(CartSelection(itemId: item.id, level: _level)),
                  child: const Text('Add to basket'),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
