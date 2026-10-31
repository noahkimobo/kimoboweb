import 'package:daraja_app/core/theme/app_colors.dart';
import 'package:flutter/material.dart';

abstract final class AppTheme {
  static const String fontFamily = 'PlusJakartaSans';

  static ThemeData light() {
    final scheme = ColorScheme.fromSeed(seedColor: AppColors.blue).copyWith(
      primary: AppColors.ink,
      onPrimary: AppColors.white,
      secondary: AppColors.amber,
      onSecondary: AppColors.ink,
      surface: AppColors.white,
      onSurface: AppColors.ink,
      error: AppColors.danger,
      outline: AppColors.line,
    );
    final base = ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      fontFamily: fontFamily,
      scaffoldBackgroundColor: AppColors.paper,
    );
    final radius = BorderRadius.circular(12);
    return base.copyWith(
      textTheme: base.textTheme.apply(bodyColor: AppColors.body, displayColor: AppColors.ink),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.ink,
        foregroundColor: AppColors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
      ),
      cardTheme: CardThemeData(
        color: AppColors.white,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: radius,
          side: const BorderSide(color: AppColors.line),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.amber,
          foregroundColor: AppColors.ink,
          minimumSize: const Size(48, 48),
          textStyle: const TextStyle(fontWeight: FontWeight.w700),
          shape: RoundedRectangleBorder(borderRadius: radius),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.ink,
          minimumSize: const Size(48, 48),
          side: const BorderSide(color: AppColors.ink),
          shape: RoundedRectangleBorder(borderRadius: radius),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.white,
        border: OutlineInputBorder(borderRadius: radius),
        enabledBorder: OutlineInputBorder(
          borderRadius: radius,
          borderSide: const BorderSide(color: AppColors.muted),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: radius,
          borderSide: const BorderSide(color: AppColors.ink, width: 2),
        ),
      ),
      chipTheme: base.chipTheme.copyWith(
        selectedColor: AppColors.amber,
        labelStyle: const TextStyle(color: AppColors.ink, fontWeight: FontWeight.w600),
        side: const BorderSide(color: AppColors.line),
      ),
      navigationBarTheme: const NavigationBarThemeData(
        backgroundColor: AppColors.white,
        indicatorColor: AppColors.amber,
      ),
      navigationRailTheme: const NavigationRailThemeData(
        backgroundColor: AppColors.white,
        indicatorColor: AppColors.amber,
      ),
    );
  }
}
