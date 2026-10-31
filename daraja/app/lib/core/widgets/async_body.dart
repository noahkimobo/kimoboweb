import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Renders an [AsyncValue] with a spinner, a safe error message, or the data.
/// The raw error is never shown to the user.
class AsyncBody<T> extends StatelessWidget {
  const AsyncBody({required this.value, required this.builder, this.onRetry, super.key});

  final AsyncValue<T> value;
  final Widget Function(T data) builder;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    return value.when(
      data: builder,
      loading: () => const Padding(
        padding: EdgeInsets.all(40),
        child: Center(child: CircularProgressIndicator()),
      ),
      error: (_, __) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const Text('Something went wrong. Please try again.'),
            if (onRetry != null) ...[
              const SizedBox(height: 12),
              OutlinedButton(onPressed: onRetry, child: const Text('Try again')),
            ],
          ],
        ),
      ),
    );
  }
}
