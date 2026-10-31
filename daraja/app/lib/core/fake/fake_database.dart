import 'package:daraja_app/features/auth/domain/app_user.dart';
import 'package:daraja_app/features/billing/domain/invoice.dart';
import 'package:daraja_app/features/growth/domain/growth.dart';
import 'package:daraja_app/features/orders/domain/order.dart';
import 'package:daraja_app/features/pricing/domain/catalog.dart';

/// In-memory stand-in for the server, used until the real API exists.
/// Nothing here persists across a page reload.
class FakeDatabase {
  static const String demoNewEmail = 'new@demo.daraja.co.ke';
  static const String demoActiveEmail = 'active@demo.daraja.co.ke';

  AppUser? user;
  final List<Order> orders = [];
  final List<GrowthEntry> growth = [];
  final List<Invoice> invoices = [];
  int _sequence = 1040;

  String nextId(String prefix) => '$prefix-${_sequence++}';

  /// Signs in as a brand-new account (no data) or an active one (with history).
  void startSession({required String email, required bool populated}) {
    orders.clear();
    growth.clear();
    invoices.clear();
    user = AppUser(
      id: populated ? 'usr-active' : 'usr-new',
      name: populated ? 'Amina Wanjiru' : 'Brian Otieno',
      email: email,
      businessName: populated ? 'Amina Fresh Produce' : 'Otieno Hardware',
    );
    if (populated) _seedHistory();
  }

  void endSession() {
    user = null;
    orders.clear();
    growth.clear();
    invoices.clear();
  }

  Order placeOrder(List<OrderLine> lines) {
    final now = DateTime.now();
    final order = Order(
      id: nextId('DJ'),
      createdAt: now,
      status: OrderStatus.placed,
      lines: List.unmodifiable(lines),
      events: [
        OrderEvent(at: now, title: 'Payment received', detail: 'Paid with M-Pesa.'),
        OrderEvent(at: now, title: 'Order placed', detail: 'We will contact you to start.'),
      ],
    );
    orders.insert(0, order);
    invoices.insert(
      0,
      Invoice(
        id: nextId('INV'),
        orderId: order.id,
        issuedAt: now,
        amountKes: order.totalKes,
        status: InvoiceStatus.paid,
        mpesaReceipt: 'SAMPLE${now.millisecondsSinceEpoch % 100000}',
      ),
    );
    return order;
  }

  void _seedHistory() {
    final now = DateTime.now();
    DateTime ago(int days) => now.subtract(Duration(days: days));

    orders.addAll([
      Order(
        id: 'DJ-1031',
        createdAt: ago(3),
        status: OrderStatus.inProgress,
        lines: const [
          OrderLine(itemId: 'gd-social-pack', name: 'Social post pack', level: ServiceLevel.standard, priceKes: 6000),
        ],
        events: [
          OrderEvent(at: ago(3), title: 'Order placed'),
          OrderEvent(at: ago(2), title: 'Design started', detail: 'First drafts are on the way.'),
        ],
      ),
      Order(
        id: 'DJ-1024',
        createdAt: ago(24),
        status: OrderStatus.delivered,
        lines: const [
          OrderLine(itemId: 'gd-logo', name: 'Logo design', level: ServiceLevel.standard, priceKes: 8000),
          OrderLine(itemId: 'gd-flyer', name: 'Flyer or poster', level: ServiceLevel.basic, priceKes: 1500),
        ],
        events: [
          OrderEvent(at: ago(24), title: 'Order placed'),
          OrderEvent(at: ago(20), title: 'Concepts shared'),
          OrderEvent(at: ago(17), title: 'Delivered', detail: 'Final files sent by email.'),
        ],
      ),
    ]);
    invoices.addAll([
      Invoice(id: 'INV-1032', orderId: 'DJ-1031', issuedAt: ago(3), amountKes: 6000, status: InvoiceStatus.paid, mpesaReceipt: 'SAMPLE0001'),
      Invoice(id: 'INV-1025', orderId: 'DJ-1024', issuedAt: ago(24), amountKes: 9500, status: InvoiceStatus.paid, mpesaReceipt: 'SAMPLE0002'),
    ]);
    growth.addAll([
      GrowthEntry(id: 'g-3', platform: SocialPlatform.instagram, followersBefore: 1950, followersAfter: 2640, recordedAt: ago(4), note: 'After the October campaign'),
      GrowthEntry(id: 'g-2', platform: SocialPlatform.tiktok, followersBefore: 300, followersAfter: 780, recordedAt: ago(14)),
      GrowthEntry(id: 'g-1', platform: SocialPlatform.instagram, followersBefore: 1200, followersAfter: 1950, recordedAt: ago(30), note: 'Starting numbers'),
    ]);
  }
}
