import mysql from "mysql2/promise";

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

export const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Nayan@1323",
  database: process.env.DB_NAME || "kanakku_inventory", // ✅ DB selected here
  port: parseInt(process.env.DB_PORT || "3306"),
};

// Create connection pool for better performance
export const createConnection = () => {
  return mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000, // ✅ correct option for MySQL2
  });
};

export const pool = createConnection();

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
};

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    // Ensure target database exists before using the pool
    const bootstrap = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
    });
    await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await bootstrap.end();

    const connection = await pool.getConnection();

    // ✅ No CREATE DATABASE or USE needed — we are already in `dbConfig.database`
    await createTables(connection);

    console.log("✅ Database initialized successfully");
    connection.release();
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
};

const createTables = async (connection: mysql.PoolConnection) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE,
      phone VARCHAR(50),
      company VARCHAR(255),
      address TEXT,
      city VARCHAR(100),
      state VARCHAR(100),
      country VARCHAR(100), 
      postal_code VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

   await connection.query(`
    CREATE TABLE IF NOT EXISTS profile (
      id INT AUTO_INCREMENT PRIMARY KEY,
      -- Columns intentionally minimal here; we'll ensure missing columns below for drift safety
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   )`);

  // Drift-safety: ensure required columns exist on profile table
  const [colCheck] = await connection.query<mysql.RowDataPacket[]>(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'profile' AND COLUMN_NAME = 'user_id'`,
    [dbConfig.database],
  );
  if ((colCheck as any[]).length === 0) {
    // Add user_id column and link to users
    await connection.query(
      `ALTER TABLE profile ADD COLUMN user_id INT NOT NULL UNIQUE AFTER id`,
    );
  }
  // Ensure auxiliary columns exist (idempotent guards)
  const ensureColumn = async (name: string, ddl: string) => {
    const [exists] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'profile' AND COLUMN_NAME = ?`,
      [dbConfig.database, name],
    );
    if ((exists as any[]).length === 0) {
      await connection.query(`ALTER TABLE profile ADD COLUMN ${ddl}`);
    }
  };
  await ensureColumn('profile_image', `profile_image VARCHAR(255)`);
  await ensureColumn('gender', `gender ENUM('Male','Female','Other')`);
  await ensureColumn('dob', `dob DATE`);
  await ensureColumn('address', `address VARCHAR(255)`);
  await ensureColumn('country', `country VARCHAR(255)`);
  await ensureColumn('state', `state VARCHAR(255)`);
  await ensureColumn('city', `city VARCHAR(255)`);
  await ensureColumn('postal_code', `postal_code VARCHAR(20)`);
  // Ensure FK exists (ignore if already present)
  try {
    await connection.query(
      `ALTER TABLE profile ADD CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`,
    );
  } catch (e) {
    // likely duplicate constraint; ignore
  }

  // If profile_image is too small (VARCHAR), upgrade to LONGTEXT to store data URLs
  const [imgType] = await connection.query<mysql.RowDataPacket[]>(
    `SELECT DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'profile' AND COLUMN_NAME = 'profile_image'`,
    [dbConfig.database],
  );
  const imgRow = (imgType as any[])[0];
  if (imgRow && (imgRow.DATA_TYPE === 'varchar' || (imgRow.CHARACTER_MAXIMUM_LENGTH && imgRow.CHARACTER_MAXIMUM_LENGTH < 1000000))) {
    await connection.query(`ALTER TABLE profile MODIFY COLUMN profile_image LONGTEXT`);
  }

  // Some environments may have an unexpected NOT NULL 'name' column on profile; relax it
  const [nameCol] = await connection.query<mysql.RowDataPacket[]>(
    `SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'profile' AND COLUMN_NAME = 'name'`,
    [dbConfig.database],
  );
  if ((nameCol as any[]).length > 0) {
    const row = (nameCol as any[])[0];
    if (row.IS_NULLABLE !== 'YES' || row.COLUMN_DEFAULT !== null) {
      // Make it nullable with NULL default to avoid strict-mode insert failures when omitted
      await connection.query(`ALTER TABLE profile MODIFY COLUMN name VARCHAR(255) NULL DEFAULT NULL`);
    }
  }

  // Relax unexpected NOT NULL 'email' column on profile if present
  const [emailCol] = await connection.query<mysql.RowDataPacket[]>(
    `SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'profile' AND COLUMN_NAME = 'email'`,
    [dbConfig.database],
  );
  if ((emailCol as any[]).length > 0) {
    const row = (emailCol as any[])[0];
    if (row.IS_NULLABLE !== 'YES' || row.COLUMN_DEFAULT !== null) {
      await connection.query(`ALTER TABLE profile MODIFY COLUMN email VARCHAR(255) NULL DEFAULT NULL`);
    }
  }
  await connection.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS units (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      short_name VARCHAR(20) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      sku VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      category_id INT,
      price DECIMAL(10, 2) NOT NULL,
      cost DECIMAL(10, 2),
      stock_quantity INT DEFAULT 0,
      min_stock_level INT DEFAULT 0,
      unit VARCHAR(50) DEFAULT 'pcs',
      barcode VARCHAR(255),
      status ENUM('active', 'inactive') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INT AUTO_INCREMENT PRIMARY KEY,
      number VARCHAR(100) UNIQUE NOT NULL,
      customer_id INT NOT NULL,
      date DATE NOT NULL,
      due_date DATE,
      subtotal DECIMAL(10, 2) DEFAULT 0,
      tax_rate DECIMAL(5, 2) DEFAULT 0,
      tax_amount DECIMAL(10, 2) DEFAULT 0,
      discount_rate DECIMAL(5, 2) DEFAULT 0,
      discount_amount DECIMAL(10, 2) DEFAULT 0,
      total DECIMAL(10, 2) NOT NULL,
      status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      invoice_id INT NOT NULL,
      product_id INT NOT NULL,
      description TEXT,
      quantity DECIMAL(10, 2) NOT NULL,
      unit_price DECIMAL(10, 2) NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS quotations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      number VARCHAR(100) UNIQUE NOT NULL,
      customer_id INT NOT NULL,
      date DATE NOT NULL,
      expiry_date DATE,
      subtotal DECIMAL(10, 2) DEFAULT 0,
      tax_rate DECIMAL(5, 2) DEFAULT 0,
      tax_amount DECIMAL(10, 2) DEFAULT 0,
      discount_rate DECIMAL(5, 2) DEFAULT 0,
      discount_amount DECIMAL(10, 2) DEFAULT 0,
      total DECIMAL(10, 2) NOT NULL,
      status ENUM('draft', 'sent', 'accepted', 'rejected', 'expired') DEFAULT 'draft',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS quotation_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      quotation_id INT NOT NULL,
      product_id INT NOT NULL,
      description TEXT,
      quantity DECIMAL(10, 2) NOT NULL,
      unit_price DECIMAL(10, 2) NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS inventory_transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      type ENUM('in', 'out', 'adjustment') NOT NULL,
      quantity DECIMAL(10, 2) NOT NULL,
      reference_type ENUM('invoice', 'purchase', 'adjustment', 'initial') NOT NULL,
      reference_id INT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

 

  console.log("✅ All database tables created successfully");
};
