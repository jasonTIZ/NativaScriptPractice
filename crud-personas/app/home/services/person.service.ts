import { Person } from '../models/person';
import * as SQLite from '@nativescript/sqlite';

export class PersonService {
  private db: SQLite.Database;

  constructor() {
    new SQLite('people.db', (err, db) => {
      if (err) {
        console.error("Error al abrir la base de datos:", err);
        return;
      }
      this.db = db;
      this.init();
    });
  }

  private init() {
    this.db.execSQL(`
      CREATE TABLE IF NOT EXISTS people (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER
      );
    `);
  }

  async create(person: Person): Promise<void> {
    await this.db.execSQL(
      "INSERT INTO people (name, age) VALUES (?, ?)",
      [person.name, person.age]
    );
  }

  async getAll(): Promise<Person[]> {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM people", (err, rows) => {
        if (err) reject(err);
        else {
          const people = rows.map(row => ({
            id: row[0],
            name: row[1],
            age: row[2],
          }));
          resolve(people);
        }
      });
    });
  }

  async delete(id: number): Promise<void> {
    await this.db.execSQL("DELETE FROM people WHERE id = ?", [id]);
  }
}
