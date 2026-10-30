-- CreateTable
CREATE TABLE `roles` (
    `id` CHAR(36) NOT NULL,
    `nama_role` VARCHAR(50) NOT NULL,
    `deskripsi` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `role_id` CHAR(36) NOT NULL,
    `nama_lengkap` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `foto_profil` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategori_edukasi` (
    `id` CHAR(36) NOT NULL,
    `nama_kategori` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `kategori_edukasi_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `edukasi` (
    `id` CHAR(36) NOT NULL,
    `kategori_edukasi_id` CHAR(36) NOT NULL,
    `admin_id` CHAR(36) NOT NULL,
    `judul` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `isi_konten` LONGTEXT NOT NULL,
    `status_publikasi` ENUM('Draft', 'Published') NOT NULL DEFAULT 'Draft',
    `view_count` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `edukasi_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media_konten` (
    `id` CHAR(36) NOT NULL,
    `edukasi_id` CHAR(36) NOT NULL,
    `tipe_media` ENUM('Infografis', 'Audio', 'Video', 'PDF', 'Gambar') NOT NULL,
    `url_file` VARCHAR(255) NOT NULL,
    `keterangan` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resep` (
    `id` CHAR(36) NOT NULL,
    `admin_id` CHAR(36) NOT NULL,
    `judul_resep` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(200) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `porsi` INTEGER NOT NULL,
    `waktu_masak_menit` INTEGER NOT NULL,
    `tingkat_kesulitan` ENUM('Mudah', 'Sedang', 'Sulit') NOT NULL,
    `informasi_gizi` TEXT NULL,
    `foto_resep` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `resep_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bahan_resep` (
    `id` CHAR(36) NOT NULL,
    `resep_id` CHAR(36) NOT NULL,
    `nama_bahan` VARCHAR(150) NOT NULL,
    `takaran` VARCHAR(100) NOT NULL,
    `catatan_halal` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `langkah_resep` (
    `id` CHAR(36) NOT NULL,
    `resep_id` CHAR(36) NOT NULL,
    `nomor_urutan` INTEGER NOT NULL,
    `instruksi` TEXT NOT NULL,
    `foto_step` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategori_kuliner` (
    `id` CHAR(36) NOT NULL,
    `nama_kategori` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restoran` (
    `id` CHAR(36) NOT NULL,
    `kategori_kuliner_id` CHAR(36) NOT NULL,
    `admin_id` CHAR(36) NOT NULL,
    `nama_restoran` VARCHAR(150) NOT NULL,
    `alamat` TEXT NOT NULL,
    `kecamatan` VARCHAR(100) NOT NULL,
    `latitude` DECIMAL(10, 8) NULL,
    `longitude` DECIMAL(11, 8) NULL,
    `nomor_sertifikat_halal` VARCHAR(100) NULL,
    `status_sertifikasi` ENUM('Terverifikasi BPJPH', 'Self Declare', 'Proses') NOT NULL,
    `jam_operasional` VARCHAR(100) NOT NULL,
    `kisaran_harga` VARCHAR(100) NOT NULL,
    `foto_utama` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wisata_halal` (
    `id` CHAR(36) NOT NULL,
    `admin_id` CHAR(36) NOT NULL,
    `nama_destinasi` VARCHAR(150) NOT NULL,
    `kategori_wisata` VARCHAR(100) NOT NULL,
    `lokasi` TEXT NOT NULL,
    `kecamatan` VARCHAR(100) NOT NULL,
    `latitude` DECIMAL(10, 8) NULL,
    `longitude` DECIMAL(11, 8) NULL,
    `deskripsi` TEXT NOT NULL,
    `harga_tiket` VARCHAR(100) NOT NULL,
    `jam_buka` VARCHAR(100) NOT NULL,
    `foto_destinasi` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fasilitas_halal` (
    `id` CHAR(36) NOT NULL,
    `wisata_id` CHAR(36) NOT NULL,
    `jenis_fasilitas` VARCHAR(100) NOT NULL,
    `jarak_meter` INTEGER NULL,
    `keterangan` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ulasan_restoran` (
    `id` CHAR(36) NOT NULL,
    `restoran_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `rating` TINYINT NOT NULL,
    `komentar` TEXT NOT NULL,
    `foto_ulasan` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `komentar` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `tipe_entitas` ENUM('Edukasi', 'Resep') NOT NULL,
    `entitas_id` CHAR(36) NOT NULL,
    `isi_komentar` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorit` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `tipe_entitas` ENUM('Edukasi', 'Resep', 'Restoran', 'Wisata') NOT NULL,
    `entitas_id` CHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengaturan_konten` (
    `id` CHAR(36) NOT NULL,
    `admin_id` CHAR(36) NOT NULL,
    `nama_setting` VARCHAR(100) NOT NULL,
    `nilai_setting` TEXT NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_aktivitas_admin` (
    `id` CHAR(36) NOT NULL,
    `admin_id` CHAR(36) NOT NULL,
    `aksi` ENUM('Create', 'Update', 'Delete') NOT NULL,
    `modul_target` VARCHAR(100) NOT NULL,
    `keterangan` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `edukasi` ADD CONSTRAINT `edukasi_kategori_edukasi_id_fkey` FOREIGN KEY (`kategori_edukasi_id`) REFERENCES `kategori_edukasi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `edukasi` ADD CONSTRAINT `edukasi_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `media_konten` ADD CONSTRAINT `media_konten_edukasi_id_fkey` FOREIGN KEY (`edukasi_id`) REFERENCES `edukasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resep` ADD CONSTRAINT `resep_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bahan_resep` ADD CONSTRAINT `bahan_resep_resep_id_fkey` FOREIGN KEY (`resep_id`) REFERENCES `resep`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `langkah_resep` ADD CONSTRAINT `langkah_resep_resep_id_fkey` FOREIGN KEY (`resep_id`) REFERENCES `resep`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restoran` ADD CONSTRAINT `restoran_kategori_kuliner_id_fkey` FOREIGN KEY (`kategori_kuliner_id`) REFERENCES `kategori_kuliner`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restoran` ADD CONSTRAINT `restoran_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wisata_halal` ADD CONSTRAINT `wisata_halal_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fasilitas_halal` ADD CONSTRAINT `fasilitas_halal_wisata_id_fkey` FOREIGN KEY (`wisata_id`) REFERENCES `wisata_halal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ulasan_restoran` ADD CONSTRAINT `ulasan_restoran_restoran_id_fkey` FOREIGN KEY (`restoran_id`) REFERENCES `restoran`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ulasan_restoran` ADD CONSTRAINT `ulasan_restoran_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `komentar` ADD CONSTRAINT `komentar_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorit` ADD CONSTRAINT `favorit_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengaturan_konten` ADD CONSTRAINT `pengaturan_konten_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_aktivitas_admin` ADD CONSTRAINT `log_aktivitas_admin_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
