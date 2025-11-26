import { getMovements } from '../utils/logger.js';

export class Movement {
  static async findAll(filters = {}) {
    return await getMovements(filters);
  }
}

