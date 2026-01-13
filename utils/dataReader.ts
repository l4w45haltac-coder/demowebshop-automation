import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";

export interface Product {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface User {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export class DataReader {
  private static readonly DATA_DIR = path.join(process.cwd(), "test-data");

  /**
   * Read JSON file and return parsed data
   */
  static readJSON<T>(fileName: string): T {
    const filePath = path.join(this.DATA_DIR, fileName);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  }

  /**
   * Read CSV file and return parsed data
   */
  static readCSV(fileName: string): any[] {
    const filePath = path.join(this.DATA_DIR, fileName);
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      cast: true,
      cast_date: false,
    });

    return records;
  }

  /**
   * Read Excel file and return parsed data
   */
  static readExcel(fileName: string, sheetName?: string): any[] {
    const filePath = path.join(this.DATA_DIR, fileName);
    const workbook = XLSX.readFile(filePath);

    const sheet = sheetName
      ? workbook.Sheets[sheetName]
      : workbook.Sheets[workbook.SheetNames[0]];

    return XLSX.utils.sheet_to_json(sheet);
  }

  /**
   * Get products from JSON file
   */
  static getProductsFromJSON(fileName: string = "products.json"): Product[] {
    const data = this.readJSON<{ products: Product[] }>(fileName);
    return data.products;
  }

  /**
   * Get products from CSV file
   */
  static getProductsFromCSV(fileName: string = "products.csv"): Product[] {
    return this.readCSV(fileName).map((row) => ({
      name: row.name,
      category: row.category,
      price: parseFloat(row.price),
      quantity: parseInt(row.quantity),
    }));
  }

  /**
   * Get products from Excel file
   */
  static getProductsFromExcel(
    fileName: string = "products.xlsx",
    sheetName?: string
  ): Product[] {
    return this.readExcel(fileName, sheetName).map((row) => ({
      name: row.name || row.Name,
      category: row.category || row.Category,
      price: parseFloat(row.price || row.Price),
      quantity: parseInt(row.quantity || row.Quantity),
    }));
  }

  /**
   * Get users from JSON file
   */
  static getUsersFromJSON(fileName: string = "users.json"): User[] {
    const data = this.readJSON<{ users: User[] }>(fileName);
    return data.users;
  }
}
