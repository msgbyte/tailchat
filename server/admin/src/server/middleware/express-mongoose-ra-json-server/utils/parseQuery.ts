import type { ADPBaseModel } from './baseModel.interface';
import castFilter from './castFilter';
import { isValidObjectId } from 'mongoose';

interface parseQueryParam {
  q?: string;
  $or?: any;
}

/**
 * Turns ?q into $or queries, deletes q
 * @param {Object} results Original object with the q field
 * @param {string[]} fields Fields to apply q to
 */
export default function parseQuery<
  T extends parseQueryParam,
  M extends ADPBaseModel
>(
  result: T,
  model: M,
  allowedRegexes: string[],
  fields?: string[]
): T & { $or?: any } {
  if (!fields) return result;
  if (result.q) {
    if (!Array.isArray(result.$or)) result.$or = [];
    fields.forEach((field) => {
      if (field === '_id' && !isValidObjectId(result.q)) {
        // Skip _id search in invalid objectid
        return;
      }
      const newFilter = { [field]: result.q };
      result.$or.push(castFilter(newFilter, model, allowedRegexes));
    });
    delete result.q;
  }
  return result;
}
