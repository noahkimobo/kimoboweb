import 'package:daraja_app/core/config/providers.dart';
import 'package:daraja_app/core/fake/fake_database.dart';
import 'package:daraja_app/core/security/safe_launcher.dart';
import 'package:daraja_app/core/security/validators.dart';
import 'package:daraja_app/core/theme/app_colors.dart';
import 'package:daraja_app/core/widgets/logo.dart';
import 'package:daraja_app/core/widgets/section_card.dart';
import 'package:daraja_app/features/auth/application/auth_providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// The signed-out screen. It also explains what the account is for.
class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _busy = false;
  bool _showPassword = false;
  String? _error;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit({String? email, String? password}) async {
    if (_busy) return;
    final useForm = email == null;
    if (useForm && !(_formKey.currentState?.validate() ?? false)) return;
    setState(() {
      _busy = true;
      _error = null;
    });
    String? error;
    try {
      error = await ref.read(authControllerProvider.notifier).signIn(
            email: email ?? _email.text,
            password: password ?? _password.text,
          );
    } on Object {
      error = 'Something went wrong. Please try again.';
    }
    if (!mounted) return;
    setState(() {
      _busy = false;
      _error = error;
      // Never keep a password in memory longer than needed.
      if (error != null) _password.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    final wide = MediaQuery.sizeOf(context).width >= 900;
    final form = _buildForm(context);
    final info = _buildInfo(context);
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 1000),
              child: wide
                  ? Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [Expanded(child: info), const SizedBox(width: 40), SizedBox(width: 400, child: form)],
                    )
                  : Column(children: [form, const SizedBox(height: 32), info]),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildForm(BuildContext context) {
    final fake = ref.watch(appConfigProvider).useFakeBackend;
    return SectionCard(
      child: AutofillGroup(
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(color: AppColors.ink, borderRadius: BorderRadius.circular(10)),
                    child: const DarajaMark(size: 28),
                  ),
                  const SizedBox(width: 12),
                  Text('Daraja', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
                ],
              ),
              const SizedBox(height: 20),
              Semantics(
                header: true,
                child: Text('Sign in to your account', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _email,
                decoration: const InputDecoration(labelText: 'Email'),
                keyboardType: TextInputType.emailAddress,
                autofillHints: const [AutofillHints.username],
                textInputAction: TextInputAction.next,
                inputFormatters: [LengthLimitingTextInputFormatter(254)],
                validator: Validators.email,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _password,
                decoration: InputDecoration(
                  labelText: 'Password',
                  suffixIcon: IconButton(
                    tooltip: _showPassword ? 'Hide password' : 'Show password',
                    icon: Icon(_showPassword ? Icons.visibility_off : Icons.visibility),
                    onPressed: () => setState(() => _showPassword = !_showPassword),
                  ),
                ),
                obscureText: !_showPassword,
                autofillHints: const [AutofillHints.password],
                textInputAction: TextInputAction.done,
                inputFormatters: [LengthLimitingTextInputFormatter(Validators.maxPasswordLength)],
                validator: Validators.password,
                onFieldSubmitted: (_) => _submit(),
              ),
              if (_error != null) ...[
                const SizedBox(height: 12),
                Semantics(
                  liveRegion: true,
                  child: Text(_error!, style: const TextStyle(color: AppColors.danger, fontWeight: FontWeight.w600)),
                ),
              ],
              const SizedBox(height: 16),
              FilledButton(
                onPressed: _busy ? null : _submit,
                child: _busy
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
                    : const Text('Sign in'),
              ),
              if (fake) ...[
                const SizedBox(height: 20),
                const Divider(),
                const SizedBox(height: 8),
                Text('Demo mode (no real accounts)', style: Theme.of(context).textTheme.labelLarge),
                const SizedBox(height: 8),
                OutlinedButton(
                  onPressed: _busy ? null : () => _submit(email: FakeDatabase.demoNewEmail, password: 'demo-password'),
                  child: const Text('Preview a new account'),
                ),
                const SizedBox(height: 8),
                OutlinedButton(
                  onPressed: _busy ? null : () => _submit(email: FakeDatabase.demoActiveEmail, password: 'demo-password'),
                  child: const Text('Preview an active account'),
                ),
              ],
              const SizedBox(height: 16),
              Text(
                'Daraja will never ask for your M-Pesa PIN or card details by message or email.',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfo(BuildContext context) {
    final text = Theme.of(context).textTheme;
    const points = [
      (Icons.receipt_long_outlined, 'My orders', 'Follow every design, setup or campaign from payment to delivery.'),
      (Icons.trending_up, 'Growth tracker', 'Record followers before and after, and see your progress on one dashboard.'),
      (Icons.sell_outlined, 'Clear pricing', 'Pick Basic, Standard or Premium for each service and see what is included.'),
      (Icons.payments_outlined, 'Pay with M-Pesa', 'Approve payment on your phone and keep every invoice in one place.'),
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('CLIENT PORTAL', style: text.labelLarge?.copyWith(color: AppColors.blue, fontWeight: FontWeight.w800, letterSpacing: 1.2)),
        const SizedBox(height: 8),
        Semantics(
          header: true,
          child: Text('Your business, online and growing.', style: text.displaySmall?.copyWith(fontWeight: FontWeight.w800)),
        ),
        const SizedBox(height: 12),
        Text('Sign in to manage your orders, track your growth and pay for services.', style: text.bodyLarge),
        const SizedBox(height: 24),
        for (final point in points)
          Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(point.$1, color: AppColors.blue),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(point.$2, style: text.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
                      Text(point.$3),
                    ],
                  ),
                ),
              ],
            ),
          ),
        const SizedBox(height: 8),
        Text('Not a client yet?', style: text.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
        TextButton(
          onPressed: () => openExternal(Uri.parse(ref.read(appConfigProvider).siteUrl)),
          child: const Text('Visit daraja.co.ke'),
        ),
      ],
    );
  }
}
