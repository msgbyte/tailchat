import { RequestHandler, Router } from 'express';
import type { LeanDocument } from 'mongoose';
import statusMessages from './statusMessages';
import type { ADPBaseModel, ADPBaseSchema } from './utils/baseModel.interface';
import castFilter from './utils/castFilter';
import convertId from './utils/convertId';
import filterGetList from './utils/filterGetList';
import { filterReadOnly } from './utils/filterReadOnly';
import parseQuery from './utils/parseQuery';
import virtualId from './utils/virtualId';

// Export certain helper functions for custom reuse.
export { default as virtualId } from './utils/virtualId';
export { default as convertId } from './utils/convertId';
export { default as castFilter } from './utils/castFilter';
export { default as parseQuery } from './utils/parseQuery';
export { default as filterGetList } from './utils/filterGetList';
export { filterReadOnly } from './utils/filterReadOnly';
export { default as statusMessages } from './statusMessages';

export interface raExpressMongooseCapabilities {
  list?: boolean;
  get?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
}

export interface raExpressMongooseOptions<T> {
  /** Fields to search from ?q (used for autofill and search) */
  q?: string[];

  /** Base name for ACLs (e.g. list operation does baseName.list) */
  aclName?: string;

  /** Fields to allow regex based search (non-exact search) */
  allowedRegexFields?: string[];

  /** Read-only fields to filter out during create and update */
  readOnlyFields?: string[];

  /** Function to transform inputs received in create and update */
  inputTransformer?: (input: Partial<T>) => Promise<Partial<T>>;

  /** Additional queries for list, e.g. deleted/hidden flag. */
  listQuery?: Record<string, any>;

  /** Max rows from a get operation to prevent accidental server suicide (default 100) */
  maxRows?: number;

  /** Extra selects for mongoose queries (in the case that certain fields are hidden by default) */
  extraSelects?: string;

  /** Disable or enable certain parts. */
  capabilities?: raExpressMongooseCapabilities;

  /** Specify a custom express.js router */
  router?: Router;

  /** Specify an ACL middleware to check against permissions */
  ACLMiddleware?: (name: string) => RequestHandler;
}

export function raExpressMongoose<T extends ADPBaseModel, I>(
  model: T,
  options?: raExpressMongooseOptions<I>
) {
  const {
    q,
    allowedRegexFields = [],
    readOnlyFields,
    inputTransformer = (input: any) => input,
    listQuery,
    extraSelects,
    maxRows = 100,
    capabilities,
    aclName,
    router = Router(),
    ACLMiddleware,
  } = options ?? {};

  const {
    list: canList = true,
    get: canGet = true,
    create: canCreate = true,
    update: canUpdate = true,
    delete: canDelete = true,
  } = capabilities ?? {};

  /** getList, getMany, getManyReference */
  if (canList)
    router.get(
      '/',
      aclName && ACLMiddleware
        ? ACLMiddleware(`${aclName}.list`)
        : (req, res, next) => next(),
      async (req, res) => {
        const filterQuery = {
          ...listQuery,
          ...parseQuery(
            castFilter(
              convertId(filterGetList(req.query)),
              model,
              allowedRegexFields
            ),
            model,
            allowedRegexFields,
            q
          ),
        };
        let query = model.find(filterQuery);

        if (req.query._sort && req.query._order)
          query = query.sort({
            [typeof req.query._sort === 'string'
              ? req.query._sort === 'id'
                ? '_id'
                : req.query._sort
              : '_id']: req.query._order === 'ASC' ? 1 : -1,
          });

        if (req.query._start)
          query = query.skip(
            parseInt(
              typeof req.query._start === 'string' ? req.query._start : '0'
            )
          );

        if (req.query._end)
          query = query.limit(
            Math.min(
              parseInt(
                typeof req.query._end === 'string' ? req.query._end : '0'
              ) -
                (req.query._start
                  ? parseInt(
                      typeof req.query._start === 'string'
                        ? req.query._start
                        : '0'
                    )
                  : 0),
              maxRows
            )
          );
        else query = query.limit(maxRows);

        if (extraSelects) query = query.select(extraSelects);

        if (Object.keys(filterQuery).length === 0) {
          res.set(
            'X-Total-Count',
            (await model.estimatedDocumentCount()).toString()
          );
        } else {
          res.set(
            'X-Total-Count',
            (await model.countDocuments(filterQuery)).toString()
          );
        }

        return res.json(
          virtualId((await query.lean()) as LeanDocument<ADPBaseSchema>)
        );
      }
    );

  /** getOne, getMany */
  if (canGet)
    router.get(
      '/:id',
      aclName && ACLMiddleware
        ? ACLMiddleware(`${aclName}.list`)
        : (req, res, next) => next(),
      async (req, res) => {
        await model
          .findById(req.params.id)
          .select(extraSelects)
          .lean()
          .then((result) => res.json(virtualId(result)))
          .catch((e) => {
            return statusMessages.error(res, 400, e);
          });
      }
    );

  /** create */
  if (canCreate)
    router.post(
      '/',
      aclName && ACLMiddleware
        ? ACLMiddleware(`${aclName}.create`)
        : (req, res, next) => next(),
      async (req, res) => {
        // eslint-disable-next-line new-cap
        const result = convertId(
          await inputTransformer(filterReadOnly<I>(req.body, readOnlyFields))
        );
        const newData = {
          ...result,
        };

        const newEntry = new model(newData);
        await newEntry
          .save()
          .then((result) => res.json(virtualId(result)))
          .catch((e: any) => {
            return statusMessages.error(res, 400, e, 'Bad request');
          });
      }
    );

  /** update */
  if (canUpdate)
    router.put(
      '/:id',
      aclName && ACLMiddleware
        ? ACLMiddleware(`${aclName}.edit`)
        : (req, res, next) => next(),
      async (req, res) => {
        const updateData = {
          ...(await convertId(
            await inputTransformer(filterReadOnly<I>(req.body, readOnlyFields))
          )),
        };

        await model
          .findOneAndUpdate({ _id: req.params.id }, updateData, {
            new: true,
            runValidators: true,
          })
          .lean()
          .then((result) => res.json(virtualId(result)))
          .catch((e) => {
            return statusMessages.error(res, 400, e, 'Bad request');
          });
      }
    );

  /**
   * delete
   */
  if (canDelete)
    router.delete(
      '/:id',
      aclName && ACLMiddleware
        ? ACLMiddleware(`${aclName}.delete`)
        : (req, res, next) => next(),
      async (req, res) => {
        await model
          .findOneAndDelete({ _id: req.params.id })
          .then((result) => res.json(virtualId(result)))
          .catch((e) => {
            return statusMessages.error(res, 404, e, 'Element does not exist');
          });
      }
    );

  return router;
}
