import 'package:daraja_app/app.dart';
import 'package:daraja_app/core/config/app_config.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_web_plugins/url_strategy.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  usePathUrlStrategy();
  final problem = AppConfig.current.validate();
  if (problem != null) {
    runApp(ConfigErrorApp(message: problem));
    return;
  }
  runApp(const ProviderScope(child: DarajaApp()));
}
