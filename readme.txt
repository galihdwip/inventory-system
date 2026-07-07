========================================================================
MULTI-TENANT E-COMMERCE INVENTORY SYSTEM
========================================================================

------------------------------------------------------------------------
1. MULTI-TENANT TETAPI DALAM SATU DATABASE
------------------------------------------------------------------------
Context & Requirements:
- Setiap tenant mempunyai product, product variant, stock, dan warehouses
 masing masing, dan setiap tenant id tidak bisa melihat data tenant lainnya


Agar data setiap tenant tetap aman dan tidak tercampur, 
saya menggunakan TenantGuard.

Cara kerjanya sederhana:

1. Setiap request yang masuk, baik melalui REST API maupun GraphQL, 
akan terlebih dahulu melewati TenantGuard.
2. TenantGuard akan mengambil nilai x-tenant-id dari header request.
3. Nilai tersebut kemudian disimpan ke dalam object request sehingga bisa 
digunakan selama proses request berlangsung.
4. Saat aplikasi melakukan query ke database, semua query akan 
otomatis menambahkan filter berdasarkan tenantId.

------------------------------------------------------------------------
2. MULTI-WAREHOUSE STOCK TRACKING
------------------------------------------------------------------------
Context & Requirements:
- Bisa melihat stock berdasarkan warehouse id yang didalamnya mempunyai tenantId, 
tenantId bisa mempunyai banyak warehouse.

- Stock bisa dicek berdasarkan warehouseId dan productVariantId

Implementation Details:
- Join Table: Table `Stock` berelasi ke  `ProductVariant` dan ke `Warehouse`, 
  untuk mengisi atau track  `quantity` kolom.
- Memastikan bahwa productVariantId dengan WarehouseId yang sama tidak mempunyai
  lebih dari satu kolom stock.


========================================================================
