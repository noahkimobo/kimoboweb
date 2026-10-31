import 'package:daraja_app/core/config/app_config.dart';
import 'package:daraja_app/core/fake/fake_database.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final appConfigProvider = Provider<AppConfig>((ref) => AppConfig.current);

/// In-memory data used while the real API does not exist yet.
final fakeDatabaseProvider = Provider<FakeDatabase>((ref) => FakeDatabase());

const String backendMissingMessage =
    'No API client is wired up yet. Implement the repositories described in '
    'docs/BACKEND_CONTRACT.md or run with USE_FAKE_BACKEND=true.';
