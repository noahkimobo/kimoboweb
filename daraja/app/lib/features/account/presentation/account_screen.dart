import 'package:daraja_app/core/widgets/page_body.dart';
import 'package:daraja_app/core/widgets/section_card.dart';
import 'package:daraja_app/features/auth/application/auth_providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AccountScreen extends ConsumerWidget {
  const AccountScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    return PageBody(
      title: 'Account',
      children: [
        SectionCard(
          title: 'Your details',
          child: user == null
              ? const Text('You are signed out.')
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _Row(label: 'Name', value: user.name),
                    _Row(label: 'Business', value: user.businessName),
                    _Row(label: 'Email', value: user.email),
                  ],
                ),
        ),
        const SizedBox(height: 16),
        const SectionCard(
          title: 'Keeping your account safe',
          child: Text(
            'Sign out on shared computers. Daraja will never ask for your M-Pesa PIN, '
            'password or card details in a message. Payments are approved only on your phone.',
          ),
        ),
        const SizedBox(height: 16),
        Align(
          alignment: Alignment.centerLeft,
          child: OutlinedButton.icon(
            onPressed: () => ref.read(authControllerProvider.notifier).signOut(),
            icon: const Icon(Icons.logout),
            label: const Text('Sign out'),
          ),
        ),
      ],
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 100, child: Text(label, style: const TextStyle(fontWeight: FontWeight.w700))),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
