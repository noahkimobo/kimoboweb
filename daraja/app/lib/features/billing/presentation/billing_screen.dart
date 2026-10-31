import 'package:daraja_app/core/format/format.dart';
import 'package:daraja_app/core/widgets/async_body.dart';
import 'package:daraja_app/core/widgets/empty_state.dart';
import 'package:daraja_app/core/widgets/page_body.dart';
import 'package:daraja_app/core/widgets/section_card.dart';
import 'package:daraja_app/core/widgets/status_chip.dart';
import 'package:daraja_app/features/billing/application/billing_providers.dart';
import 'package:daraja_app/features/billing/domain/invoice.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class BillingScreen extends ConsumerWidget {
  const BillingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final invoices = ref.watch(invoicesProvider);
    return PageBody(
      title: 'Billing',
      subtitle: 'Your invoices and M-Pesa receipts.',
      children: [
        AsyncBody<List<Invoice>>(
          value: invoices,
          onRetry: () => ref.invalidate(invoicesProvider),
          builder: (all) {
            if (all.isEmpty) {
              return EmptyState(
                icon: Icons.payments_outlined,
                title: 'No invoices yet',
                message: 'An invoice is created for every order you pay for.',
                actionLabel: 'Browse services',
                onAction: () => context.go('/services'),
              );
            }
            final paid = all.where((i) => i.status == InvoiceStatus.paid).fold<int>(0, (s, i) => s + i.amountKes);
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SectionCard(
                  title: 'Total paid',
                  child: Text(formatKes(paid), style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800)),
                ),
                const SizedBox(height: 16),
                for (final invoice in all)
                  Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                      title: Text('${invoice.id} · ${formatKes(invoice.amountKes)}', style: const TextStyle(fontWeight: FontWeight.w700)),
                      subtitle: Text([
                        formatDate(invoice.issuedAt),
                        'Order ${invoice.orderId}',
                        if (invoice.mpesaReceipt != null) 'Receipt ${invoice.mpesaReceipt}',
                      ].join(' · ')),
                      trailing: StatusChip(label: invoice.status.label, emphasis: invoice.status == InvoiceStatus.due),
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
