import { pool } from "../config/database";
import {
  Customer,
  Product,
  Invoice,
  InvoiceItem,
  Quotation,
  QuotationItem,
  Category,
  InventoryTransaction,
  SalesAnalytics,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
  Profile,
  User,
} from "../models";
import bcrypt from "bcryptjs";

interface Unit {
  id: number;
  name: string;
  short_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class DatabaseService {
  static getLogin() {
    throw new Error("Method not implemented.");
  }
  static getRegister() {
    throw new Error("Method not implemented.");
  }

    
  //registeration operations
  
  static async registerUser(
    user: Omit<User, "id" | "created_at">,
  ): Promise<ApiResponse<User>> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check if user already exists
      const [existingUsers] = await connection.execute<RowDataPacket[]>(
        "SELECT id FROM users WHERE email = ?",
        [user.email],
      );

      if (existingUsers.length > 0) {
        await connection.rollback();
        return { success: false, error: "User with this email already exists" };
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [user.name, user.email, hashedPassword],
      );

      const userId = result.insertId;

      await connection.commit();

      const [newUserRows] = await pool.execute<RowDataPacket[]>(
        "SELECT id, name, email, created_at FROM users WHERE id = ?",
        [userId],
      );

      return {
        success: true,
        data: newUserRows[0] as User,
        message: "User registered successfully",
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error registering user:", error);
      if (error.code === "ER_DUP_ENTRY") {
        return { success: false, error: "User with this email already exists" };
      }
      return {
        success: false,
        error: "Registration failed",
      };
    } finally {
      connection.release();
    }
  }
  // Login user

  static async loginUser(
    email: string,
    password: string,
  ): Promise<ApiResponse<User>> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ?",
        [email],
      );

      if (rows.length === 0) {
        return { success: false, error: "Invalid email or password" };
      }

      const user = rows[0] as User;

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { success: false, error: "Invalid email or password" };
      }

      const { password: _, ...userWithoutPassword } = user;
      return { success: true, data: userWithoutPassword as User };
    } catch (error) {
      console.error("Error logging in user:", error);
      return { success: false, error: "Login failed" };
    }
  }
  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ?",
        [email],
      );
      return rows.length > 0 ? (rows[0] as User) : null;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return null;
    }
  }
  static async getUserById(id: number): Promise<User | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE id = ?",
        [id],
      );
      return rows.length > 0 ? (rows[0] as User) : null;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  }
  // Update user
  static async updateUser(
    id: number,
    user: Partial<Omit<User, "id" | "created_at">>,
  ): Promise<ApiResponse<User>> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [user.name, user.email, id],
      );

      if (result.affectedRows === 0) {
        throw new Error("User not found");
      }
      const [updatedUser] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE id = ?",
        [id],
      );

      return {
        success: true,
        data: updatedUser[0] as User,
        message: "User updated successfully",
      };
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
  // Delete user
  static async deleteUser(id: number): Promise<ApiResponse<void>> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        "DELETE FROM users WHERE id = ?",
        [id],
      );

      if (result.affectedRows === 0) {
        throw new Error("User not found");
      }

      return {
        success: true,
        message: "User deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
  // Add User model methods here
  static async getAllUsers(): Promise<ApiResponse<User[]>> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM users ORDER BY created_at DESC",
      );
      return {
        success: true,
        data: rows as User[],
        message: "Users retrieved successfully",
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { success: false, error: "Failed to fetch users" };
    }
  }

  //change password
  // static async changePassword(
  //   id: number,
  //   oldPassword: string,
  //   newPassword: string,
  // ): Promise<ApiResponse<void>> {
  //   try {
  //     const user = await this.getUserById(id);
  //     if (!user) {
  //       return { success: false, error: "User not found" };
  //     }

  //     const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  //     if (!isOldPasswordValid) {
  //       return { success: false, error: "Invalid old password" };
  //     }

  //     const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  //     await pool.execute<ResultSetHeader>(
  //       "UPDATE users SET password = ? WHERE id = ?",
  //       [hashedNewPassword, id],
  //     );

  //     return { success: true, message: "Password changed successfully" };
  //   } catch (error) {
  //     console.error("Error changing password:", error);
  //     return { success: false, error: "Failed to change password" };
  //   }
  // }


  // profile operations
  static async getProfile(
    userId: number,
  ): Promise<ApiResponse<{ user: User; profile: Profile | {} }>> {
    try {
      const [userRows] = await pool.execute<RowDataPacket[]>(
        "SELECT id, name, email FROM users WHERE id = ?",
        [userId],
      );

      if (userRows.length === 0) {
        return { success: false, error: "User not found" };
      }
      const user = userRows[0] as User;

      const [profileRows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM profile WHERE user_id = ?",
        [userId],
      );

      const profile = profileRows.length > 0 ? profileRows[0] : {};

      return {
        success: true,
        data: { user, profile: profile as Profile },
        message: "Profile retrieved successfully",
      };
    } catch (error) {
      console.error("Error fetching profile by user ID:", error);
      return { success: false, error: "Failed to fetch profile" };
    }
  }

  static async updateProfile(
    userId: number,
    profileData: Partial<Profile & { name: string }>,
  ): Promise<ApiResponse<Profile>> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // If name is being updated, update it in the users table as well
      if (profileData.name) {
        await connection.execute("UPDATE users SET name = ? WHERE id = ?", [
          profileData.name,
          userId,
        ]);
      }

      const {
        profile_image,
        gender,
        dob,
        address,
        country,
        state,
        city,
        postal_code,
      } = profileData;

      // Normalize values to match DB schema
      const normalizedGender = gender
        ? (gender.charAt(0).toUpperCase() + gender.slice(1))
        : null; // DB expects 'Male' | 'Female' | 'Other'
      const normalizedDob = !dob || dob === "" ? null : dob; // DB expects DATE or NULL

      // Use INSERT ... ON DUPLICATE KEY UPDATE for atomicity
      await connection.execute(
        `INSERT INTO profile (
          user_id, profile_image, gender, dob, address, country, state, city, postal_code
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          profile_image = VALUES(profile_image),
          gender = VALUES(gender),
          dob = VALUES(dob),
          address = VALUES(address),
          country = VALUES(country),
          state = VALUES(state),
          city = VALUES(city),
          postal_code = VALUES(postal_code)`,
        [
          userId,
          profile_image ?? null,
          normalizedGender,
          normalizedDob,
          address,
          country,
          state,
          city,
          postal_code,
        ],
      );

      const [newOrUpdatedProfile] = await connection.execute<RowDataPacket[]>(
        "SELECT * FROM profile WHERE user_id = ?",
        [userId],
      );

      await connection.commit();

      return {
        success: true,
        data: newOrUpdatedProfile[0] as Profile,
        message: "Profile saved successfully",
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error saving profile:", error);
      const message = error instanceof Error ? error.message : "Failed to save profile";
      return { success: false, error: message };
    } finally {
      connection.release();
    }
  }


  // Customer operations
  static async getCustomers(
    page = 1,
    limit = 10,
    search = "",
  ): Promise<PaginatedResponse<Customer>> {
    try {
      const offset = (page - 1) * limit;
      let query = "SELECT * FROM customers";
      let countQuery = "SELECT COUNT(*) as total FROM customers";
      const params: any[] = [];

      if (search) {
        query += " WHERE name LIKE ? OR email LIKE ? OR company LIKE ?";
        countQuery += " WHERE name LIKE ? OR email LIKE ? OR company LIKE ?";
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam, searchParam);
      }

      // Use string interpolation for LIMIT and OFFSET to avoid MySQL2 parameter binding issues
      const limitInt = Math.max(
        1,
        Math.min(1000, parseInt(limit.toString()) || 10),
      );
      const offsetInt = Math.max(0, parseInt(offset.toString()) || 0);
      query += ` ORDER BY created_at DESC LIMIT ${limitInt} OFFSET ${offsetInt}`;

      const countParams = search
        ? [`%${search}%`, `%${search}%`, `%${search}%`]
        : [];

      const [customers] = await pool.execute<RowDataPacket[]>(query, params);
      const [countResult] = await pool.execute<RowDataPacket[]>(
        countQuery,
        countParams,
      );

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: customers as Customer[],
        pagination: { page, limit, total, totalPages },
      };
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  }

  static async createCustomer(
    customer: Omit<Customer, "id" | "created_at" | "updated_at">,
  ): Promise<ApiResponse<Customer>> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO customers (name, email, phone, company, address, city, state, country, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          customer.name,
          customer.email,
          customer.phone,
          customer.company,
          customer.address,
          customer.city,
          customer.state,
          customer.country,
          customer.postal_code,
        ],
      );

      const [newCustomer] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM customers WHERE id = ?",
        [result.insertId],
      );

      return {
        success: true,
        data: newCustomer[0] as Customer,
        message: "Customer created successfully",
      };
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  }

  static async updateCustomer(
    id: number,
    customer: Partial<Omit<Customer, "id" | "created_at" | "updated_at">>,
  ): Promise<ApiResponse<Customer>> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        "UPDATE customers SET name = ?, email = ?, phone = ?, company = ?, address = ?, city = ?, state = ?, country = ?, postal_code = ? WHERE id = ?",
        [
          customer.name,
          customer.email,
          customer.phone,
          customer.company,
          customer.address,
          customer.city,
          customer.state,
          customer.country,
          customer.postal_code,
          id,
        ],
      );

      if (result.affectedRows === 0) {
        throw new Error("Customer not found");
      }

      const [updatedCustomer] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM customers WHERE id = ?",
        [id],
      );

      return {
        success: true,
        data: updatedCustomer[0] as Customer,
        message: "Customer updated successfully",
      };
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  }

  static async deleteCustomer(id: number): Promise<ApiResponse<void>> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        "DELETE FROM customers WHERE id = ?",
        [id],
      );

      if (result.affectedRows === 0) {
        throw new Error("Customer not found");
      }

      return {
        success: true,
        message: "Customer deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  }

  // Product operations
  static async getProducts(
    page = 1,
    limit = 10,
    search = "",
  ): Promise<PaginatedResponse<Product>> {
    try {
      const offset = (page - 1) * limit;
      let query = "SELECT * FROM products";
      let countQuery = "SELECT COUNT(*) as total FROM products";
      const params: any[] = [];

      if (search) {
        query += " WHERE name LIKE ? OR sku LIKE ? OR description LIKE ?";
        countQuery += " WHERE name LIKE ? OR sku LIKE ? OR description LIKE ?";
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam, searchParam);
      }

      // Use string interpolation for LIMIT and OFFSET to avoid MySQL2 parameter binding issues
      const limitInt = Math.max(
        1,
        Math.min(1000, parseInt(limit.toString()) || 10),
      );
      const offsetInt = Math.max(0, parseInt(offset.toString()) || 0);
      query += ` ORDER BY created_at DESC LIMIT ${limitInt} OFFSET ${offsetInt}`;

      const countParams = search
        ? [`%${search}%`, `%${search}%`, `%${search}%`]
        : [];

      const [products] = await pool.execute<RowDataPacket[]>(query, params);
      const [countResult] = await pool.execute<RowDataPacket[]>(
        countQuery,
        countParams,
      );

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: products as Product[],
        pagination: { page, limit, total, totalPages },
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  static async createProduct(
    product: Omit<Product, "id" | "created_at" | "updated_at">,
  ): Promise<ApiResponse<Product>> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO products (name, sku, description, price, cost, stock_quantity, unit, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          product.name,
          product.sku,
          product.description,
          product.price,
          product.cost,
          product.stock_quantity || 0,
          product.unit || "pcs",
          product.status || "active",
        ],
      );

      const [newProduct] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM products WHERE id = ?",
        [result.insertId],
      );

      return {
        success: true,
        data: newProduct[0] as Product,
        message: "Product created successfully",
      };
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  static async updateProduct(
    id: number,
    product: Partial<Omit<Product, "id" | "created_at" | "updated_at">>,
  ): Promise<ApiResponse<Product>> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        "UPDATE products SET name = ?, sku = ?, description = ?, price = ?, cost = ?, stock_quantity = ?, unit = ?, status = ? WHERE id = ?",
        [
          product.name,
          product.sku,
          product.description,
          product.price,
          product.cost,
          product.stock_quantity,
          product.unit,
          product.status,
          id,
        ],
      );

      if (result.affectedRows === 0) {
        throw new Error("Product not found");
      }

      const [updatedProduct] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM products WHERE id = ?",
        [id],
      );

      return {
        success: true,
        data: updatedProduct[0] as Product,
        message: "Product updated successfully",
      };
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  static async deleteProduct(id: number): Promise<ApiResponse<void>> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        "DELETE FROM products WHERE id = ?",
        [id],
      );

      if (result.affectedRows === 0) {
        throw new Error("Product not found");
      }

      return {
        success: true,
        message: "Product deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  // Category operations
  static async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const [categories] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM categories ORDER BY created_at DESC",
      );

      return {
        success: true,
        data: categories as Category[],
        message: "Categories retrieved successfully",
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  static async createCategory(
    category: Omit<Category, "id" | "created_at" | "updated_at">,
  ): Promise<ApiResponse<Category>> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO categories (name, description) VALUES (?, ?)",
        [category.name, category.description],
      );

      const [newCategory] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM categories WHERE id = ?",
        [result.insertId],
      );

      return {
        success: true,
        data: newCategory[0] as Category,
        message: "Category created successfully",
      };
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  static async updateCategory(
    id: number,
    category: Partial<Omit<Category, "id" | "created_at" | "updated_at">>,
  ): Promise<ApiResponse<Category>> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        "UPDATE categories SET name = ?, description = ?",
        [category.name, category.description],
      );

      if (result.affectedRows === 0) {
        throw new Error("Category not found");
      }

      const [updatedCategory] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM categories WHERE id = ?",
        [id],
      );

      return {
        success: true,
        data: updatedCategory[0] as Category,
        message: "Category updated successfully",
      };
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  static async deleteCategory(id: number): Promise<ApiResponse<void>> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        "DELETE FROM categories WHERE id = ?",
        [id],
      );

      if (result.affectedRows === 0) {
        throw new Error("Category not found");
      }

      return {
        success: true,
        message: "Category deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
  // Units operations
  static async getUnits(): Promise<ApiResponse<Unit[]>> {
    try {
      const [units] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM units ORDER BY created_at DESC",
      );

      return {
        success: true,
        data: units as Unit[],
        message: "Units retrieved successfully",
      };
    } catch (error) {
      console.error("Error fetching units:", error);
      throw error;
    }
  }

  static async createUnit(
    unit: Omit<Unit, "id" | "created_at" | "updated_at">,
  ): Promise<ApiResponse<Unit>> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO units (name, short_name, description) VALUES (?, ?, ?)",
        [unit.name, unit.short_name, unit.description],
      );

      const [newUnit] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM units WHERE id = ?",
        [result.insertId],
      );

      return {
        success: true,
        data: newUnit[0] as Unit,
        message: "Unit created successfully",
      };
    } catch (error) {
      console.error("Error creating unit:", error);
      throw error;
    }
  }

  static async updateUnit(
    id: number,
    unit: Partial<Omit<Unit, "id" | "created_at" | "updated_at">>,
  ): Promise<ApiResponse<Unit>> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        "UPDATE units SET name = ?, short_name = ?, description = ? WHERE id = ?",
        [unit.name, unit.short_name, unit.description, id],
      );

      if (result.affectedRows === 0) {
        throw new Error("Unit not found");
      }

      const [updatedUnit] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM units WHERE id = ?",
        [id],
      );

      return {
        success: true,
        data: updatedUnit[0] as Unit,
        message: "Unit updated successfully",
      };
    } catch (error) {
      console.error("Error updating unit:", error);
      throw error;
    }
  }

  static async deleteUnit(id: number): Promise<ApiResponse<void>> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        "DELETE FROM units WHERE id = ?",
        [id],
      );

      if (result.affectedRows === 0) {
        throw new Error("Unit not found");
      }

      return {
        success: true,
        message: "Unit deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting unit:", error);
      throw error;
    }
  }

  // Invoice operations
  static async getInvoices(
    page = 1,
    limit = 10,
    search = "",
  ): Promise<PaginatedResponse<Invoice>> {
    try {
      const offset = (page - 1) * limit;
      let query = `
        SELECT i.*, c.name as customer_name, c.email as customer_email 
        FROM invoices i 
        LEFT JOIN customers c ON i.customer_id = c.id
      `;
      let countQuery = "SELECT COUNT(*) as total FROM invoices i";
      const params: any[] = [];

      if (search) {
        query += " WHERE i.number LIKE ? OR c.name LIKE ?";
        countQuery +=
          " LEFT JOIN customers c ON i.customer_id = c.id WHERE i.number LIKE ? OR c.name LIKE ?";
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam);
      }

      // Use string interpolation for LIMIT and OFFSET to avoid MySQL2 parameter binding issues
      const limitInt = Math.max(
        1,
        Math.min(1000, parseInt(limit.toString()) || 10),
      );
      const offsetInt = Math.max(0, parseInt(offset.toString()) || 0);
      query += ` ORDER BY i.created_at DESC LIMIT ${limitInt} OFFSET ${offsetInt}`;

      const countParams = search ? [`%${search}%`, `%${search}%`] : [];

      const [invoices] = await pool.execute<RowDataPacket[]>(query, params);
      const [countResult] = await pool.execute<RowDataPacket[]>(
        countQuery,
        countParams,
      );

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: invoices as Invoice[],
        pagination: { page, limit, total, totalPages },
      };
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  }

  static async createInvoice(
    invoice: Omit<Invoice, "id" | "created_at" | "updated_at">,
    items: Omit<InvoiceItem, "id" | "invoice_id" | "created_at">[],
  ): Promise<ApiResponse<Invoice>> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert invoice
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO invoices (number, customer_id, date, due_date, subtotal, tax_rate, tax_amount, discount_rate, discount_amount, total, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          invoice.number,
          invoice.customer_id,
          invoice.date,
          invoice.due_date,
          invoice.subtotal,
          invoice.tax_rate,
          invoice.tax_amount,
          invoice.discount_rate,
          invoice.discount_amount,
          invoice.total,
          invoice.status,
          invoice.notes,
        ],
      );

      const invoiceId = result.insertId;

      // Insert invoice items
      for (const item of items) {
        await connection.execute(
          "INSERT INTO invoice_items (invoice_id, product_id, description, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?, ?)",
          [
            invoiceId,
            item.product_id,
            item.description,
            item.quantity,
            item.unit_price,
            item.total,
          ],
        );

        // Update inventory
        await connection.execute(
          "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
          [item.quantity, item.product_id],
        );

        // Record inventory transaction
        await connection.execute(
          "INSERT INTO inventory_transactions (product_id, type, quantity, reference_type, reference_id) VALUES (?, ?, ?, ?, ?)",
          [item.product_id, "out", item.quantity, "invoice", invoiceId],
        );
      }

      await connection.commit();

      const [newInvoice] = await connection.execute<RowDataPacket[]>(
        "SELECT * FROM invoices WHERE id = ?",
        [invoiceId],
      );

      return {
        success: true,
        data: newInvoice[0] as Invoice,
        message: "Invoice created successfully",
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error creating invoice:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateInvoice(
    id: number,
    invoice: Partial<Omit<Invoice, "id" | "created_at" | "updated_at">>,
    items?: Omit<InvoiceItem, "id" | "invoice_id" | "created_at">[],
  ): Promise<ApiResponse<Invoice>> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update invoice
      const [result] = await connection.execute<ResultSetHeader>(
        "UPDATE invoices SET number = ?, customer_id = ?, date = ?, due_date = ?, subtotal = ?, tax_rate = ?, tax_amount = ?, discount_rate = ?, discount_amount = ?, total = ?, status = ?, notes = ? WHERE id = ?",
        [
          invoice.number,
          invoice.customer_id,
          invoice.date,
          invoice.due_date,
          invoice.subtotal,
          invoice.tax_rate,
          invoice.tax_amount,
          invoice.discount_rate,
          invoice.discount_amount,
          invoice.total,
          invoice.status,
          invoice.notes,
          id,
        ],
      );

      if (result.affectedRows === 0) {
        throw new Error("Invoice not found");
      }

      // Update items if provided
      if (items) {
        // Delete existing items
        await connection.execute(
          "DELETE FROM invoice_items WHERE invoice_id = ?",
          [id],
        );

        // Insert new items
        for (const item of items) {
          await connection.execute(
            "INSERT INTO invoice_items (invoice_id, product_id, description, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?, ?)",
            [
              id,
              item.product_id,
              item.description,
              item.quantity,
              item.unit_price,
              item.total,
            ],
          );
        }
      }

      await connection.commit();

      const [updatedInvoice] = await connection.execute<RowDataPacket[]>(
        "SELECT * FROM invoices WHERE id = ?",
        [id],
      );

      return {
        success: true,
        data: updatedInvoice[0] as Invoice,
        message: "Invoice updated successfully",
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error updating invoice:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteInvoice(id: number): Promise<ApiResponse<void>> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Delete invoice items first
      await connection.execute(
        "DELETE FROM invoice_items WHERE invoice_id = ?",
        [id],
      );

      // Delete invoice
      const [result] = await connection.execute<ResultSetHeader>(
        "DELETE FROM invoices WHERE id = ?",
        [id],
      );

      if (result.affectedRows === 0) {
        throw new Error("Invoice not found");
      }

      await connection.commit();

      return {
        success: true,
        message: "Invoice deleted successfully",
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error deleting invoice:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getInvoiceById(id: number): Promise<ApiResponse<Invoice>> {
    try {
      const [invoices] = await pool.execute<RowDataPacket[]>(
        `SELECT i.*, c.name as customer_name, c.email as customer_email 
         FROM invoices i 
         LEFT JOIN customers c ON i.customer_id = c.id 
         WHERE i.id = ?`,
        [id],
      );

      if (invoices.length === 0) {
        throw new Error("Invoice not found");
      }

      const [items] = await pool.execute<RowDataPacket[]>(
        `SELECT ii.*, p.name as product_name 
         FROM invoice_items ii 
         LEFT JOIN products p ON ii.product_id = p.id 
         WHERE ii.invoice_id = ?`,
        [id],
      );

      const invoice = invoices[0] as Invoice;
      invoice.items = items as InvoiceItem[];

      return {
        success: true,
        data: invoice,
        message: "Invoice retrieved successfully",
      };
    } catch (error) {
      console.error("Error fetching invoice:", error);
      throw error;
    }
  }

  // Quotation operations
  static async getQuotations(
    page = 1,
    limit = 10,
    search = "",
  ): Promise<PaginatedResponse<Quotation>> {
    try {
      const offset = (page - 1) * limit;
      let query = `
        SELECT q.*, c.name as customer_name, c.email as customer_email 
        FROM quotations q 
        LEFT JOIN customers c ON q.customer_id = c.id
      `;
      let countQuery = "SELECT COUNT(*) as total FROM quotations q";
      const params: any[] = [];

      if (search) {
        query += " WHERE q.number LIKE ? OR c.name LIKE ?";
        countQuery +=
          " LEFT JOIN customers c ON q.customer_id = c.id WHERE q.number LIKE ? OR c.name LIKE ?";
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam);
      }

      // Use string interpolation for LIMIT and OFFSET to avoid MySQL2 parameter binding issues
      const limitInt = Math.max(
        1,
        Math.min(1000, parseInt(limit.toString()) || 10),
      );
      const offsetInt = Math.max(0, parseInt(offset.toString()) || 0);
      query += ` ORDER BY q.created_at DESC LIMIT ${limitInt} OFFSET ${offsetInt}`;

      const countParams = search ? [`%${search}%`, `%${search}%`] : [];

      const [quotations] = await pool.execute<RowDataPacket[]>(query, params);
      const [countResult] = await pool.execute<RowDataPacket[]>(
        countQuery,
        countParams,
      );

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: quotations as Quotation[],
        pagination: { page, limit, total, totalPages },
      };
    } catch (error) {
      console.error("Error fetching quotations:", error);
      throw error;
    }
  }

  static async createQuotation(
    quotation: Omit<Quotation, "id" | "created_at" | "updated_at">,
    items: Omit<QuotationItem, "id" | "quotation_id" | "created_at">[],
  ): Promise<ApiResponse<Quotation>> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert quotation
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO quotations (number, customer_id, date, expiry_date, subtotal, tax_rate, tax_amount, discount_rate, discount_amount, total, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          quotation.number,
          quotation.customer_id,
          quotation.date,
          quotation.expiry_date,
          quotation.subtotal,
          quotation.tax_rate,
          quotation.tax_amount,
          quotation.discount_rate,
          quotation.discount_amount,
          quotation.total,
          quotation.status,
          quotation.notes,
        ],
      );

      const quotationId = result.insertId;

      // Insert quotation items
      for (const item of items) {
        await connection.execute(
          "INSERT INTO quotation_items (quotation_id, product_id, description, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?, ?)",
          [
            quotationId,
            item.product_id,
            item.description,
            item.quantity,
            item.unit_price,
            item.total,
          ],
        );
      }

      await connection.commit();

      const [newQuotation] = await connection.execute<RowDataPacket[]>(
        "SELECT * FROM quotations WHERE id = ?",
        [quotationId],
      );

      return {
        success: true,
        data: newQuotation[0] as Quotation,
        message: "Quotation created successfully",
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error creating quotation:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateQuotation(
    id: number,
    quotation: Partial<Omit<Quotation, "id" | "created_at" | "updated_at">>,
    items?: Omit<QuotationItem, "id" | "quotation_id" | "created_at">[],
  ): Promise<ApiResponse<Quotation>> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update quotation
      const [result] = await connection.execute<ResultSetHeader>(
        "UPDATE quotations SET number = ?, customer_id = ?, date = ?, expiry_date = ?, subtotal = ?, tax_rate = ?, tax_amount = ?, discount_rate = ?, discount_amount = ?, total = ?, status = ?, notes = ? WHERE id = ?",
        [
          quotation.number,
          quotation.customer_id,
          quotation.date,
          quotation.expiry_date,
          quotation.subtotal,
          quotation.tax_rate,
          quotation.tax_amount,
          quotation.discount_rate,
          quotation.discount_amount,
          quotation.total,
          quotation.status,
          quotation.notes,
          id,
        ],
      );

      if (result.affectedRows === 0) {
        throw new Error("Quotation not found");
      }

      // Update items if provided
      if (items) {
        // Delete existing items
        await connection.execute(
          "DELETE FROM quotation_items WHERE quotation_id = ?",
          [id],
        );

        // Insert new items
        for (const item of items) {
          await connection.execute(
            "INSERT INTO quotation_items (quotation_id, product_id, description, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?, ?)",
            [
              id,
              item.product_id,
              item.description,
              item.quantity,
              item.unit_price,
              item.total,
            ],
          );
        }
      }

      await connection.commit();

      const [updatedQuotation] = await connection.execute<RowDataPacket[]>(
        "SELECT * FROM quotations WHERE id = ?",
        [id],
      );

      return {
        success: true,
        data: updatedQuotation[0] as Quotation,
        message: "Quotation updated successfully",
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error updating quotation:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteQuotation(id: number): Promise<ApiResponse<void>> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Delete quotation items first
      await connection.execute(
        "DELETE FROM quotation_items WHERE quotation_id = ?",
        [id],
      );

      // Delete quotation
      const [result] = await connection.execute<ResultSetHeader>(
        "DELETE FROM quotations WHERE id = ?",
        [id],
      );

      if (result.affectedRows === 0) {
        throw new Error("Quotation not found");
      }

      await connection.commit();

      return {
        success: true,
        message: "Quotation deleted successfully",
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error deleting quotation:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getQuotationById(id: number): Promise<ApiResponse<Quotation>> {
    try {
      const [quotations] = await pool.execute<RowDataPacket[]>(
        `SELECT q.*, c.name as customer_name, c.email as customer_email 
         FROM quotations q 
         LEFT JOIN customers c ON q.customer_id = c.id 
         WHERE q.id = ?`,
        [id],
      );

      if (quotations.length === 0) {
        throw new Error("Quotation not found");
      }

      const [items] = await pool.execute<RowDataPacket[]>(
        `SELECT qi.*, p.name as product_name 
         FROM quotation_items qi 
         LEFT JOIN products p ON qi.product_id = p.id 
         WHERE qi.quotation_id = ?`,
        [id],
      );

      const quotation = quotations[0] as Quotation;
      quotation.items = items as QuotationItem[];

      return {
        success: true,
        data: quotation,
        message: "Quotation retrieved successfully",
      };
    } catch (error) {
      console.error("Error fetching quotation:", error);
      throw error;
    }
  }

  // Dashboard analytics
  static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      // Get total counts
      const [salesResult] = await pool.execute<RowDataPacket[]>(
        'SELECT SUM(total) as total_sales FROM invoices WHERE status != "cancelled"',
      );

      const [invoicesResult] = await pool.execute<RowDataPacket[]>(
        "SELECT COUNT(*) as total_invoices FROM invoices",
      );

      const [customersResult] = await pool.execute<RowDataPacket[]>(
        "SELECT COUNT(*) as total_customers FROM customers",
      );

      const [productsResult] = await pool.execute<RowDataPacket[]>(
        "SELECT COUNT(*) as total_products FROM products",
      );

      // Get recent invoices
      const [recentInvoices] = await pool.execute<RowDataPacket[]>(
        `SELECT i.*, c.name as customer_name 
         FROM invoices i 
         LEFT JOIN customers c ON i.customer_id = c.id 
         ORDER BY i.created_at DESC 
         LIMIT 5`,
      );

      // Get recent customers
      const [recentCustomers] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM customers ORDER BY created_at DESC LIMIT 5",
      );

      // Get sales chart data (last 30 days)
      const [salesChart] = await pool.execute<RowDataPacket[]>(
        `SELECT DATE(created_at) as date, SUM(total) as amount 
         FROM invoices 
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
         AND status != 'cancelled'
         GROUP BY DATE(created_at) 
         ORDER BY date`,
      );

      // Get monthly revenue (last 6 months)
      const [monthlyRevenue] = await pool.execute<RowDataPacket[]>(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total) as revenue 
         FROM invoices 
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH) 
         AND status != 'cancelled'
         GROUP BY DATE_FORMAT(created_at, '%Y-%m') 
         ORDER BY month`,
      );

      const stats: DashboardStats = {
        totalSales: salesResult[0]?.total_sales || 0,
        totalInvoices: invoicesResult[0]?.total_invoices || 0,
        totalCustomers: customersResult[0]?.total_customers || 0,
        totalProducts: productsResult[0]?.total_products || 0,
        recentInvoices: recentInvoices as Invoice[],
        recentCustomers: recentCustomers as Customer[],
        salesChart: salesChart as { date: string; amount: number }[],
        topProducts: [], // Will implement later
        monthlyRevenue: monthlyRevenue as { month: string; revenue: number }[],
      };

      return {
        success: true,
        data: stats,
        message: "Dashboard stats retrieved successfully",
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  }

  // // Seed sample data
  // static async seedSampleData(): Promise<void> {
  //   try {
  //     // Insert sample categories
  //     await pool.execute(
  //       'INSERT IGNORE INTO categories (id, name, description) VALUES (1, "Electronics", "Electronic items and gadgets")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO categories (id, name, description) VALUES (2, "Software", "Software products and licenses")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO categories (id, name, description) VALUES (3, "Books", "Educational and reference books")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO categories (id, name, description) VALUES (4, "Office Supplies", "Office equipment and supplies")',
  //     );

  //     // Insert sample units
  //     await pool.execute(
  //       'INSERT IGNORE INTO units (id, name, short_name, description) VALUES (1, "Pieces", "pcs", "Individual items or units")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO units (id, name, short_name, description) VALUES (2, "Boxes", "box", "Boxed items or packages")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO units (id, name, short_name, description) VALUES (3, "Kilograms", "kg", "Weight in kilograms")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO units (id, name, short_name, description) VALUES (4, "Licenses", "lic", "Software or digital licenses")',
  //     );

  //     // Insert sample customers
  //     await pool.execute(
  //       'INSERT IGNORE INTO customers (id, name, email, phone, company, address, city, state, country, postal_code) VALUES (1, "John Doe", "john@example.com", "+1234567890", "Tech Corp", "123 Tech Street", "San Francisco", "CA", "USA", "94105")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO customers (id, name, email, phone, company, address, city, state, country, postal_code) VALUES (2, "Jane Smith", "jane@example.com", "+1234567891", "Design Studio", "456 Design Ave", "New York", "NY", "USA", "10001")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO customers (id, name, email, phone, company, address, city, state, country, postal_code) VALUES (3, "Bob Johnson", "bob@company.com", "+1234567892", "Johnson Enterprises", "789 Business Blvd", "Chicago", "IL", "USA", "60601")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO customers (id, name, email, phone, company, address, city, state, country, postal_code) VALUES (4, "Alice Wilson", "alice@startup.com", "+1234567893", "Wilson Startup", "321 Innovation Way", "Austin", "TX", "USA", "73301")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO customers (id, name, email, phone, company, address, city, state, country, postal_code) VALUES (5, "Michael Brown", "michael@retail.com", "+1234567894", "Brown Retail", "654 Commerce St", "Los Angeles", "CA", "USA", "90210")',
  //     );

  //     // Insert sample products
  //     await pool.execute(
  //       'INSERT IGNORE INTO products (id, name, sku, category_id, price, cost, stock_quantity, min_stock_level, unit) VALUES (1, "Laptop Computer", "LAP001", 1, 999.99, 800.00, 50, 5, "pcs")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO products (id, name, sku, category_id, price, cost, stock_quantity, min_stock_level, unit) VALUES (2, "Software License", "SW001", 2, 199.99, 150.00, 100, 10, "lic")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO products (id, name, sku, category_id, price, cost, stock_quantity, min_stock_level, unit) VALUES (3, "Wireless Mouse", "MS001", 1, 29.99, 20.00, 200, 20, "pcs")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO products (id, name, sku, category_id, price, cost, stock_quantity, min_stock_level, unit) VALUES (4, "Programming Book", "BK001", 3, 49.99, 30.00, 75, 5, "pcs")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO products (id, name, sku, category_id, price, cost, stock_quantity, min_stock_level, unit) VALUES (5, "Office Chair", "CH001", 4, 299.99, 200.00, 25, 3, "pcs")',
  //     );

  //     // Insert sample invoices
  //     await pool.execute(
  //       'INSERT IGNORE INTO invoices (id, number, customer_id, date, due_date, subtotal, tax_rate, tax_amount, total, status, notes) VALUES (1, "INV-001", 1, "2024-08-01", "2024-08-31", 1199.98, 8.25, 99.00, 1298.98, "paid", "First invoice for Tech Corp")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO invoices (id, number, customer_id, date, due_date, subtotal, tax_rate, tax_amount, total, status, notes) VALUES (2, "INV-002", 2, "2024-08-05", "2024-09-05", 229.98, 8.25, 18.97, 248.95, "sent", "Design Studio software purchase")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO invoices (id, number, customer_id, date, due_date, subtotal, tax_rate, tax_amount, total, status, notes) VALUES (3, "INV-003", 3, "2024-08-10", "2024-09-10", 79.98, 8.25, 6.60, 86.58, "overdue", "Johnson Enterprises office supplies")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO invoices (id, number, customer_id, date, due_date, subtotal, tax_rate, tax_amount, total, status, notes) VALUES (4, "INV-004", 4, "2024-08-12", "2024-09-12", 599.99, 8.25, 49.50, 649.49, "draft", "Wilson Startup equipment order")',
  //     );

  //     // Insert sample invoice items
  //     await pool.execute(
  //       'INSERT IGNORE INTO invoice_items (id, invoice_id, product_id, description, quantity, unit_price, total) VALUES (1, 1, 1, "Laptop Computer", 1, 999.99, 999.99)',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO invoice_items (id, invoice_id, product_id, description, quantity, unit_price, total) VALUES (2, 1, 2, "Software License", 1, 199.99, 199.99)',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO invoice_items (id, invoice_id, product_id, description, quantity, unit_price, total) VALUES (3, 2, 2, "Software License", 1, 199.99, 199.99)',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO invoice_items (id, invoice_id, product_id, description, quantity, unit_price, total) VALUES (4, 2, 3, "Wireless Mouse", 1, 29.99, 29.99)',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO invoice_items (id, invoice_id, product_id, description, quantity, unit_price, total) VALUES (5, 3, 3, "Wireless Mouse", 2, 29.99, 59.98)',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO invoice_items (id, invoice_id, product_id, description, quantity, unit_price, total) VALUES (6, 3, 4, "Programming Book", 1, 49.99, 49.99)',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO invoice_items (id, invoice_id, product_id, description, quantity, unit_price, total) VALUES (7, 4, 5, "Office Chair", 2, 299.99, 599.98)',
  //     );

  //     // Insert sample quotations
  //     await pool.execute(
  //       'INSERT IGNORE INTO quotations (id, number, customer_id, date, expiry_date, subtotal, tax_rate, tax_amount, total, status, notes) VALUES (1, "QUO-001", 1, "2024-07-15", "2024-08-15", 999.99, 8.25, 82.50, 1082.49, "accepted", "Tech Corp laptop quotation")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO quotations (id, number, customer_id, date, expiry_date, subtotal, tax_rate, tax_amount, total, status, notes) VALUES (2, "QUO-002", 2, "2024-07-20", "2024-08-20", 149.99, 8.25, 12.37, 162.36, "sent", "Design Studio software quote")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO quotations (id, number, customer_id, date, expiry_date, subtotal, tax_rate, tax_amount, total, status, notes) VALUES (3, "QUO-003", 5, "2024-08-01", "2024-09-01", 899.97, 8.25, 74.25, 974.22, "declined", "Brown Retail bulk order")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO quotations (id, number, customer_id, date, expiry_date, subtotal, tax_rate, tax_amount, total, status, notes) VALUES (4, "QUO-004", 3, "2024-08-05", "2024-09-05", 299.99, 8.25, 24.75, 324.74, "expired", "Johnson office furniture")',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO quotations (id, number, customer_id, date, expiry_date, subtotal, tax_rate, tax_amount, total, status, notes) VALUES (5, "QUO-005", 4, "2024-08-10", "2024-09-10", 199.99, 8.25, 16.50, 216.49, "draft", "Wilson Startup software package")',
  //     );

  //     // Insert sample quotation items
  //     await pool.execute(
  //       'INSERT IGNORE INTO quotation_items (id, quotation_id, product_id, description, quantity, unit_price, total) VALUES (1, 1, 1, "Laptop Computer", 1, 999.99, 999.99)',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO quotation_items (id, quotation_id, product_id, description, quantity, unit_price, total) VALUES (2, 2, 2, "Software License", 1, 149.99, 149.99)',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO quotation_items (id, quotation_id, product_id, description, quantity, unit_price, total) VALUES (3, 3, 1, "Laptop Computer", 1, 999.99, 999.99)',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO quotation_items (id, quotation_id, product_id, description, quantity, unit_price, total) VALUES (4, 3, 3, "Wireless Mouse", 5, 29.99, 149.95)',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO quotation_items (id, quotation_id, product_id, description, quantity, unit_price, total) VALUES (5, 4, 5, "Office Chair", 1, 299.99, 299.99)',
  //     );
  //     await pool.execute(
  //       'INSERT IGNORE INTO quotation_items (id, quotation_id, product_id, description, quantity, unit_price, total) VALUES (6, 5, 2, "Software License", 1, 199.99, 199.99)',
  //     );

  //     console.log("✅ Sample data seeded successfully");
  //   } catch (error) {
  //     console.error("❌ Error seeding sample data:", error);
  //   }
  // }

  // Usage check methods for delete restrictions
  static async checkCustomerUsage(
    customerId: number,
  ): Promise<ApiResponse<{ canDelete: boolean; usageDetails: string[] }>> {
    try {
      const usageDetails: string[] = [];

      // Check if customer is used in invoices
      const [invoices] = await pool.execute<RowDataPacket[]>(
        "SELECT COUNT(*) as count FROM invoices WHERE customer_id = ?",
        [customerId],
      );
      if (invoices[0].count > 0) {
        usageDetails.push(`${invoices[0].count} invoice(s)`);
      }

      // Check if customer is used in quotations
      const [quotations] = await pool.execute<RowDataPacket[]>(
        "SELECT COUNT(*) as count FROM quotations WHERE customer_id = ?",
        [customerId],
      );
      if (quotations[0].count > 0) {
        usageDetails.push(`${quotations[0].count} quotation(s)`);
      }

      return {
        success: true,
        data: {
          canDelete: usageDetails.length === 0,
          usageDetails,
        },
        message:
          usageDetails.length === 0
            ? "Customer can be deleted"
            : "Customer is being used",
      };
    } catch (error) {
      console.error("Error checking customer usage:", error);
      throw error;
    }
  }

  static async checkCategoryUsage(
    categoryId: number,
  ): Promise<ApiResponse<{ canDelete: boolean; usageDetails: string[] }>> {
    try {
      const usageDetails: string[] = [];

      // Check if category is used in products
      const [products] = await pool.execute<RowDataPacket[]>(
        "SELECT COUNT(*) as count FROM products WHERE category_id = ?",
        [categoryId],
      );
      if (products[0].count > 0) {
        usageDetails.push(`${products[0].count} product(s)`);
      }

      return {
        success: true,
        data: {
          canDelete: usageDetails.length === 0,
          usageDetails,
        },
        message:
          usageDetails.length === 0
            ? "Category can be deleted"
            : "Category is being used",
      };
    } catch (error) {
      console.error("Error checking category usage:", error);
      throw error;
    }
  }

  static async checkUnitUsage(
    unitId: number,
  ): Promise<ApiResponse<{ canDelete: boolean; usageDetails: string[] }>> {
    try {
      const usageDetails: string[] = [];

      // Check if unit is used in products
      const [products] = await pool.execute<RowDataPacket[]>(
        "SELECT COUNT(*) as count FROM products WHERE unit = (SELECT name FROM units WHERE id = ?)",
        [unitId],
      );
      if (products[0].count > 0) {
        usageDetails.push(`${products[0].count} product(s)`);
      }

      return {
        success: true,
        data: {
          canDelete: usageDetails.length === 0,
          usageDetails,
        },
        message:
          usageDetails.length === 0
            ? "Unit can be deleted"
            : "Unit is being used",
      };
    } catch (error) {
      console.error("Error checking unit usage:", error);
      throw error;
    }
  }
}
