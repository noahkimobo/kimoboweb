import 'package:daraja_app/core/format/format.dart';
import 'package:daraja_app/core/security/validators.dart';
import 'package:daraja_app/core/theme/app_colors.dart';
import 'package:daraja_app/core/widgets/async_body.dart';
import 'package:daraja_app/core/widgets/empty_state.dart';
import 'package:daraja_app/core/widgets/page_body.dart';
import 'package:daraja_app/core/widgets/section_card.dart';
import 'package:daraja_app/core/widgets/sparkline.dart';
import 'package:daraja_app/features/growth/application/growth_providers.dart';
import 'package:daraja_app/features/growth/domain/growth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

String describeChange(GrowthChange change) {
  final sign = change.delta >= 0 ? '+' : '-';
  final percent = change.percent;
  final suffix = percent == null ? '' : ' (${percent.abs().toStringAsFixed(0)}%)';
  return '$sign${formatCount(change.delta.abs())}$suffix';
}

class GrowthScreen extends ConsumerWidget {
  const GrowthScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final growth = ref.watch(growthProvider);
    return PageBody(
      title: 'Growth tracker',
      subtitle: 'Record your followers before and after our work. Your dashboard is built from these numbers.',
      children: [
        const _EntryForm(),
        const SizedBox(height: 20),
        AsyncBody<List<GrowthEntry>>(
          value: growth,
          onRetry: () => ref.invalidate(growthProvider),
          builder: (entries) {
            if (entries.isEmpty) {
              return const EmptyState(
                icon: Icons.trending_up,
                title: 'No numbers yet',
                message: 'Add your follower count above. Start with today\'s number as "before".',
              );
            }
            final summary = GrowthSummary.from(entries);
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SectionCard(
                  title: 'Overall progress',
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        describeChange(summary.total),
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800),
                      ),
                      Text('${formatCount(summary.total.before)} to ${formatCount(summary.total.after)} followers'),
                      const SizedBox(height: 12),
                      Sparkline(
                        values: summary.series,
                        semanticLabel: 'Followers over time, from ${formatCount(summary.series.first)} to ${formatCount(summary.series.last)}',
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                SectionCard(
                  title: 'History',
                  child: Column(
                    children: [
                      for (final entry in entries)
                        ListTile(
                          contentPadding: EdgeInsets.zero,
                          title: Text('${entry.platform.label}: ${formatCount(entry.followersBefore)} to ${formatCount(entry.followersAfter)}'),
                          subtitle: Text([formatDate(entry.recordedAt), if (entry.note.isNotEmpty) entry.note].join(' · ')),
                          trailing: Text(
                            describeChange(GrowthChange(before: entry.followersBefore, after: entry.followersAfter)),
                            style: TextStyle(
                              fontWeight: FontWeight.w800,
                              color: entry.change >= 0 ? AppColors.success : AppColors.danger,
                            ),
                          ),
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

class _EntryForm extends ConsumerStatefulWidget {
  const _EntryForm();

  @override
  ConsumerState<_EntryForm> createState() => _EntryFormState();
}

class _EntryFormState extends ConsumerState<_EntryForm> {
  final _formKey = GlobalKey<FormState>();
  final _before = TextEditingController();
  final _after = TextEditingController();
  final _note = TextEditingController();
  SocialPlatform _platform = SocialPlatform.instagram;
  bool _saving = false;
  String? _message;

  @override
  void dispose() {
    _before.dispose();
    _after.dispose();
    _note.dispose();
    super.dispose();
  }

  GrowthChange? get _preview {
    final before = Validators.parseCount(_before.text);
    final after = Validators.parseCount(_after.text);
    if (before == null || after == null) return null;
    return GrowthChange(before: before, after: after);
  }

  Future<void> _save() async {
    if (_saving || !(_formKey.currentState?.validate() ?? false)) return;
    final before = Validators.parseCount(_before.text);
    final after = Validators.parseCount(_after.text);
    if (before == null || after == null) return;
    setState(() {
      _saving = true;
      _message = null;
    });
    String message;
    try {
      await ref.read(growthProvider.notifier).add(
            platform: _platform,
            followersBefore: before,
            followersAfter: after,
            note: _note.text,
          );
      _before.clear();
      _after.clear();
      _note.clear();
      message = 'Saved. Your dashboard has been updated.';
    } on Object {
      message = 'We could not save that. Please try again.';
    }
    if (!mounted) return;
    setState(() {
      _saving = false;
      _message = message;
    });
  }

  @override
  Widget build(BuildContext context) {
    final preview = _preview;
    return SectionCard(
      title: 'Add your numbers',
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final platform in SocialPlatform.values)
                  ChoiceChip(
                    label: Text(platform.label),
                    selected: _platform == platform,
                    onSelected: (_) => setState(() => _platform = platform),
                  ),
              ],
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 16,
              runSpacing: 16,
              children: [
                _CountField(controller: _before, label: 'Followers before', onChanged: () => setState(() {})),
                _CountField(controller: _after, label: 'Followers after', onChanged: () => setState(() {})),
              ],
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _note,
              decoration: const InputDecoration(labelText: 'Note (optional)'),
              maxLength: Validators.maxNoteLength,
              validator: Validators.note,
            ),
            if (preview != null) ...[
              const SizedBox(height: 8),
              Text('Change: ${describeChange(preview)}', style: const TextStyle(fontWeight: FontWeight.w700)),
            ],
            if (_message != null) ...[
              const SizedBox(height: 8),
              Semantics(liveRegion: true, child: Text(_message!)),
            ],
            const SizedBox(height: 12),
            FilledButton(
              onPressed: _saving ? null : _save,
              child: _saving
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
                  : const Text('Save numbers'),
            ),
          ],
        ),
      ),
    );
  }
}

class _CountField extends StatelessWidget {
  const _CountField({required this.controller, required this.label, required this.onChanged});

  final TextEditingController controller;
  final String label;
  final VoidCallback onChanged;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 220,
      child: TextFormField(
        controller: controller,
        decoration: InputDecoration(labelText: label),
        keyboardType: TextInputType.number,
        inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(10)],
        validator: Validators.followerCount,
        onChanged: (_) => onChanged(),
      ),
    );
  }
}
