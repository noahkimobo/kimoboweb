import 'package:daraja_app/core/routing/app_shell.dart';
import 'package:daraja_app/features/account/presentation/account_screen.dart';
import 'package:daraja_app/features/auth/application/auth_providers.dart';
import 'package:daraja_app/features/auth/presentation/login_screen.dart';
import 'package:daraja_app/features/billing/presentation/billing_screen.dart';
import 'package:daraja_app/features/checkout/presentation/checkout_screen.dart';
import 'package:daraja_app/features/checkout/presentation/confirmed_screen.dart';
import 'package:daraja_app/features/dashboard/presentation/dashboard_screen.dart';
import 'package:daraja_app/features/growth/presentation/growth_screen.dart';
import 'package:daraja_app/features/orders/presentation/order_detail_screen.dart';
import 'package:daraja_app/features/orders/presentation/orders_screen.dart';
import 'package:daraja_app/features/pricing/presentation/pricing_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

/// Decides where a visitor may go. Pure so it can be unit tested.
/// Returns a redirect path, or null to stay where they are.
String? guardRedirect({required bool loading, required bool signedIn, required String location}) {
  if (loading) return location == '/loading' ? null : '/loading';
  if (!signedIn) return location == '/login' ? null : '/login';
  if (location == '/login' || location == '/loading' || location == '/') return '/dashboard';
  return null;
}

final routerProvider = Provider<GoRouter>((ref) {
  final refresh = ValueNotifier<int>(0);
  ref.onDispose(refresh.dispose);
  ref.listen(authControllerProvider, (_, __) => refresh.value++);

  final router = GoRouter(
    initialLocation: '/dashboard',
    refreshListenable: refresh,
    redirect: (context, state) {
      final auth = ref.read(authControllerProvider);
      return guardRedirect(
        loading: auth.isLoading,
        signedIn: auth.valueOrNull != null,
        location: state.uri.path,
      );
    },
    errorBuilder: (context, state) => const _NotFoundScreen(),
    routes: [
      GoRoute(path: '/loading', builder: (_, __) => const _LoadingScreen()),
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      ShellRoute(
        builder: (context, state, child) => AppShell(location: state.uri.path, child: child),
        routes: [
          GoRoute(path: '/dashboard', builder: (_, __) => const DashboardScreen()),
          GoRoute(
            path: '/orders',
            builder: (_, __) => const OrdersScreen(),
            routes: [
              GoRoute(
                path: ':id',
                builder: (_, state) => OrderDetailScreen(orderId: state.pathParameters['id'] ?? ''),
              ),
            ],
          ),
          GoRoute(path: '/growth', builder: (_, __) => const GrowthScreen()),
          GoRoute(path: '/services', builder: (_, __) => const PricingScreen()),
          GoRoute(path: '/checkout', builder: (_, __) => const CheckoutScreen()),
          GoRoute(
            path: '/confirmed/:id',
            builder: (_, state) => ConfirmedScreen(orderId: state.pathParameters['id'] ?? ''),
          ),
          GoRoute(path: '/billing', builder: (_, __) => const BillingScreen()),
          GoRoute(path: '/account', builder: (_, __) => const AccountScreen()),
        ],
      ),
    ],
  );
  ref.onDispose(router.dispose);
  return router;
});

class _LoadingScreen extends StatelessWidget {
  const _LoadingScreen();

  @override
  Widget build(BuildContext context) => const Scaffold(body: Center(child: CircularProgressIndicator()));
}

class _NotFoundScreen extends StatelessWidget {
  const _NotFoundScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('That page is not here.', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 16),
            FilledButton(onPressed: () => context.go('/dashboard'), child: const Text('Go to dashboard')),
          ],
        ),
      ),
    );
  }
}
