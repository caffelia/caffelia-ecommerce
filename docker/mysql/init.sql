CREATE DATABASE IF NOT EXISTS cafelia_ecommerce
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Grant permissions to bagisto user
GRANT ALL PRIVILEGES ON cafelia_ecommerce.* TO 'bagisto'@'%';
FLUSH PRIVILEGES;
