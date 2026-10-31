import 'package:daraja_app/features/pricing/domain/catalog.dart';

abstract interface class CatalogRepository {
  Future<Catalog> load();
}
