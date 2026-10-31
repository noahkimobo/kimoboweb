import 'dart:async';

import 'package:daraja_app/core/format/format.dart';
import 'package:daraja_app/core/security/validators.dart';
import 'package:daraja_app/core/widgets/async_body.dart';
import 'package:daraja_app/core/widgets/empty_state.dart';
import 'package:daraja_app/core/widgets/page_body.dart';
import 'package:daraja_app/core/widgets/section_card.dart';
import 'package:daraja_app/features/billing/application/billing_providers.dart';
import 'package:daraja_app/features/checkout/application/checkout_providers.dart';
import 'package:daraja_app/features/checkout/domain/payment.dart';
import 'package:daraja_app/features/orders/application/orders_providers.dart';
import 'package:daraja_app/features/pricing/application/pricing_providers.dart';
import 'package:daraja_app/features/pricing/domain/catalog.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

enum _Phase { editing, requesting, waitingForPin }

class CheckoutScreen extends ConsumerStatefulWidget {
  const CheckoutScreen({super.key});

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  static const Duration _pollEvery = Duration(seconds: 3);
  static const int _maxPolls = 40;

  final _formKey = GlobalKey<FormState>();
  final _phone = TextEditingController();
  _Phase _phase = _Phase.editing;
  PaymentRequest? _request;
  String? _error;

  @override
  void dispose() {
    _phone.dispose();
    super.dispose();
  }

  Future<void> _pay(List<CartSelection> selections) async {
    if (_phase != _Phase.editing || !(_formKey.currentState?.validate() ?? false)) return;
    final repository = ref.read(paymentRepositoryProvider);
    setState(() {
      _phase = _Phase.requesting;
      _error = null;
    });
    try {
      final request = await repository.requestStkPush(phone: _phone.text, selections: selections);
      if (!mounted) return;
      setState(() {
        _request = request;
        _phase = _Phase.waitingForPin;
      });
      await _poll(repository, request.id);
    } on PaymentException catch (error) {
      _fail(error.message);
    } on Object {
      _fail('Something went wrong. You have not been charged. Please try again.');
    }
  }

  Future<void> _poll(PaymentRepository repository, String requestId) async {
    for (var attempt = 0; attempt < _maxPolls; attempt++) {
      if (!mounted) return;
      final status = await repository.status(requestId);
      if (!mounted) return;
      switch (status.state) {
        case PaymentState.succeeded:
          ref.read(cartProvider.notifier).clear();
          ref.invalidate(ordersProvider);
          ref.invalidate(invoicesProvider);
          context.go('/confirmed/${Uri.encodeComponent(status.orderId ?? '')}');
          return;
        case PaymentState.failed:
          _fail(status.message ?? 'The payment was not completed.');
          return;
        case PaymentState.pending:
          await Future<void>.delayed(_pollEvery);
      }
    }
    _fail('We did not get a confirmation. If money left your account, contact us with your M-Pesa message.');
  }

  void _fail(String message) {
    if (!mounted) return;
    setState(() {
      _phase = _Phase.editing;
      _request = null;
      _error = message;
    });
  }

  @override
  Widget build(BuildContext context) {
    final cart = ref.watch(cartProvider);
    final catalog = ref.watch(catalogProvider);
    final total = ref.watch(cartTotalProvider);
    return PageBody(
      title: 'Checkout',
      subtitle: 'Review your basket, then approve the M-Pesa prompt on your phone.',
      children: [
        if (cart.isEmpty && _phase == _Phase.editing)
          EmptyState(
            icon: Icons.shopping_basket_outlined,
            title: 'Your basket is empty',
            message: 'Pick a service and level to get started.',
            actionLabel: 'Browse services',
            onAction: () => context.go('/services'),
          )
        else
          AsyncBody<Catalog>(
            value: catalog,
            onRetry: () => ref.invalidate(catalogProvider),
            builder: (data) => Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SectionCard(
                  title: 'Your basket',
                  child: Column(
                    children: [
                      for (final selection in cart)
                        ListTile(
                          contentPadding: EdgeInsets.zero,
                          title: Text(data.itemById(selection.itemId)?.name ?? selection.itemId),
                          subtitle: Text(selection.level.label),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(formatKes(data.priceOf(selection) ?? 0)),
                              IconButton(
                                tooltip: 'Remove',
                                icon: const Icon(Icons.close),
                                onPressed: _phase == _Phase.editing
                                    ? () => ref.read(cartProvider.notifier).remove(selection.itemId)
                                    : null,
                              ),
                            ],
                          ),
                        ),
                      const Divider(),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Total', style: TextStyle(fontWeight: FontWeight.w800)),
                          Text(formatKes(total ?? 0), style: const TextStyle(fontWeight: FontWeight.w800)),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                SectionCard(
                  title: 'Pay with M-Pesa',
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        TextFormField(
                          controller: _phone,
                          enabled: _phase == _Phase.editing,
                          decoration: const InputDecoration(labelText: 'M-Pesa phone number', hintText: '0712 345 678'),
                          keyboardType: TextInputType.phone,
                          autofillHints: const [AutofillHints.telephoneNumber],
                          inputFormatters: [
                            FilteringTextInputFormatter.allow(RegExp(r'[0-9+\s\-]')),
                            LengthLimitingTextInputFormatter(16),
                          ],
                          validator: Validators.mpesaPhone,
                        ),
                        const SizedBox(height: 8),
                        const Text('You will get a prompt on your phone. Enter your M-Pesa PIN there. Daraja never sees or asks for your PIN.'),
                        if (_phase == _Phase.waitingForPin && _request != null) ...[
                          const SizedBox(height: 12),
                          Semantics(
                            liveRegion: true,
                            child: Text(
                              'Check ${_request!.maskedPhone} and approve ${formatKes(_request!.amountKes)}. Waiting for confirmation...',
                              style: const TextStyle(fontWeight: FontWeight.w700),
                            ),
                          ),
                        ],
                        if (_error != null) ...[
                          const SizedBox(height: 12),
                          Semantics(
                            liveRegion: true,
                            child: Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error, fontWeight: FontWeight.w600)),
                          ),
                        ],
                        const SizedBox(height: 16),
                        FilledButton(
                          onPressed: _phase == _Phase.editing && cart.isNotEmpty ? () => _pay(cart) : null,
                          child: _phase == _Phase.editing
                              ? Text('Pay ${formatKes(total ?? 0)}')
                              : const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2)),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
