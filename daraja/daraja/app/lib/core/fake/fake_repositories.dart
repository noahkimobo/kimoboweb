import 'package:daraja_app/core/fake/fake_database.dart';
import 'package:daraja_app/core/security/masking.dart';
import 'package:daraja_app/core/security/validators.dart';
import 'package:daraja_app/features/auth/domain/app_user.dart';
import 'package:daraja_app/features/auth/domain/auth_repository.dart';
import 'package:daraja_app/features/billing/domain/billing_repository.dart';
import 'package:daraja_app/features/billing/domain/invoice.dart';
import 'package:daraja_app/features/checkout/domain/payment.dart';
import 'package:daraja_app/features/growth/domain/growth.dart';
import 'package:daraja_app/features/growth/domain/growth_repository.dart';
import 'package:daraja_app/features/orders/domain/order.dart';
import 'package:daraja_app/features/orders/domain/orders_repository.dart';
import 'package:daraja_app/features/pricing/domain/catalog.dart';
import 'package:daraja_app/features/pricing/domain/catalog_repository.dart';

Future<void> _latency([int milliseconds = 300]) =>
    Future<void>.delayed(Duration(milliseconds: milliseconds));

class FakeAuthRepository implements AuthRepository {
  FakeAuthRepository(this._db);
  final FakeDatabase _db;

  @override
  Future<AppUser?> restoreSession() async {
    await _latency(150);
    return _db.user;
  }

  /// Accepts any well-formed credentials. The "new" demo email gets an empty
  /// account so the first-run screens can be reviewed; everything else is active.
  @override
  Future<AppUser> signIn({required String email, required String password}) async {
    await _latency(500);
    if (Validators.email(email) != null || Validators.password(password) != null) {
      throw const AuthException('Email or password is incorrect.');
    }
    _db.startSession(email: email, populated: email != FakeDatabase.demoNewEmail);
    return _db.user!;
  }

  @override
  Future<void> signOut() async {
    await _latency(100);
    _db.endSession();
  }
}

class FakeOrdersRepository implements OrdersRepository {
  FakeOrdersRepository(this._db);
  final FakeDatabase _db;

  @override
  Future<List<Order>> list() async {
    await _latency();
    return List.unmodifiable(_db.orders);
  }
}

class FakeGrowthRepository implements GrowthRepository {
  FakeGrowthRepository(this._db);
  final FakeDatabase _db;

  @override
  Future<List<GrowthEntry>> list() async {
    await _latency();
    return List.unmodifiable(_db.growth);
  }

  @override
  Future<GrowthEntry> add({
    required SocialPlatform platform,
    required int followersBefore,
    required int followersAfter,
    required String note,
  }) async {
    await _latency();
    final entry = GrowthEntry(
      id: _db.nextId('g'),
      platform: platform,
      followersBefore: followersBefore,
      followersAfter: followersAfter,
      recordedAt: DateTime.now(),
      note: note,
    );
    _db.growth.insert(0, entry);
    return entry;
  }
}

class FakeBillingRepository implements BillingRepository {
  FakeBillingRepository(this._db);
  final FakeDatabase _db;

  @override
  Future<List<Invoice>> list() async {
    await _latency();
    return List.unmodifiable(_db.invoices);
  }
}

class _PendingPayment {
  _PendingPayment(this.lines);
  final List<OrderLine> lines;
  int polls = 0;
}

/// Mimics the server: it prices the selections itself, then "confirms" payment
/// on the third status check.
class FakePaymentRepository implements PaymentRepository {
  FakePaymentRepository(this._db, this._catalog);
  final FakeDatabase _db;
  final CatalogRepository _catalog;
  final Map<String, _PendingPayment> _pending = {};

  @override
  Future<PaymentRequest> requestStkPush({
    required String phone,
    required List<CartSelection> selections,
  }) async {
    await _latency(600);
    final normalized = Validators.normalizeKenyanMobile(phone);
    if (normalized == null) throw const PaymentException('Enter a valid Kenyan mobile number.');
    if (selections.isEmpty) throw const PaymentException('Your basket is empty.');
    final catalog = await _catalog.load();
    final lines = <OrderLine>[];
    for (final selection in selections) {
      final item = catalog.itemById(selection.itemId);
      final price = catalog.priceOf(selection);
      if (item == null || price == null) {
        throw const PaymentException('One of the services needs a quote and cannot be paid for here.');
      }
      lines.add(OrderLine(itemId: item.id, name: item.name, level: selection.level, priceKes: price));
    }
    final id = _db.nextId('PAY');
    _pending[id] = _PendingPayment(lines);
    return PaymentRequest(
      id: id,
      amountKes: lines.fold(0, (sum, line) => sum + line.priceKes),
      maskedPhone: maskPhone(normalized),
    );
  }

  @override
  Future<PaymentStatus> status(String requestId) async {
    await _latency(800);
    final payment = _pending[requestId];
    if (payment == null) return const PaymentStatus.failed('We could not find that payment.');
    payment.polls++;
    if (payment.polls < 3) return const PaymentStatus.pending();
    _pending.remove(requestId);
    return PaymentStatus.succeeded(_db.placeOrder(payment.lines).id);
  }
}
