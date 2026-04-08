declare module "better-sqlite3" {
  class Database {
    constructor(filename: string, options?: Record<string, unknown>);
    pragma(source: string, simple?: boolean): unknown;
  }
  export default Database;
}
