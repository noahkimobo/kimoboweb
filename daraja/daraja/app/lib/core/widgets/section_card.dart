import 'package:flutter/material.dart';

class SectionCard extends StatelessWidget {
  const SectionCard({required this.child, this.title, this.color, super.key});

  final String? title;
  final Color? color;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: color,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (title != null) ...[
              Semantics(
                header: true,
                child: Text(
                  title!,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                ),
              ),
              const SizedBox(height: 12),
            ],
            child,
          ],
        ),
      ),
    );
  }
}
