/**
 * Changes the local configuration of a schema.
 *
 * @param schema The schema to configure.
 * @param config The parse configuration.
 *
 * @returns The configured schema.
 */
declare function config<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(schema: TSchema, config: Config<InferIssue<TSchema>>): TSchema;

/**
 * Fallback type.
 */
type Fallback<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>> = InferOutput<TSchema> | ((dataset?: Dataset<InferOutput<TSchema>, InferIssue<TSchema>>, config?: Config<InferIssue<TSchema>>) => InferOutput<TSchema>);
/**
 * Schema with fallback type.
 */
type SchemaWithFallback<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TFallback extends Fallback<TSchema>> = TSchema & {
    /**
     * The fallback value.
     */
    readonly fallback: TFallback;
};
/**
 * Returns a fallback value as output if the input does not match the schema.
 *
 * @param schema The schema to catch.
 * @param fallback The fallback value.
 *
 * @returns The passed schema.
 */
declare function fallback<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TFallback extends Fallback<TSchema>>(schema: TSchema, fallback: TFallback): SchemaWithFallback<TSchema, TFallback>;

/**
 * Fallback async type.
 */
type FallbackAsync<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = InferOutput<TSchema> | ((dataset?: Dataset<InferOutput<TSchema>, InferIssue<TSchema>>, config?: Config<InferIssue<TSchema>>) => MaybePromise<InferOutput<TSchema>>);
/**
 * Schema with fallback async type.
 */
type SchemaWithFallbackAsync<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TFallback extends FallbackAsync<TSchema>> = Omit<TSchema, 'async' | '_run'> & {
    /**
     * The fallback value.
     */
    readonly fallback: TFallback;
    /**
     * Whether it's async.
     */
    readonly async: true;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    readonly _run: (dataset: Dataset<unknown, never>, config: Config<InferIssue<TSchema>>) => Promise<Dataset<InferOutput<TSchema>, InferIssue<TSchema>>>;
};
/**
 * Returns a fallback value as output if the input does not match the schema.
 *
 * @param schema The schema to catch.
 * @param fallback The fallback value.
 *
 * @returns The passed schema.
 */
declare function fallbackAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TFallback extends FallbackAsync<TSchema>>(schema: TSchema, fallback: TFallback): SchemaWithFallbackAsync<TSchema, TFallback>;

/**
 * Flat errors type.
 */
type FlatErrors<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>> | undefined> = Prettify<{
    /**
     * The root errors.
     *
     * Hint: The error messages of issues without a path that belong to the root
     * of the schema are added to this key.
     */
    readonly root?: [string, ...string[]];
    /**
     * The nested errors.
     *
     * Hint: The error messages of issues with a path that belong to the nested
     * parts of the schema and can be converted to a dot path are added to this
     * key.
     */
    readonly nested?: Prettify<Readonly<Partial<Record<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>> ? IssueDotPath<TSchema> : string, [
        string,
        ...string[]
    ]>>>>;
    /**
     * The other errors.
     *
     * Hint: Some issue paths, for example for complex data types like `Set` and
     * `Map`, have no key or a key that cannot be converted to a dot path. These
     * error messages are added to this key.
     */
    readonly other?: [string, ...string[]];
}>;
/**
 * Flatten the error messages of issues.
 *
 * @param issues The list of issues.
 *
 * @returns A flat error object.
 */
declare function flatten(issues: [BaseIssue<unknown>, ...BaseIssue<unknown>[]]): FlatErrors<undefined>;
/**
 * Flatten the error messages of issues.
 *
 * @param issues The list of issues.
 *
 * @returns A flat error object.
 */
declare function flatten<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(issues: [InferIssue<TSchema>, ...InferIssue<TSchema>[]]): FlatErrors<TSchema>;

/**
 * Forwards the issues of the passed validation action.
 *
 * @param action The validation action.
 * @param pathKeys The path keys.
 *
 * @returns The modified action.
 */
declare function forward<TInput extends Record<string, unknown> | ArrayLike<unknown>, TIssue extends BaseIssue<unknown>>(action: BaseValidation<TInput, TInput, TIssue>, pathKeys: PathKeys<TInput>): BaseValidation<TInput, TInput, TIssue>;

/**
 * Forwards the issues of the passed validation action.
 *
 * @param action The validation action.
 * @param pathKeys The path keys.
 *
 * @returns The modified action.
 */
declare function forwardAsync<TInput extends Record<string, unknown> | ArrayLike<unknown>, TIssue extends BaseIssue<unknown>>(action: BaseValidation<TInput, TInput, TIssue> | BaseValidationAsync<TInput, TInput, TIssue>, pathKeys: PathKeys<TInput>): BaseValidationAsync<TInput, TInput, TIssue>;

/**
 * Any schema type.
 */
interface AnySchema extends BaseSchema<any, any, never> {
    /**
     * The schema type.
     */
    readonly type: 'any';
    /**
     * The schema reference.
     */
    readonly reference: typeof any;
    /**
     * The expected property.
     */
    readonly expects: 'any';
}
/**
 * Creates an any schema.
 *
 * Hint: This schema function exists only for completeness and is not
 * recommended in practice. Instead, `unknown` should be used to accept
 * unknown data.
 *
 * @returns An any schema.
 */
declare function any(): AnySchema;

/**
 * Array issue type.
 */
interface ArrayIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'array';
    /**
     * The expected property.
     */
    readonly expected: 'Array';
}

/**
 * Array schema type.
 */
interface ArraySchema<TItem extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<ArrayIssue> | undefined> extends BaseSchema<InferInput<TItem>[], InferOutput<TItem>[], ArrayIssue | InferIssue<TItem>> {
    /**
     * The schema type.
     */
    readonly type: 'array';
    /**
     * The schema reference.
     */
    readonly reference: typeof array;
    /**
     * The expected property.
     */
    readonly expects: 'Array';
    /**
     * The array item schema.
     */
    readonly item: TItem;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an array schema.
 *
 * @param item The item schema.
 *
 * @returns An array schema.
 */
declare function array<const TItem extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(item: TItem): ArraySchema<TItem, undefined>;
/**
 * Creates an array schema.
 *
 * @param item The item schema.
 * @param message The error message.
 *
 * @returns An array schema.
 */
declare function array<const TItem extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<ArrayIssue> | undefined>(item: TItem, message: TMessage): ArraySchema<TItem, TMessage>;

/**
 * Array schema type.
 */
interface ArraySchemaAsync<TItem extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<ArrayIssue> | undefined> extends BaseSchemaAsync<InferInput<TItem>[], InferOutput<TItem>[], ArrayIssue | InferIssue<TItem>> {
    /**
     * The schema type.
     */
    readonly type: 'array';
    /**
     * The schema reference.
     */
    readonly reference: typeof arrayAsync;
    /**
     * The expected property.
     */
    readonly expects: 'Array';
    /**
     * The array item schema.
     */
    readonly item: TItem;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an array schema.
 *
 * @param item The item schema.
 *
 * @returns An array schema.
 */
declare function arrayAsync<const TItem extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(item: TItem): ArraySchemaAsync<TItem, undefined>;
/**
 * Creates an array schema.
 *
 * @param item The item schema.
 * @param message The error message.
 *
 * @returns An array schema.
 */
declare function arrayAsync<const TItem extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<ArrayIssue> | undefined>(item: TItem, message: TMessage): ArraySchemaAsync<TItem, TMessage>;

/**
 * Bigint issue type.
 */
interface BigintIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'bigint';
    /**
     * The expected property.
     */
    readonly expected: 'bigint';
}
/**
 * Bigint schema type.
 */
interface BigintSchema<TMessage extends ErrorMessage<BigintIssue> | undefined> extends BaseSchema<bigint, bigint, BigintIssue> {
    /**
     * The schema type.
     */
    readonly type: 'bigint';
    /**
     * The schema reference.
     */
    readonly reference: typeof bigint;
    /**
     * The expected property.
     */
    readonly expects: 'bigint';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a bigint schema.
 *
 * @returns A bigint schema.
 */
declare function bigint(): BigintSchema<undefined>;
/**
 * Creates a bigint schema.
 *
 * @param message The error message.
 *
 * @returns A bigint schema.
 */
declare function bigint<const TMessage extends ErrorMessage<BigintIssue> | undefined>(message: TMessage): BigintSchema<TMessage>;

/**
 * Blob issue type.
 */
interface BlobIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'blob';
    /**
     * The expected property.
     */
    readonly expected: 'Blob';
}
/**
 * Blob schema type.
 */
interface BlobSchema<TMessage extends ErrorMessage<BlobIssue> | undefined> extends BaseSchema<Blob, Blob, BlobIssue> {
    /**
     * The schema type.
     */
    readonly type: 'blob';
    /**
     * The schema reference.
     */
    readonly reference: typeof blob;
    /**
     * The expected property.
     */
    readonly expects: 'Blob';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a blob schema.
 *
 * @returns A blob schema.
 */
declare function blob(): BlobSchema<undefined>;
/**
 * Creates a blob schema.
 *
 * @param message The error message.
 *
 * @returns A blob schema.
 */
declare function blob<const TMessage extends ErrorMessage<BlobIssue> | undefined>(message: TMessage): BlobSchema<TMessage>;

/**
 * Boolean issue type.
 */
interface BooleanIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'boolean';
    /**
     * The expected property.
     */
    readonly expected: 'boolean';
}
/**
 * Boolean schema type.
 */
interface BooleanSchema<TMessage extends ErrorMessage<BooleanIssue> | undefined> extends BaseSchema<boolean, boolean, BooleanIssue> {
    /**
     * The schema type.
     */
    readonly type: 'boolean';
    /**
     * The schema reference.
     */
    readonly reference: typeof boolean;
    /**
     * The expected property.
     */
    readonly expects: 'boolean';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a boolean schema.
 *
 * @returns A boolean schema.
 */
declare function boolean(): BooleanSchema<undefined>;
/**
 * Creates a boolean schema.
 *
 * @param message The error message.
 *
 * @returns A boolean schema.
 */
declare function boolean<const TMessage extends ErrorMessage<BooleanIssue> | undefined>(message: TMessage): BooleanSchema<TMessage>;

/**
 * Custom issue type.
 */
interface CustomIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'custom';
    /**
     * The expected property.
     */
    readonly expected: 'unknown';
}

/**
 * Check type.
 */
type Check = (input: unknown) => boolean;
/**
 * Custom schema type.
 */
interface CustomSchema<TInput, TMessage extends ErrorMessage<CustomIssue> | undefined> extends BaseSchema<TInput, TInput, CustomIssue> {
    /**
     * The schema type.
     */
    readonly type: 'custom';
    /**
     * The schema reference.
     */
    readonly reference: typeof custom;
    /**
     * The expected property.
     */
    readonly expects: 'unknown';
    /**
     * The type check function.
     */
    readonly check: Check;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a custom schema.
 *
 * @param check The type check function.
 *
 * @returns A custom schema.
 */
declare function custom<TInput>(check: Check): CustomSchema<TInput, undefined>;
/**
 * Creates a custom schema.
 *
 * @param check The type check function.
 * @param message The error message.
 *
 * @returns A custom schema.
 */
declare function custom<TInput, const TMessage extends ErrorMessage<CustomIssue> | undefined = ErrorMessage<CustomIssue> | undefined>(check: Check, message: TMessage): CustomSchema<TInput, TMessage>;

/**
 * Check async type.
 */
type CheckAsync = (input: unknown) => MaybePromise<boolean>;
/**
 * Custom schema async type.
 */
interface CustomSchemaAsync<TInput, TMessage extends ErrorMessage<CustomIssue> | undefined> extends BaseSchemaAsync<TInput, TInput, CustomIssue> {
    /**
     * The schema type.
     */
    readonly type: 'custom';
    /**
     * The schema reference.
     */
    readonly reference: typeof customAsync;
    /**
     * The expected property.
     */
    readonly expects: 'unknown';
    /**
     * The type check function.
     */
    readonly check: CheckAsync;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a custom schema.
 *
 * @param check The type check function.
 *
 * @returns A custom schema.
 */
declare function customAsync<TInput>(check: CheckAsync): CustomSchemaAsync<TInput, undefined>;
/**
 * Creates a custom schema.
 *
 * @param check The type check function.
 * @param message The error message.
 *
 * @returns A custom schema.
 */
declare function customAsync<TInput, const TMessage extends ErrorMessage<CustomIssue> | undefined = ErrorMessage<CustomIssue> | undefined>(check: CheckAsync, message: TMessage): CustomSchemaAsync<TInput, TMessage>;

/**
 * Date issue type.
 */
interface DateIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'date';
    /**
     * The expected property.
     */
    readonly expected: 'Date';
}
/**
 * Date schema type.
 */
interface DateSchema<TMessage extends ErrorMessage<DateIssue> | undefined> extends BaseSchema<Date, Date, DateIssue> {
    /**
     * The schema type.
     */
    readonly type: 'date';
    /**
     * The schema reference.
     */
    readonly reference: typeof date;
    /**
     * The expected property.
     */
    readonly expects: 'Date';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a date schema.
 *
 * @returns A date schema.
 */
declare function date(): DateSchema<undefined>;
/**
 * Creates a date schema.
 *
 * @param message The error message.
 *
 * @returns A date schema.
 */
declare function date<const TMessage extends ErrorMessage<DateIssue> | undefined>(message: TMessage): DateSchema<TMessage>;

/**
 * Enum type.
 */
interface Enum {
    [key: string]: string | number;
}
/**
 * Enum issue type.
 */
interface EnumIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'enum';
    /**
     * The expected property.
     */
    readonly expected: string;
}
/**
 * Enum schema type.
 */
interface EnumSchema<TEnum extends Enum, TMessage extends ErrorMessage<EnumIssue> | undefined> extends BaseSchema<TEnum[keyof TEnum], TEnum[keyof TEnum], EnumIssue> {
    /**
     * The schema type.
     */
    readonly type: 'enum';
    /**
     * The schema reference.
     */
    readonly reference: typeof enum_;
    /**
     * The enum object.
     */
    readonly enum: TEnum;
    /**
     * The enum options.
     */
    readonly options: TEnum[keyof TEnum][];
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an enum schema.
 *
 * @param enum__ The enum object.
 *
 * @returns An enum schema.
 */
declare function enum_<const TEnum extends Enum>(enum__: TEnum): EnumSchema<TEnum, undefined>;
/**
 * Creates an enum schema.
 *
 * @param enum__ The enum object.
 * @param message The error message.
 *
 * @returns An enum schema.
 */
declare function enum_<const TEnum extends Enum, const TMessage extends ErrorMessage<EnumIssue> | undefined>(enum__: TEnum, message: TMessage): EnumSchema<TEnum, TMessage>;

/**
 * File issue type.
 */
interface FileIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'file';
    /**
     * The expected property.
     */
    readonly expected: 'File';
}
/**
 * File schema type.
 */
interface FileSchema<TMessage extends ErrorMessage<FileIssue> | undefined> extends BaseSchema<File, File, FileIssue> {
    /**
     * The schema type.
     */
    readonly type: 'file';
    /**
     * The schema reference.
     */
    readonly reference: typeof file;
    /**
     * The expected property.
     */
    readonly expects: 'File';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a file schema.
 *
 * @returns A file schema.
 */
declare function file(): FileSchema<undefined>;
/**
 * Creates a file schema.
 *
 * @param message The error message.
 *
 * @returns A file schema.
 */
declare function file<const TMessage extends ErrorMessage<FileIssue> | undefined>(message: TMessage): FileSchema<TMessage>;

/**
 * Function issue type.
 */
interface FunctionIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'function';
    /**
     * The expected property.
     */
    readonly expected: 'Function';
}
/**
 * Function schema type.
 */
interface FunctionSchema<TMessage extends ErrorMessage<FunctionIssue> | undefined> extends BaseSchema<(...args: unknown[]) => unknown, (...args: unknown[]) => unknown, FunctionIssue> {
    /**
     * The schema type.
     */
    readonly type: 'function';
    /**
     * The schema reference.
     */
    readonly reference: typeof function_;
    /**
     * The expected property.
     */
    readonly expects: 'Function';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a function schema.
 *
 * @returns A function schema.
 */
declare function function_(): FunctionSchema<undefined>;
/**
 * Creates a function schema.
 *
 * @param message The error message.
 *
 * @returns A function schema.
 */
declare function function_<const TMessage extends ErrorMessage<FunctionIssue> | undefined>(message: TMessage): FunctionSchema<TMessage>;

/**
 * Class type.
 */
type Class = new (...args: any[]) => any;
/**
 * Instance issue type.
 */
interface InstanceIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'instance';
    /**
     * The expected property.
     */
    readonly expected: string;
}
/**
 * Instance schema type.
 */
interface InstanceSchema<TClass extends Class, TMessage extends ErrorMessage<InstanceIssue> | undefined> extends BaseSchema<InstanceType<TClass>, InstanceType<TClass>, InstanceIssue> {
    /**
     * The schema type.
     */
    readonly type: 'instance';
    /**
     * The schema reference.
     */
    readonly reference: typeof instance;
    /**
     * The class of the instance.
     */
    readonly class: TClass;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an instance schema.
 *
 * @param class_ The class of the instance.
 *
 * @returns An instance schema.
 */
declare function instance<TClass extends Class>(class_: TClass): InstanceSchema<TClass, undefined>;
/**
 * Creates an instance schema.
 *
 * @param class_ The class of the instance.
 * @param message The error message.
 *
 * @returns An instance schema.
 */
declare function instance<TClass extends Class, const TMessage extends ErrorMessage<InstanceIssue> | undefined>(class_: TClass, message: TMessage): InstanceSchema<TClass, TMessage>;

/**
 * Intersect issue type.
 */
interface IntersectIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'intersect';
    /**
     * The expected property.
     */
    readonly expected: string;
}
/**
 * Intersect options type.
 */
type IntersectOptions = MaybeReadonly<BaseSchema<unknown, unknown, BaseIssue<unknown>>[]>;
/**
 * Intersect options async type.
 */
type IntersectOptionsAsync = MaybeReadonly<(BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>)[]>;
/**
 * Infer option type.
 */
type InferOption<TInput, TOutput> = BaseSchema<TInput, TOutput, BaseIssue<unknown>> | BaseSchemaAsync<TInput, TOutput, BaseIssue<unknown>>;
/**
 * Infer intersect input type.
 */
type InferIntersectInput<TOptions extends IntersectOptions | IntersectOptionsAsync> = TOptions extends readonly [
    InferOption<infer TInput, unknown>,
    ...infer TRest
] ? TRest extends readonly [
    InferOption<unknown, unknown>,
    ...InferOption<unknown, unknown>[]
] ? TInput & InferIntersectInput<TRest> : TInput : never;
/**
 * Infer intersect output type.
 */
type InferIntersectOutput<TOptions extends IntersectOptions | IntersectOptionsAsync> = TOptions extends readonly [
    InferOption<unknown, infer TOutput>,
    ...infer TRest
] ? TRest extends readonly [
    InferOption<unknown, unknown>,
    ...InferOption<unknown, unknown>[]
] ? TOutput & InferIntersectOutput<TRest> : TOutput : never;

/**
 * Intersect schema type.
 */
interface IntersectSchema<TOptions extends IntersectOptions, TMessage extends ErrorMessage<IntersectIssue> | undefined> extends BaseSchema<InferIntersectInput<TOptions>, InferIntersectOutput<TOptions>, IntersectIssue | InferIssue<TOptions[number]>> {
    /**
     * The schema type.
     */
    readonly type: 'intersect';
    /**
     * The schema reference.
     */
    readonly reference: typeof intersect;
    /**
     * The intersect options.
     */
    readonly options: TOptions;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an intersect schema.
 *
 * @param options The intersect options.
 *
 * @returns An intersect schema.
 */
declare function intersect<const TOptions extends IntersectOptions>(options: TOptions): IntersectSchema<TOptions, undefined>;
/**
 * Creates an intersect schema.
 *
 * @param options The intersect options.
 * @param message The error message.
 *
 * @returns An intersect schema.
 */
declare function intersect<const TOptions extends IntersectOptions, const TMessage extends ErrorMessage<IntersectIssue> | undefined>(options: TOptions, message: TMessage): IntersectSchema<TOptions, TMessage>;

/**
 * Intersect schema async type.
 */
interface IntersectSchemaAsync<TOptions extends IntersectOptionsAsync, TMessage extends ErrorMessage<IntersectIssue> | undefined> extends BaseSchemaAsync<InferIntersectInput<TOptions>, InferIntersectOutput<TOptions>, IntersectIssue | InferIssue<TOptions[number]>> {
    /**
     * The schema type.
     */
    readonly type: 'intersect';
    /**
     * The schema reference.
     */
    readonly reference: typeof intersectAsync;
    /**
     * The intersect options.
     */
    readonly options: TOptions;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an intersect schema.
 *
 * @param options The intersect options.
 *
 * @returns An intersect schema.
 */
declare function intersectAsync<const TOptions extends IntersectOptionsAsync>(options: TOptions): IntersectSchemaAsync<TOptions, undefined>;
/**
 * Creates an intersect schema.
 *
 * @param options The intersect options.
 * @param message The error message.
 *
 * @returns An intersect schema.
 */
declare function intersectAsync<const TOptions extends IntersectOptionsAsync, const TMessage extends ErrorMessage<IntersectIssue> | undefined>(options: TOptions, message: TMessage): IntersectSchemaAsync<TOptions, TMessage>;

/**
 * Lazy schema type.
 */
interface LazySchema<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>> extends BaseSchema<InferInput<TWrapped>, InferOutput<TWrapped>, InferIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'lazy';
    /**
     * The schema reference.
     */
    readonly reference: typeof lazy;
    /**
     * The expected property.
     */
    readonly expects: 'unknown';
    /**
     * The schema getter.
     */
    readonly getter: (input: unknown) => TWrapped;
}
/**
 * Creates a lazy schema.
 *
 * @param getter The schema getter.
 *
 * @returns A lazy schema.
 */
declare function lazy<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(getter: (input: unknown) => TWrapped): LazySchema<TWrapped>;

/**
 * Lazy schema async type.
 */
interface LazySchemaAsync<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> extends BaseSchemaAsync<InferInput<TWrapped>, InferOutput<TWrapped>, InferIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'lazy';
    /**
     * The schema reference.
     */
    readonly reference: typeof lazyAsync;
    /**
     * The expected property.
     */
    readonly expects: 'unknown';
    /**
     * The schema getter.
     */
    readonly getter: (input: unknown) => MaybePromise<TWrapped>;
}
/**
 * Creates a lazy schema.
 *
 * @param getter The schema getter.
 *
 * @returns A lazy schema.
 */
declare function lazyAsync<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(getter: (input: unknown) => MaybePromise<TWrapped>): LazySchemaAsync<TWrapped>;

/**
 * Literal type.
 */
type Literal = bigint | boolean | number | string | symbol;
/**
 * Literal issue type.
 */
interface LiteralIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'literal';
    /**
     * The expected property.
     */
    readonly expected: string;
}
/**
 * Literal schema type.
 */
interface LiteralSchema<TLiteral extends Literal, TMessage extends ErrorMessage<LiteralIssue> | undefined> extends BaseSchema<TLiteral, TLiteral, LiteralIssue> {
    /**
     * The schema type.
     */
    readonly type: 'literal';
    /**
     * The schema reference.
     */
    readonly reference: typeof literal;
    /**
     * The literal value.
     */
    readonly literal: TLiteral;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a literal schema.
 *
 * @param literal_ The literal value.
 *
 * @returns A literal schema.
 */
declare function literal<const TLiteral extends Literal>(literal_: TLiteral): LiteralSchema<TLiteral, undefined>;
/**
 * Creates a literal schema.
 *
 * @param literal_ The literal value.
 * @param message The error message.
 *
 * @returns A literal schema.
 */
declare function literal<const TLiteral extends Literal, const TMessage extends ErrorMessage<LiteralIssue> | undefined>(literal_: TLiteral, message: TMessage): LiteralSchema<TLiteral, TMessage>;

/**
 * Loose object issue type.
 */
interface LooseObjectIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'loose_object';
    /**
     * The expected property.
     */
    readonly expected: 'Object';
}

/**
 * Loose object schema type.
 */
interface LooseObjectSchema<TEntries extends ObjectEntries, TMessage extends ErrorMessage<LooseObjectIssue> | undefined> extends BaseSchema<InferObjectInput<TEntries> & {
    [key: string]: unknown;
}, InferObjectOutput<TEntries> & {
    [key: string]: unknown;
}, LooseObjectIssue | InferObjectIssue<TEntries>> {
    /**
     * The schema type.
     */
    readonly type: 'loose_object';
    /**
     * The schema reference.
     */
    readonly reference: typeof looseObject;
    /**
     * The expected property.
     */
    readonly expects: 'Object';
    /**
     * The entries schema.
     */
    readonly entries: TEntries;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a loose object schema.
 *
 * @param entries The entries schema.
 *
 * @returns A loose object schema.
 */
declare function looseObject<const TEntries extends ObjectEntries>(entries: TEntries): LooseObjectSchema<TEntries, undefined>;
/**
 * Creates a loose object schema.
 *
 * @param entries The entries schema.
 * @param message The error message.
 *
 * @returns A loose object schema.
 */
declare function looseObject<const TEntries extends ObjectEntries, const TMessage extends ErrorMessage<LooseObjectIssue> | undefined>(entries: TEntries, message: TMessage): LooseObjectSchema<TEntries, TMessage>;

/**
 * Object schema async type.
 */
interface LooseObjectSchemaAsync<TEntries extends ObjectEntriesAsync, TMessage extends ErrorMessage<LooseObjectIssue> | undefined> extends BaseSchemaAsync<InferObjectInput<TEntries> & {
    [key: string]: unknown;
}, InferObjectOutput<TEntries> & {
    [key: string]: unknown;
}, LooseObjectIssue | InferObjectIssue<TEntries>> {
    /**
     * The schema type.
     */
    readonly type: 'loose_object';
    /**
     * The schema reference.
     */
    readonly reference: typeof looseObjectAsync;
    /**
     * The expected property.
     */
    readonly expects: 'Object';
    /**
     * The entries schema.
     */
    readonly entries: TEntries;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a loose object schema.
 *
 * @param entries The entries schema.
 *
 * @returns A loose object schema.
 */
declare function looseObjectAsync<const TEntries extends ObjectEntriesAsync>(entries: TEntries): LooseObjectSchemaAsync<TEntries, undefined>;
/**
 * Creates a loose object schema.
 *
 * @param entries The entries schema.
 * @param message The error message.
 *
 * @returns A loose object schema.
 */
declare function looseObjectAsync<const TEntries extends ObjectEntriesAsync, const TMessage extends ErrorMessage<LooseObjectIssue> | undefined>(entries: TEntries, message: TMessage): LooseObjectSchemaAsync<TEntries, TMessage>;

/**
 * Loose tuple issue type.
 */
interface LooseTupleIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'loose_tuple';
    /**
     * The expected property.
     */
    readonly expected: 'Array';
}

/**
 * Loose tuple schema type.
 */
interface LooseTupleSchema<TItems extends TupleItems, TMessage extends ErrorMessage<LooseTupleIssue> | undefined> extends BaseSchema<[
    ...InferTupleInput<TItems>,
    ...unknown[]
], [
    ...InferTupleOutput<TItems>,
    ...unknown[]
], LooseTupleIssue | InferTupleIssue<TItems>> {
    /**
     * The schema type.
     */
    readonly type: 'loose_tuple';
    /**
     * The schema reference.
     */
    readonly reference: typeof looseTuple;
    /**
     * The expected property.
     */
    readonly expects: 'Array';
    /**
     * The items schema.
     */
    readonly items: TItems;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a loose tuple schema.
 *
 * @param items The items schema.
 *
 * @returns A loose tuple schema.
 */
declare function looseTuple<const TItems extends TupleItems>(items: TItems): LooseTupleSchema<TItems, undefined>;
/**
 * Creates a loose tuple schema.
 *
 * @param items The items schema.
 * @param message The error message.
 *
 * @returns A loose tuple schema.
 */
declare function looseTuple<const TItems extends TupleItems, const TMessage extends ErrorMessage<LooseTupleIssue> | undefined>(items: TItems, message: TMessage): LooseTupleSchema<TItems, TMessage>;

/**
 * Loose tuple schema async type.
 */
interface LooseTupleSchemaAsync<TItems extends TupleItemsAsync, TMessage extends ErrorMessage<LooseTupleIssue> | undefined> extends BaseSchemaAsync<[
    ...InferTupleInput<TItems>,
    ...unknown[]
], [
    ...InferTupleOutput<TItems>,
    ...unknown[]
], LooseTupleIssue | InferTupleIssue<TItems>> {
    /**
     * The schema type.
     */
    readonly type: 'loose_tuple';
    /**
     * The schema reference.
     */
    readonly reference: typeof looseTupleAsync;
    /**
     * The expected property.
     */
    readonly expects: 'Array';
    /**
     * The items schema.
     */
    readonly items: TItems;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a loose tuple schema.
 *
 * @param items The items schema.
 *
 * @returns A loose tuple schema.
 */
declare function looseTupleAsync<const TItems extends TupleItemsAsync>(items: TItems): LooseTupleSchemaAsync<TItems, undefined>;
/**
 * Creates a loose tuple schema.
 *
 * @param items The items schema.
 * @param message The error message.
 *
 * @returns A loose tuple schema.
 */
declare function looseTupleAsync<const TItems extends TupleItemsAsync, const TMessage extends ErrorMessage<LooseTupleIssue> | undefined>(items: TItems, message: TMessage): LooseTupleSchemaAsync<TItems, TMessage>;

/**
 * Map issue type.
 */
interface MapIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'map';
    /**
     * The expected property.
     */
    readonly expected: 'Map';
}
/**
 * Infer map input type.
 */
type InferMapInput<TKey extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = Map<InferInput<TKey>, InferInput<TValue>>;
/**
 * Infer map output type.
 */
type InferMapOutput<TKey extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = Map<InferOutput<TKey>, InferOutput<TValue>>;

/**
 * Map schema type.
 */
interface MapSchema<TKey extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<MapIssue> | undefined> extends BaseSchema<InferMapInput<TKey, TValue>, InferMapOutput<TKey, TValue>, MapIssue | InferIssue<TKey> | InferIssue<TValue>> {
    /**
     * The schema type.
     */
    readonly type: 'map';
    /**
     * The schema reference.
     */
    readonly reference: typeof map;
    /**
     * The expected property.
     */
    readonly expects: 'Map';
    /**
     * The map key schema.
     */
    readonly key: TKey;
    /**
     * The map value schema.
     */
    readonly value: TValue;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 *
 * @returns A map schema.
 */
declare function map<const TKey extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(key: TKey, value: TValue): MapSchema<TKey, TValue, undefined>;
/**
 * Creates a map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param message The error message.
 *
 * @returns A map schema.
 */
declare function map<const TKey extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<MapIssue> | undefined>(key: TKey, value: TValue, message: TMessage): MapSchema<TKey, TValue, TMessage>;

/**
 * Map schema async type.
 */
interface MapSchemaAsync<TKey extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<MapIssue> | undefined> extends BaseSchemaAsync<InferMapInput<TKey, TValue>, InferMapOutput<TKey, TValue>, MapIssue | InferIssue<TKey> | InferIssue<TValue>> {
    /**
     * The schema type.
     */
    readonly type: 'map';
    /**
     * The schema reference.
     */
    readonly reference: typeof mapAsync;
    /**
     * The expected property.
     */
    readonly expects: 'Map';
    /**
     * The map key schema.
     */
    readonly key: TKey;
    /**
     * The map value schema.
     */
    readonly value: TValue;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 *
 * @returns A map schema.
 */
declare function mapAsync<const TKey extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(key: TKey, value: TValue): MapSchemaAsync<TKey, TValue, undefined>;
/**
 * Creates a map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param message The error message.
 *
 * @returns A map schema.
 */
declare function mapAsync<const TKey extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<MapIssue> | undefined>(key: TKey, value: TValue, message: TMessage): MapSchemaAsync<TKey, TValue, TMessage>;

/**
 * NaN issue type.
 */
interface NanIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'nan';
    /**
     * The expected property.
     */
    readonly expected: 'NaN';
}
/**
 * NaN schema type.
 */
interface NanSchema<TMessage extends ErrorMessage<NanIssue> | undefined> extends BaseSchema<number, number, NanIssue> {
    /**
     * The schema type.
     */
    readonly type: 'nan';
    /**
     * The schema reference.
     */
    readonly reference: typeof nan;
    /**
     * The expected property.
     */
    readonly expects: 'NaN';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a NaN schema.
 *
 * @returns A NaN schema.
 */
declare function nan(): NanSchema<undefined>;
/**
 * Creates a NaN schema.
 *
 * @param message The error message.
 *
 * @returns A NaN schema.
 */
declare function nan<const TMessage extends ErrorMessage<NanIssue> | undefined>(message: TMessage): NanSchema<TMessage>;

/**
 * Never issue type.
 */
interface NeverIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'never';
    /**
     * The expected property.
     */
    readonly expected: 'never';
}
/**
 * Never schema type.
 */
interface NeverSchema<TMessage extends ErrorMessage<NeverIssue> | undefined> extends BaseSchema<never, never, NeverIssue> {
    /**
     * The schema type.
     */
    readonly type: 'never';
    /**
     * The schema reference.
     */
    readonly reference: typeof never;
    /**
     * The expected property.
     */
    readonly expects: 'never';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a never schema.
 *
 * @returns A never schema.
 */
declare function never(): NeverSchema<undefined>;
/**
 * Creates a never schema.
 *
 * @param message The error message.
 *
 * @returns A never schema.
 */
declare function never<const TMessage extends ErrorMessage<NeverIssue> | undefined>(message: TMessage): NeverSchema<TMessage>;

/**
 * Union issue type.
 */
interface UnionIssue<TSubIssue extends BaseIssue<unknown>> extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'union';
    /**
     * The expected property.
     */
    readonly expected: string;
    /**
     * The sub issues.
     */
    readonly issues?: [TSubIssue, ...TSubIssue[]];
}

/**
 * Union options type.
 */
type UnionOptions = MaybeReadonly<BaseSchema<unknown, unknown, BaseIssue<unknown>>[]>;
/**
 * Union schema type.
 */
interface UnionSchema<TOptions extends UnionOptions, TMessage extends ErrorMessage<UnionIssue<InferIssue<TOptions[number]>>> | undefined> extends BaseSchema<InferInput<TOptions[number]>, InferOutput<TOptions[number]>, UnionIssue<InferIssue<TOptions[number]>> | InferIssue<TOptions[number]>> {
    /**
     * The schema type.
     */
    readonly type: 'union';
    /**
     * The schema reference.
     */
    readonly reference: typeof union;
    /**
     * The union options.
     */
    readonly options: TOptions;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an union schema.
 *
 * @param options The union options.
 *
 * @returns An union schema.
 */
declare function union<const TOptions extends UnionOptions>(options: TOptions): UnionSchema<TOptions, undefined>;
/**
 * Creates an union schema.
 *
 * @param options The union options.
 * @param message The error message.
 *
 * @returns An union schema.
 */
declare function union<const TOptions extends UnionOptions, const TMessage extends ErrorMessage<UnionIssue<InferIssue<TOptions[number]>>> | undefined>(options: TOptions, message: TMessage): UnionSchema<TOptions, TMessage>;

/**
 * Union options async type.
 */
type UnionOptionsAsync = MaybeReadonly<(BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>)[]>;
/**
 * Union schema async type.
 */
interface UnionSchemaAsync<TOptions extends UnionOptionsAsync, TMessage extends ErrorMessage<UnionIssue<InferIssue<TOptions[number]>>> | undefined> extends BaseSchemaAsync<InferInput<TOptions[number]>, InferOutput<TOptions[number]>, UnionIssue<InferIssue<TOptions[number]>> | InferIssue<TOptions[number]>> {
    /**
     * The schema type.
     */
    readonly type: 'union';
    /**
     * The schema reference.
     */
    readonly reference: typeof unionAsync;
    /**
     * The union options.
     */
    readonly options: TOptions;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an union schema.
 *
 * @param options The union options.
 *
 * @returns An union schema.
 */
declare function unionAsync<const TOptions extends UnionOptionsAsync>(options: TOptions): UnionSchemaAsync<TOptions, undefined>;
/**
 * Creates an union schema.
 *
 * @param options The union options.
 * @param message The error message.
 *
 * @returns An union schema.
 */
declare function unionAsync<const TOptions extends UnionOptionsAsync, const TMessage extends ErrorMessage<UnionIssue<InferIssue<TOptions[number]>>> | undefined>(options: TOptions, message: TMessage): UnionSchemaAsync<TOptions, TMessage>;

/**
 * Non nullable issue type.
 */
interface NonNullableIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'non_nullable';
    /**
     * The expected property.
     */
    readonly expected: '!null';
}
/**
 * Infer non nullable input type.
 */
type InferNonNullableInput<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = NonNullable$1<InferInput<TWrapped>>;
/**
 * Infer non nullable output type.
 */
type InferNonNullableOutput<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = NonNullable$1<InferOutput<TWrapped>>;
/**
 * Infer non nullable issue type.
 */
type InferNonNullableIssue<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = TWrapped extends UnionSchema<UnionOptions, ErrorMessage<UnionIssue<BaseIssue<unknown>>> | undefined> | UnionSchemaAsync<UnionOptionsAsync, ErrorMessage<UnionIssue<BaseIssue<unknown>>> | undefined> ? Exclude<InferIssue<TWrapped>, {
    type: 'null' | 'union';
}> | UnionIssue<InferNonNullableIssue<TWrapped['options'][number]>> : Exclude<InferIssue<TWrapped>, {
    type: 'null';
}>;

/**
 * Non nullable schema type.
 */
interface NonNullableSchema<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<NonNullableIssue> | undefined> extends BaseSchema<InferNonNullableInput<TWrapped>, InferNonNullableOutput<TWrapped>, NonNullableIssue | InferNonNullableIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'non_nullable';
    /**
     * The schema reference.
     */
    readonly reference: typeof nonNullable;
    /**
     * The expected property.
     */
    readonly expects: '!null';
    /**
     * The wrapped schema.
     */
    readonly wrapped: TWrapped;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a non nullable schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A non nullable schema.
 */
declare function nonNullable<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(wrapped: TWrapped): NonNullableSchema<TWrapped, undefined>;
/**
 * Creates a non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non nullable schema.
 */
declare function nonNullable<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<NonNullableIssue> | undefined>(wrapped: TWrapped, message: TMessage): NonNullableSchema<TWrapped, TMessage>;

/**
 * Non nullable schema async type.
 */
interface NonNullableSchemaAsync<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<NonNullableIssue> | undefined> extends BaseSchemaAsync<InferNonNullableInput<TWrapped>, InferNonNullableOutput<TWrapped>, NonNullableIssue | InferNonNullableIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'non_nullable';
    /**
     * The schema reference.
     */
    readonly reference: typeof nonNullableAsync;
    /**
     * The expected property.
     */
    readonly expects: '!null';
    /**
     * The wrapped schema.
     */
    readonly wrapped: TWrapped;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a non nullable schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A non nullable schema.
 */
declare function nonNullableAsync<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(wrapped: TWrapped): NonNullableSchemaAsync<TWrapped, undefined>;
/**
 * Creates a non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non nullable schema.
 */
declare function nonNullableAsync<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<NonNullableIssue> | undefined>(wrapped: TWrapped, message: TMessage): NonNullableSchemaAsync<TWrapped, TMessage>;

/**
 * Non nullish issue type.
 */
interface NonNullishIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'non_nullish';
    /**
     * The expected property.
     */
    readonly expected: '(!null & !undefined)';
}
/**
 * Infer non nullish input type.
 */
type InferNonNullishInput<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = NonNullish<InferInput<TWrapped>>;
/**
 * Infer non nullish output type.
 */
type InferNonNullishOutput<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = NonNullish<InferOutput<TWrapped>>;
/**
 * Infer non nullish issue type.
 */
type InferNonNullishIssue<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = TWrapped extends UnionSchema<UnionOptions, ErrorMessage<UnionIssue<BaseIssue<unknown>>> | undefined> | UnionSchemaAsync<UnionOptionsAsync, ErrorMessage<UnionIssue<BaseIssue<unknown>>> | undefined> ? Exclude<InferIssue<TWrapped>, {
    type: 'null' | 'undefined' | 'union';
}> | UnionIssue<InferNonNullishIssue<TWrapped['options'][number]>> : Exclude<InferIssue<TWrapped>, {
    type: 'null' | 'undefined';
}>;

/**
 * Non nullish schema type.
 */
interface NonNullishSchema<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<NonNullishIssue> | undefined> extends BaseSchema<InferNonNullishInput<TWrapped>, InferNonNullishOutput<TWrapped>, NonNullishIssue | InferNonNullishIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'non_nullish';
    /**
     * The schema reference.
     */
    readonly reference: typeof nonNullish;
    /**
     * The expected property.
     */
    readonly expects: '(!null & !undefined)';
    /**
     * The wrapped schema.
     */
    readonly wrapped: TWrapped;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a non nullish schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A non nullish schema.
 */
declare function nonNullish<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(wrapped: TWrapped): NonNullishSchema<TWrapped, undefined>;
/**
 * Creates a non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non nullish schema.
 */
declare function nonNullish<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<NonNullishIssue> | undefined>(wrapped: TWrapped, message: TMessage): NonNullishSchema<TWrapped, TMessage>;

/**
 * Non nullish schema async type.
 */
interface NonNullishSchemaAsync<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<NonNullishIssue> | undefined> extends BaseSchemaAsync<InferNonNullishInput<TWrapped>, InferNonNullishOutput<TWrapped>, NonNullishIssue | InferNonNullishIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'non_nullish';
    /**
     * The schema reference.
     */
    readonly reference: typeof nonNullishAsync;
    /**
     * The expected property.
     */
    readonly expects: '(!null & !undefined)';
    /**
     * The wrapped schema.
     */
    readonly wrapped: TWrapped;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a non nullish schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A non nullish schema.
 */
declare function nonNullishAsync<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(wrapped: TWrapped): NonNullishSchemaAsync<TWrapped, undefined>;
/**
 * Creates a non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non nullish schema.
 */
declare function nonNullishAsync<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<NonNullishIssue> | undefined>(wrapped: TWrapped, message: TMessage): NonNullishSchemaAsync<TWrapped, TMessage>;

/**
 * Non optional issue type.
 */
interface NonOptionalIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'non_optional';
    /**
     * The expected property.
     */
    readonly expected: '!undefined';
}
/**
 * Infer non optional input type.
 */
type InferNonOptionalInput<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = NonOptional<InferInput<TWrapped>>;
/**
 * Infer non optional output type.
 */
type InferNonOptionalOutput<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = NonOptional<InferOutput<TWrapped>>;
/**
 * Infer non optional issue type.
 */
type InferNonOptionalIssue<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = TWrapped extends UnionSchema<UnionOptions, ErrorMessage<UnionIssue<BaseIssue<unknown>>> | undefined> | UnionSchemaAsync<UnionOptionsAsync, ErrorMessage<UnionIssue<BaseIssue<unknown>>> | undefined> ? Exclude<InferIssue<TWrapped>, {
    type: 'undefined' | 'union';
}> | UnionIssue<InferNonOptionalIssue<TWrapped['options'][number]>> : Exclude<InferIssue<TWrapped>, {
    type: 'undefined';
}>;

/**
 * Non optional schema type.
 */
interface NonOptionalSchema<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<NonOptionalIssue> | undefined> extends BaseSchema<InferNonOptionalInput<TWrapped>, InferNonOptionalOutput<TWrapped>, NonOptionalIssue | InferNonOptionalIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'non_optional';
    /**
     * The schema reference.
     */
    readonly reference: typeof nonOptional;
    /**
     * The expected property.
     */
    readonly expects: '!undefined';
    /**
     * The wrapped schema.
     */
    readonly wrapped: TWrapped;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a non optional schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A non optional schema.
 */
declare function nonOptional<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(wrapped: TWrapped): NonOptionalSchema<TWrapped, undefined>;
/**
 * Creates a non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non optional schema.
 */
declare function nonOptional<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<NonOptionalIssue> | undefined>(wrapped: TWrapped, message: TMessage): NonOptionalSchema<TWrapped, TMessage>;

/**
 * Non optional schema async type.
 */
interface NonOptionalSchemaAsync<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<NonOptionalIssue> | undefined> extends BaseSchemaAsync<InferNonOptionalInput<TWrapped>, InferNonOptionalOutput<TWrapped>, NonOptionalIssue | InferNonOptionalIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'non_optional';
    /**
     * The schema reference.
     */
    readonly reference: typeof nonOptionalAsync;
    /**
     * The expected property.
     */
    readonly expects: '!undefined';
    /**
     * The wrapped schema.
     */
    readonly wrapped: TWrapped;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a non optional schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A non optional schema.
 */
declare function nonOptionalAsync<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(wrapped: TWrapped): NonOptionalSchemaAsync<TWrapped, undefined>;
/**
 * Creates a non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non optional schema.
 */
declare function nonOptionalAsync<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<NonOptionalIssue> | undefined>(wrapped: TWrapped, message: TMessage): NonOptionalSchemaAsync<TWrapped, TMessage>;

/**
 * Null issue type.
 */
interface NullIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'null';
    /**
     * The expected property.
     */
    readonly expected: 'null';
}
/**
 * Null schema type.
 */
interface NullSchema<TMessage extends ErrorMessage<NullIssue> | undefined> extends BaseSchema<null, null, NullIssue> {
    /**
     * The schema type.
     */
    readonly type: 'null';
    /**
     * The schema reference.
     */
    readonly reference: typeof null_;
    /**
     * The expected property.
     */
    readonly expects: 'null';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a null schema.
 *
 * @returns A null schema.
 */
declare function null_(): NullSchema<undefined>;
/**
 * Creates a null schema.
 *
 * @param message The error message.
 *
 * @returns A null schema.
 */
declare function null_<const TMessage extends ErrorMessage<NullIssue> | undefined>(message: TMessage): NullSchema<TMessage>;

/**
 * Infer nullable output type.
 */
type InferNullableOutput<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TDefault extends DefaultAsync<TWrapped, null>> = [TDefault] extends [never] ? InferOutput<TWrapped> | null : // FIXME: For schemas that transform the input to `null`, this
NonNullable$1<InferOutput<TWrapped>> | Extract<DefaultValue<TDefault>, null>;

/**
 * Nullable schema type.
 */
interface NullableSchema<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TDefault extends Default<TWrapped, null>> extends BaseSchema<InferInput<TWrapped> | null, InferNullableOutput<TWrapped, TDefault>, InferIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'nullable';
    /**
     * The schema reference.
     */
    readonly reference: typeof nullable;
    /**
     * The expected property.
     */
    readonly expects: `(${TWrapped['expects']} | null)`;
    /**
     * The wrapped schema.
     */
    readonly wrapped: TWrapped;
    /**
     * The default value.
     */
    readonly default: TDefault;
}
/**
 * Creates a nullable schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A nullable schema.
 */
declare function nullable<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(wrapped: TWrapped): NullableSchema<TWrapped, never>;
/**
 * Creates a nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A nullable schema.
 */
declare function nullable<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TDefault extends Default<TWrapped, null>>(wrapped: TWrapped, default_: TDefault): NullableSchema<TWrapped, TDefault>;

/**
 * Nullable schema async type.
 */
interface NullableSchemaAsync<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TDefault extends DefaultAsync<TWrapped, null>> extends BaseSchemaAsync<InferInput<TWrapped> | null, InferNullableOutput<TWrapped, TDefault>, InferIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'nullable';
    /**
     * The schema reference.
     */
    readonly reference: typeof nullableAsync;
    /**
     * The expected property.
     */
    readonly expects: `(${TWrapped['expects']} | null)`;
    /**
     * The wrapped schema.
     */
    readonly wrapped: TWrapped;
    /**
     * The default value.
     */
    readonly default: TDefault;
}
/**
 * Creates a nullable schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A nullable schema.
 */
declare function nullableAsync<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(wrapped: TWrapped): NullableSchemaAsync<TWrapped, never>;
/**
 * Creates a nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A nullable schema.
 */
declare function nullableAsync<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TDefault extends DefaultAsync<TWrapped, null>>(wrapped: TWrapped, default_: TDefault): NullableSchemaAsync<TWrapped, TDefault>;

/**
 * Infer nullish output type.
 */
type InferNullishOutput<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TDefault extends DefaultAsync<TWrapped, null | undefined>> = [TDefault] extends [never] ? InferOutput<TWrapped> | null | undefined : NonNullish<InferOutput<TWrapped>> | Extract<DefaultValue<TDefault>, null | undefined>;

/**
 * Nullish schema type.
 */
interface NullishSchema<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TDefault extends Default<TWrapped, null | undefined>> extends BaseSchema<InferInput<TWrapped> | null | undefined, InferNullishOutput<TWrapped, TDefault>, InferIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'nullish';
    /**
     * The schema reference.
     */
    readonly reference: typeof nullish;
    /**
     * The expected property.
     */
    readonly expects: `(${TWrapped['expects']} | null | undefined)`;
    /**
     * The wrapped schema.
     */
    readonly wrapped: TWrapped;
    /**
     * The default value.
     */
    readonly default: TDefault;
}
/**
 * Creates a nullish schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A nullish schema.
 */
declare function nullish<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(wrapped: TWrapped): NullishSchema<TWrapped, never>;
/**
 * Creates a nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A nullish schema.
 */
declare function nullish<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TDefault extends Default<TWrapped, null | undefined>>(wrapped: TWrapped, default_: TDefault): NullishSchema<TWrapped, TDefault>;

/**
 * Nullish schema async type.
 */
interface NullishSchemaAsync<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TDefault extends DefaultAsync<TWrapped, null | undefined>> extends BaseSchemaAsync<InferInput<TWrapped> | null | undefined, InferNullishOutput<TWrapped, TDefault>, InferIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'nullish';
    /**
     * The schema reference.
     */
    readonly reference: typeof nullishAsync;
    /**
     * The expected property.
     */
    readonly expects: `(${TWrapped['expects']} | null | undefined)`;
    /**
     * The wrapped schema.
     */
    readonly wrapped: TWrapped;
    /**
     * The default value.
     */
    readonly default: TDefault;
}
/**
 * Creates a nullish schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A nullish schema.
 */
declare function nullishAsync<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(wrapped: TWrapped): NullishSchemaAsync<TWrapped, never>;
/**
 * Creates a nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A nullish schema.
 */
declare function nullishAsync<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TDefault extends DefaultAsync<TWrapped, null | undefined>>(wrapped: TWrapped, default_: TDefault): NullishSchemaAsync<TWrapped, TDefault>;

/**
 * Number issue type.
 */
interface NumberIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'number';
    /**
     * The expected property.
     */
    readonly expected: 'number';
}
/**
 * Number schema type.
 */
interface NumberSchema<TMessage extends ErrorMessage<NumberIssue> | undefined> extends BaseSchema<number, number, NumberIssue> {
    /**
     * The schema type.
     */
    readonly type: 'number';
    /**
     * The schema reference.
     */
    readonly reference: typeof number;
    /**
     * The expected property.
     */
    readonly expects: 'number';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a number schema.
 *
 * @returns A number schema.
 */
declare function number(): NumberSchema<undefined>;
/**
 * Creates a number schema.
 *
 * @param message The error message.
 *
 * @returns A number schema.
 */
declare function number<const TMessage extends ErrorMessage<NumberIssue> | undefined>(message: TMessage): NumberSchema<TMessage>;

/**
 * Object issue type.
 */
interface ObjectIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'object';
    /**
     * The expected property.
     */
    readonly expected: 'Object';
}

/**
 * Object schema type.
 */
interface ObjectSchema<TEntries extends ObjectEntries, TMessage extends ErrorMessage<ObjectIssue> | undefined> extends BaseSchema<InferObjectInput<TEntries>, InferObjectOutput<TEntries>, ObjectIssue | InferObjectIssue<TEntries>> {
    /**
     * The schema type.
     */
    readonly type: 'object';
    /**
     * The schema reference.
     */
    readonly reference: typeof object;
    /**
     * The expected property.
     */
    readonly expects: 'Object';
    /**
     * The entries schema.
     */
    readonly entries: TEntries;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an object schema.
 *
 * Hint: This schema removes unknown entries. The output will only include the
 * entries you specify. To include unknown entries, use `looseObject`. To
 * return an issue for unknown entries, use `strictObject`. To include and
 * validate unknown entries, use `objectWithRest`.
 *
 * @param entries The entries schema.
 *
 * @returns An object schema.
 */
declare function object<const TEntries extends ObjectEntries>(entries: TEntries): ObjectSchema<TEntries, undefined>;
/**
 * Creates an object schema.
 *
 * Hint: This schema removes unknown entries. The output will only include the
 * entries you specify. To include unknown entries, use `looseObject`. To
 * return an issue for unknown entries, use `strictObject`. To include and
 * validate unknown entries, use `objectWithRest`.
 *
 * @param entries The entries schema.
 * @param message The error message.
 *
 * @returns An object schema.
 */
declare function object<const TEntries extends ObjectEntries, const TMessage extends ErrorMessage<ObjectIssue> | undefined>(entries: TEntries, message: TMessage): ObjectSchema<TEntries, TMessage>;

/**
 * Object schema async type.
 */
interface ObjectSchemaAsync<TEntries extends ObjectEntriesAsync, TMessage extends ErrorMessage<ObjectIssue> | undefined> extends BaseSchemaAsync<InferObjectInput<TEntries>, InferObjectOutput<TEntries>, ObjectIssue | InferObjectIssue<TEntries>> {
    /**
     * The schema type.
     */
    readonly type: 'object';
    /**
     * The schema reference.
     */
    readonly reference: typeof objectAsync;
    /**
     * The expected property.
     */
    readonly expects: 'Object';
    /**
     * The entries schema.
     */
    readonly entries: TEntries;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an object schema.
 *
 * Hint: This schema removes unknown entries. The output will only include the
 * entries you specify. To include unknown entries, use `looseObjectAsync`. To
 * return an issue for unknown entries, use `strictObjectAsync`. To include and
 * validate unknown entries, use `objectWithRestAsync`.
 *
 * @param entries The entries schema.
 *
 * @returns An object schema.
 */
declare function objectAsync<const TEntries extends ObjectEntriesAsync>(entries: TEntries): ObjectSchemaAsync<TEntries, undefined>;
/**
 * Creates an object schema.
 *
 * Hint: This schema removes unknown entries. The output will only include the
 * entries you specify. To include unknown entries, use `looseObjectAsync`. To
 * return an issue for unknown entries, use `strictObjectAsync`. To include and
 * validate unknown entries, use `objectWithRestAsync`.
 *
 * @param entries The entries schema.
 * @param message The error message.
 *
 * @returns An object schema.
 */
declare function objectAsync<const TEntries extends ObjectEntriesAsync, const TMessage extends ErrorMessage<ObjectIssue> | undefined>(entries: TEntries, message: TMessage): ObjectSchemaAsync<TEntries, TMessage>;

/**
 * Object with rest issue type.
 */
interface ObjectWithRestIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'object_with_rest';
    /**
     * The expected property.
     */
    readonly expected: 'Object';
}

/**
 * Object with rest schema type.
 */
interface ObjectWithRestSchema<TEntries extends ObjectEntries, TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<ObjectWithRestIssue> | undefined> extends BaseSchema<InferObjectInput<TEntries> & {
    [key: string]: InferInput<TRest>;
}, InferObjectOutput<TEntries> & {
    [key: string]: InferOutput<TRest>;
}, ObjectWithRestIssue | InferObjectIssue<TEntries> | InferIssue<TRest>> {
    /**
     * The schema type.
     */
    readonly type: 'object_with_rest';
    /**
     * The schema reference.
     */
    readonly reference: typeof objectWithRest;
    /**
     * The expected property.
     */
    readonly expects: 'Object';
    /**
     * The entries schema.
     */
    readonly entries: TEntries;
    /**
     * The rest schema.
     */
    readonly rest: TRest;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an object with rest schema.
 *
 * @param entries The entries schema.
 * @param rest The rest schema.
 *
 * @returns An object with rest schema.
 */
declare function objectWithRest<const TEntries extends ObjectEntries, const TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(entries: TEntries, rest: TRest): ObjectWithRestSchema<TEntries, TRest, undefined>;
/**
 * Creates an object with rest schema.
 *
 * @param entries The entries schema.
 * @param rest The rest schema.
 * @param message The error message.
 *
 * @returns An object with rest schema.
 */
declare function objectWithRest<const TEntries extends ObjectEntries, const TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<ObjectWithRestIssue> | undefined>(entries: TEntries, rest: TRest, message: TMessage): ObjectWithRestSchema<TEntries, TRest, TMessage>;

/**
 * Object schema async type.
 */
interface ObjectWithRestSchemaAsync<TEntries extends ObjectEntriesAsync, TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<ObjectWithRestIssue> | undefined> extends BaseSchemaAsync<InferObjectInput<TEntries> & {
    [key: string]: InferInput<TRest>;
}, InferObjectOutput<TEntries> & {
    [key: string]: InferOutput<TRest>;
}, ObjectWithRestIssue | InferObjectIssue<TEntries> | InferIssue<TRest>> {
    /**
     * The schema type.
     */
    readonly type: 'object_with_rest';
    /**
     * The schema reference.
     */
    readonly reference: typeof objectWithRestAsync;
    /**
     * The expected property.
     */
    readonly expects: 'Object';
    /**
     * The entries schema.
     */
    readonly entries: TEntries;
    /**
     * The rest schema.
     */
    readonly rest: TRest;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an object with rest schema.
 *
 * @param entries The entries schema.
 * @param rest The rest schema.
 *
 * @returns An object with rest schema.
 */
declare function objectWithRestAsync<const TEntries extends ObjectEntriesAsync, const TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(entries: TEntries, rest: TRest): ObjectWithRestSchemaAsync<TEntries, TRest, undefined>;
/**
 * Creates an object with rest schema.
 *
 * @param entries The entries schema.
 * @param rest The rest schema.
 * @param message The error message.
 *
 * @returns An object with rest schema.
 */
declare function objectWithRestAsync<const TEntries extends ObjectEntriesAsync, const TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<ObjectWithRestIssue> | undefined>(entries: TEntries, rest: TRest, message: TMessage): ObjectWithRestSchemaAsync<TEntries, TRest, TMessage>;

/**
 * Infer optional output type.
 */
type InferOptionalOutput<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TDefault extends DefaultAsync<TWrapped, undefined>> = [TDefault] extends [never] ? InferOutput<TWrapped> | undefined : NonOptional<InferOutput<TWrapped>> | Extract<DefaultValue<TDefault>, undefined>;

/**
 * Optional schema type.
 */
interface OptionalSchema<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TDefault extends Default<TWrapped, undefined>> extends BaseSchema<InferInput<TWrapped> | undefined, InferOptionalOutput<TWrapped, TDefault>, InferIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'optional';
    /**
     * The schema reference.
     */
    readonly reference: typeof optional;
    /**
     * The expected property.
     */
    readonly expects: `(${TWrapped['expects']} | undefined)`;
    /**
     * The wrapped schema.
     */
    readonly wrapped: TWrapped;
    /**
     * The default value.
     */
    readonly default: TDefault;
}
/**
 * Creates a optional schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A optional schema.
 */
declare function optional<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(wrapped: TWrapped): OptionalSchema<TWrapped, never>;
/**
 * Creates a optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A optional schema.
 */
declare function optional<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TDefault extends Default<TWrapped, undefined>>(wrapped: TWrapped, default_: TDefault): OptionalSchema<TWrapped, TDefault>;

/**
 * Optional schema async type.
 */
interface OptionalSchemaAsync<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TDefault extends DefaultAsync<TWrapped, undefined>> extends BaseSchemaAsync<InferInput<TWrapped> | undefined, InferOptionalOutput<TWrapped, TDefault>, InferIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'optional';
    /**
     * The schema reference.
     */
    readonly reference: typeof optionalAsync;
    /**
     * The expected property.
     */
    readonly expects: `(${TWrapped['expects']} | undefined)`;
    /**
     * The wrapped schema.
     */
    readonly wrapped: TWrapped;
    /**
     * The default value.
     */
    readonly default: TDefault;
}
/**
 * Creates an optional schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns An optional schema.
 */
declare function optionalAsync<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(wrapped: TWrapped): OptionalSchemaAsync<TWrapped, never>;
/**
 * Creates an optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An optional schema.
 */
declare function optionalAsync<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TDefault extends DefaultAsync<TWrapped, undefined>>(wrapped: TWrapped, default_: TDefault): OptionalSchemaAsync<TWrapped, TDefault>;

/**
 * Picklist options type.
 */
type PicklistOptions = MaybeReadonly<(string | number | bigint)[]>;
/**
 * Picklist issue type.
 */
interface PicklistIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'picklist';
    /**
     * The expected property.
     */
    readonly expected: string;
}
/**
 * Picklist schema type.
 */
interface PicklistSchema<TOptions extends PicklistOptions, TMessage extends ErrorMessage<PicklistIssue> | undefined> extends BaseSchema<TOptions[number], TOptions[number], PicklistIssue> {
    /**
     * The schema type.
     */
    readonly type: 'picklist';
    /**
     * The schema reference.
     */
    readonly reference: typeof picklist;
    /**
     * The picklist options.
     */
    readonly options: TOptions;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a picklist schema.
 *
 * @param options The picklist options.
 *
 * @returns A picklist schema.
 */
declare function picklist<const TOptions extends PicklistOptions>(options: TOptions): PicklistSchema<TOptions, undefined>;
/**
 * Creates a picklist schema.
 *
 * @param options The picklist options.
 * @param message The error message.
 *
 * @returns A picklist schema.
 */
declare function picklist<const TOptions extends PicklistOptions, const TMessage extends ErrorMessage<PicklistIssue> | undefined>(options: TOptions, message: TMessage): PicklistSchema<TOptions, TMessage>;

/**
 * Promise issue type.
 */
interface PromiseIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'promise';
    /**
     * The expected property.
     */
    readonly expected: 'Promise';
}
/**
 * Promise schema type.
 */
interface PromiseSchema<TMessage extends ErrorMessage<PromiseIssue> | undefined> extends BaseSchema<Promise<unknown>, Promise<unknown>, PromiseIssue> {
    /**
     * The schema type.
     */
    readonly type: 'promise';
    /**
     * The schema reference.
     */
    readonly reference: typeof promise;
    /**
     * The expected property.
     */
    readonly expects: 'Promise';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a promise schema.
 *
 * @returns A promise schema.
 */
declare function promise(): PromiseSchema<undefined>;
/**
 * Creates a promise schema.
 *
 * @param message The error message.
 *
 * @returns A promise schema.
 */
declare function promise<const TMessage extends ErrorMessage<PromiseIssue> | undefined>(message: TMessage): PromiseSchema<TMessage>;

/**
 * Record issue type.
 */
interface RecordIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'record';
    /**
     * The expected property.
     */
    readonly expected: 'Object';
}
/**
 * Is literal type.
 */
type IsLiteral<TKey extends string | number | symbol> = string extends TKey ? false : number extends TKey ? false : symbol extends TKey ? false : TKey extends Brand<string | number | symbol> ? false : true;
/**
 * Optional keys type.
 */
type OptionalKeys<TObject extends Record<string | number | symbol, unknown>> = {
    [TKey in keyof TObject]: IsLiteral<TKey> extends true ? TKey : never;
}[keyof TObject];
/**
 * With question marks type.
 *
 * Hint: We mark an entry as optional if we detect that its key is a literal
 * type. The reason for this is that it is not technically possible to detect
 * missing literal keys without restricting the key schema to `string`, `enum`
 * and `picklist`. However, if `enum` and `picklist` are used, it is better to
 * use `object` with `entriesFromList` because it already covers the needed
 * functionality. This decision also reduces the bundle size of `record`,
 * because it only needs to check the entries of the input and not any missing
 * keys.
 */
type WithQuestionMarks<TObject extends Record<string | number | symbol, unknown>> = MarkOptional<TObject, OptionalKeys<TObject>>;
/**
 * With readonly type.
 */
type WithReadonly<TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TObject extends WithQuestionMarks<Record<string | number | symbol, unknown>>> = TValue extends SchemaWithPipe<infer TPipe> | SchemaWithPipeAsync<infer TPipe> ? ReadonlyAction<any> extends TPipe[number] ? Readonly<TObject> : TObject : TObject;
/**
 * Infer record input type.
 */
type InferRecordInput<TKey extends BaseSchema<string, string | number | symbol, BaseIssue<unknown>> | BaseSchemaAsync<string, string | number | symbol, BaseIssue<unknown>>, TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = Prettify<WithQuestionMarks<Record<InferInput<TKey>, InferInput<TValue>>>>;
/**
 * Infer record output type.
 */
type InferRecordOutput<TKey extends BaseSchema<string, string | number | symbol, BaseIssue<unknown>> | BaseSchemaAsync<string, string | number | symbol, BaseIssue<unknown>>, TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = Prettify<WithReadonly<TValue, WithQuestionMarks<Record<InferOutput<TKey>, InferOutput<TValue>>>>>;

/**
 * Record schema type.
 */
interface RecordSchema<TKey extends BaseSchema<string, string | number | symbol, BaseIssue<unknown>>, TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<RecordIssue> | undefined> extends BaseSchema<InferRecordInput<TKey, TValue>, InferRecordOutput<TKey, TValue>, RecordIssue | InferIssue<TKey> | InferIssue<TValue>> {
    /**
     * The schema type.
     */
    readonly type: 'record';
    /**
     * The schema reference.
     */
    readonly reference: typeof record;
    /**
     * The expected property.
     */
    readonly expects: 'Object';
    /**
     * The record key schema.
     */
    readonly key: TKey;
    /**
     * The record value schema.
     */
    readonly value: TValue;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a record schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 *
 * @returns A record schema.
 */
declare function record<const TKey extends BaseSchema<string, string | number | symbol, BaseIssue<unknown>>, const TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(key: TKey, value: TValue): RecordSchema<TKey, TValue, undefined>;
/**
 * Creates a record schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param message The error message.
 *
 * @returns A record schema.
 */
declare function record<const TKey extends BaseSchema<string, string | number | symbol, BaseIssue<unknown>>, const TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<RecordIssue> | undefined>(key: TKey, value: TValue, message: TMessage): RecordSchema<TKey, TValue, TMessage>;

/**
 * Record schema async type.
 */
interface RecordSchemaAsync<TKey extends BaseSchema<string, string | number | symbol, BaseIssue<unknown>> | BaseSchemaAsync<string, string | number | symbol, BaseIssue<unknown>>, TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<RecordIssue> | undefined> extends BaseSchemaAsync<InferRecordInput<TKey, TValue>, InferRecordOutput<TKey, TValue>, RecordIssue | InferIssue<TKey> | InferIssue<TValue>> {
    /**
     * The schema type.
     */
    readonly type: 'record';
    /**
     * The schema reference.
     */
    readonly reference: typeof recordAsync;
    /**
     * The expected property.
     */
    readonly expects: 'Object';
    /**
     * The record key schema.
     */
    readonly key: TKey;
    /**
     * The record value schema.
     */
    readonly value: TValue;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a record schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 *
 * @returns A record schema.
 */
declare function recordAsync<const TKey extends BaseSchema<string, string | number | symbol, BaseIssue<unknown>> | BaseSchemaAsync<string, string | number | symbol, BaseIssue<unknown>>, const TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(key: TKey, value: TValue): RecordSchemaAsync<TKey, TValue, undefined>;
/**
 * Creates a record schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param message The error message.
 *
 * @returns A record schema.
 */
declare function recordAsync<const TKey extends BaseSchema<string, string | number | symbol, BaseIssue<unknown>> | BaseSchemaAsync<string, string | number | symbol, BaseIssue<unknown>>, const TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<RecordIssue> | undefined>(key: TKey, value: TValue, message: TMessage): RecordSchemaAsync<TKey, TValue, TMessage>;

/**
 * Set issue type.
 */
interface SetIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'set';
    /**
     * The expected property.
     */
    readonly expected: 'Set';
}
/**
 * Infer set input type.
 */
type InferSetInput<TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = Set<InferInput<TValue>>;
/**
 * Infer set output type.
 */
type InferSetOutput<TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = Set<InferOutput<TValue>>;

/**
 * Set schema type.
 */
interface SetSchema<TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<SetIssue> | undefined> extends BaseSchema<InferSetInput<TValue>, InferSetOutput<TValue>, SetIssue | InferIssue<TValue>> {
    /**
     * The schema type.
     */
    readonly type: 'set';
    /**
     * The schema reference.
     */
    readonly reference: typeof set;
    /**
     * The expected property.
     */
    readonly expects: 'Set';
    /**
     * The set value schema.
     */
    readonly value: TValue;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a set schema.
 *
 * @param value The value schema.
 *
 * @returns A set schema.
 */
declare function set<const TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(value: TValue): SetSchema<TValue, undefined>;
/**
 * Creates a set schema.
 *
 * @param value The value schema.
 * @param message The error message.
 *
 * @returns A set schema.
 */
declare function set<const TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<SetIssue> | undefined>(value: TValue, message: TMessage): SetSchema<TValue, TMessage>;

/**
 * Set schema async type.
 */
interface SetSchemaAsync<TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<SetIssue> | undefined> extends BaseSchemaAsync<InferSetInput<TValue>, InferSetOutput<TValue>, SetIssue | InferIssue<TValue>> {
    /**
     * The schema type.
     */
    readonly type: 'set';
    /**
     * The schema reference.
     */
    readonly reference: typeof setAsync;
    /**
     * The expected property.
     */
    readonly expects: 'Set';
    /**
     * The set value schema.
     */
    readonly value: TValue;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a set schema.
 *
 * @param value The value schema.
 *
 * @returns A set schema.
 */
declare function setAsync<const TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(value: TValue): SetSchemaAsync<TValue, undefined>;
/**
 * Creates a set schema.
 *
 * @param value The value schema.
 * @param message The error message.
 *
 * @returns A set schema.
 */
declare function setAsync<const TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<SetIssue> | undefined>(value: TValue, message: TMessage): SetSchemaAsync<TValue, TMessage>;

/**
 * Strict object issue type.
 */
interface StrictObjectIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'strict_object';
    /**
     * The expected property.
     */
    readonly expected: 'Object' | 'never';
}

/**
 * Strict object schema type.
 */
interface StrictObjectSchema<TEntries extends ObjectEntries, TMessage extends ErrorMessage<StrictObjectIssue> | undefined> extends BaseSchema<InferObjectInput<TEntries>, InferObjectOutput<TEntries>, StrictObjectIssue | InferObjectIssue<TEntries>> {
    /**
     * The schema type.
     */
    readonly type: 'strict_object';
    /**
     * The schema reference.
     */
    readonly reference: typeof strictObject;
    /**
     * The expected property.
     */
    readonly expects: 'Object';
    /**
     * The entries schema.
     */
    readonly entries: TEntries;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a strict object schema.
 *
 * @param entries The entries schema.
 *
 * @returns A strict object schema.
 */
declare function strictObject<const TEntries extends ObjectEntries>(entries: TEntries): StrictObjectSchema<TEntries, undefined>;
/**
 * Creates a strict object schema.
 *
 * @param entries The entries schema.
 * @param message The error message.
 *
 * @returns A strict object schema.
 */
declare function strictObject<const TEntries extends ObjectEntries, const TMessage extends ErrorMessage<StrictObjectIssue> | undefined>(entries: TEntries, message: TMessage): StrictObjectSchema<TEntries, TMessage>;

/**
 * Strict object schema async type.
 */
interface StrictObjectSchemaAsync<TEntries extends ObjectEntriesAsync, TMessage extends ErrorMessage<StrictObjectIssue> | undefined> extends BaseSchemaAsync<InferObjectInput<TEntries>, InferObjectOutput<TEntries>, StrictObjectIssue | InferObjectIssue<TEntries>> {
    /**
     * The schema type.
     */
    readonly type: 'strict_object';
    /**
     * The schema reference.
     */
    readonly reference: typeof strictObjectAsync;
    /**
     * The expected property.
     */
    readonly expects: 'Object';
    /**
     * The entries schema.
     */
    readonly entries: TEntries;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a strict object schema.
 *
 * @param entries The entries schema.
 *
 * @returns A strict object schema.
 */
declare function strictObjectAsync<const TEntries extends ObjectEntriesAsync>(entries: TEntries): StrictObjectSchemaAsync<TEntries, undefined>;
/**
 * Creates a strict object schema.
 *
 * @param entries The entries schema.
 * @param message The error message.
 *
 * @returns A strict object schema.
 */
declare function strictObjectAsync<const TEntries extends ObjectEntriesAsync, const TMessage extends ErrorMessage<StrictObjectIssue> | undefined>(entries: TEntries, message: TMessage): StrictObjectSchemaAsync<TEntries, TMessage>;

/**
 * Strict tuple issue type.
 */
interface StrictTupleIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'strict_tuple';
    /**
     * The expected property.
     */
    readonly expected: 'Array' | 'never';
}

/**
 * Strict tuple schema type.
 */
interface StrictTupleSchema<TItems extends TupleItems, TMessage extends ErrorMessage<StrictTupleIssue> | undefined> extends BaseSchema<InferTupleInput<TItems>, InferTupleOutput<TItems>, StrictTupleIssue | InferTupleIssue<TItems>> {
    /**
     * The schema type.
     */
    readonly type: 'strict_tuple';
    /**
     * The schema reference.
     */
    readonly reference: typeof strictTuple;
    /**
     * The expected property.
     */
    readonly expects: 'Array';
    /**
     * The items schema.
     */
    readonly items: TItems;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a strict tuple schema.
 *
 * @param items The items schema.
 *
 * @returns A strict tuple schema.
 */
declare function strictTuple<const TItems extends TupleItems>(items: TItems): StrictTupleSchema<TItems, undefined>;
/**
 * Creates a strict tuple schema.
 *
 * @param items The items schema.
 * @param message The error message.
 *
 * @returns A strict tuple schema.
 */
declare function strictTuple<const TItems extends TupleItems, const TMessage extends ErrorMessage<StrictTupleIssue> | undefined>(items: TItems, message: TMessage): StrictTupleSchema<TItems, TMessage>;

/**
 * Strict tuple schema async type.
 */
interface StrictTupleSchemaAsync<TItems extends TupleItemsAsync, TMessage extends ErrorMessage<StrictTupleIssue> | undefined> extends BaseSchemaAsync<InferTupleInput<TItems>, InferTupleOutput<TItems>, StrictTupleIssue | InferTupleIssue<TItems>> {
    /**
     * The schema type.
     */
    readonly type: 'strict_tuple';
    /**
     * The schema reference.
     */
    readonly reference: typeof strictTupleAsync;
    /**
     * The expected property.
     */
    readonly expects: 'Array';
    /**
     * The items schema.
     */
    readonly items: TItems;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a strict tuple schema.
 *
 * @param items The items schema.
 *
 * @returns A strict tuple schema.
 */
declare function strictTupleAsync<const TItems extends TupleItemsAsync>(items: TItems): StrictTupleSchemaAsync<TItems, undefined>;
/**
 * Creates a strict tuple schema.
 *
 * @param items The items schema.
 * @param message The error message.
 *
 * @returns A strict tuple schema.
 */
declare function strictTupleAsync<const TItems extends TupleItemsAsync, const TMessage extends ErrorMessage<StrictTupleIssue> | undefined>(items: TItems, message: TMessage): StrictTupleSchemaAsync<TItems, TMessage>;

/**
 * String issue type.
 */
interface StringIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'string';
    /**
     * The expected property.
     */
    readonly expected: 'string';
}
/**
 * String schema type.
 */
interface StringSchema<TMessage extends ErrorMessage<StringIssue> | undefined> extends BaseSchema<string, string, StringIssue> {
    /**
     * The schema type.
     */
    readonly type: 'string';
    /**
     * The schema reference.
     */
    readonly reference: typeof string;
    /**
     * The expected property.
     */
    readonly expects: 'string';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a string schema.
 *
 * @returns A string schema.
 */
declare function string(): StringSchema<undefined>;
/**
 * Creates a string schema.
 *
 * @param message The error message.
 *
 * @returns A string schema.
 */
declare function string<const TMessage extends ErrorMessage<StringIssue> | undefined>(message: TMessage): StringSchema<TMessage>;

/**
 * Symbol issue type.
 */
interface SymbolIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'symbol';
    /**
     * The expected property.
     */
    readonly expected: 'symbol';
}
/**
 * Symbol schema type.
 */
interface SymbolSchema<TMessage extends ErrorMessage<SymbolIssue> | undefined> extends BaseSchema<symbol, symbol, SymbolIssue> {
    /**
     * The schema type.
     */
    readonly type: 'symbol';
    /**
     * The schema reference.
     */
    readonly reference: typeof symbol;
    /**
     * The expected property.
     */
    readonly expects: 'symbol';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a symbol schema.
 *
 * @returns A symbol schema.
 */
declare function symbol(): SymbolSchema<undefined>;
/**
 * Creates a symbol schema.
 *
 * @param message The error message.
 *
 * @returns A symbol schema.
 */
declare function symbol<const TMessage extends ErrorMessage<SymbolIssue> | undefined>(message: TMessage): SymbolSchema<TMessage>;

/**
 * Tuple issue type.
 */
interface TupleIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'tuple';
    /**
     * The expected property.
     */
    readonly expected: 'Array';
}

/**
 * Tuple schema type.
 */
interface TupleSchema<TItems extends TupleItems, TMessage extends ErrorMessage<TupleIssue> | undefined> extends BaseSchema<InferTupleInput<TItems>, InferTupleOutput<TItems>, TupleIssue | InferTupleIssue<TItems>> {
    /**
     * The schema type.
     */
    readonly type: 'tuple';
    /**
     * The schema reference.
     */
    readonly reference: typeof tuple;
    /**
     * The expected property.
     */
    readonly expects: 'Array';
    /**
     * The items schema.
     */
    readonly items: TItems;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a tuple schema.
 *
 * Hint: This schema removes unknown items. The output will only include the
 * items you specify. To include unknown items, use `looseTuple`. To
 * return an issue for unknown items, use `strictTuple`. To include and
 * validate unknown items, use `tupleWithRest`.
 *
 * @param items The items schema.
 *
 * @returns A tuple schema.
 */
declare function tuple<const TItems extends TupleItems>(items: TItems): TupleSchema<TItems, undefined>;
/**
 * Creates a tuple schema.
 *
 * Hint: This schema removes unknown items. The output will only include the
 * items you specify. To include unknown items, use `looseTuple`. To
 * return an issue for unknown items, use `strictTuple`. To include and
 * validate unknown items, use `tupleWithRest`.
 *
 * @param items The items schema.
 * @param message The error message.
 *
 * @returns A tuple schema.
 */
declare function tuple<const TItems extends TupleItems, const TMessage extends ErrorMessage<TupleIssue> | undefined>(items: TItems, message: TMessage): TupleSchema<TItems, TMessage>;

/**
 * Tuple schema async type.
 */
interface TupleSchemaAsync<TItems extends TupleItemsAsync, TMessage extends ErrorMessage<TupleIssue> | undefined> extends BaseSchemaAsync<InferTupleInput<TItems>, InferTupleOutput<TItems>, TupleIssue | InferTupleIssue<TItems>> {
    /**
     * The schema type.
     */
    readonly type: 'tuple';
    /**
     * The schema reference.
     */
    readonly reference: typeof tupleAsync;
    /**
     * The expected property.
     */
    readonly expects: 'Array';
    /**
     * The items schema.
     */
    readonly items: TItems;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a tuple schema.
 *
 * Hint: This schema removes unknown items. The output will only include the
 * items you specify. To include unknown items, use `looseTupleAsync`. To
 * return an issue for unknown items, use `strictTupleAsync`. To include and
 * validate unknown items, use `tupleWithRestAsync`.
 *
 * @param items The items schema.
 *
 * @returns A tuple schema.
 */
declare function tupleAsync<const TItems extends TupleItemsAsync>(items: TItems): TupleSchemaAsync<TItems, undefined>;
/**
 * Creates a tuple schema.
 *
 * Hint: This schema removes unknown items. The output will only include the
 * items you specify. To include unknown items, use `looseTupleAsync`. To
 * return an issue for unknown items, use `strictTupleAsync`. To include and
 * validate unknown items, use `tupleWithRestAsync`.
 *
 * @param items The items schema.
 * @param message The error message.
 *
 * @returns A tuple schema.
 */
declare function tupleAsync<const TItems extends TupleItemsAsync, const TMessage extends ErrorMessage<TupleIssue> | undefined>(items: TItems, message: TMessage): TupleSchemaAsync<TItems, TMessage>;

/**
 * Tuple with rest issue type.
 */
interface TupleWithRestIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'tuple_with_rest';
    /**
     * The expected property.
     */
    readonly expected: 'Array';
}

/**
 * Tuple with rest schema type.
 */
interface TupleWithRestSchema<TItems extends TupleItems, TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<TupleWithRestIssue> | undefined> extends BaseSchema<[
    ...InferTupleInput<TItems>,
    ...InferInput<TRest>[]
], [
    ...InferTupleOutput<TItems>,
    ...InferOutput<TRest>[]
], TupleWithRestIssue | InferTupleIssue<TItems> | InferIssue<TRest>> {
    /**
     * The schema type.
     */
    readonly type: 'tuple_with_rest';
    /**
     * The schema reference.
     */
    readonly reference: typeof tupleWithRest;
    /**
     * The expected property.
     */
    readonly expects: 'Array';
    /**
     * The items schema.
     */
    readonly items: TItems;
    /**
     * The rest schema.
     */
    readonly rest: TRest;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a tuple with rest schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 *
 * @returns A tuple with rest schema.
 */
declare function tupleWithRest<const TItems extends TupleItems, const TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(items: TItems, rest: TRest): TupleWithRestSchema<TItems, TRest, undefined>;
/**
 * Creates a tuple with rest schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param message The error message.
 *
 * @returns A tuple with rest schema.
 */
declare function tupleWithRest<const TItems extends TupleItems, const TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<TupleWithRestIssue> | undefined>(items: TItems, rest: TRest, message: TMessage): TupleWithRestSchema<TItems, TRest, TMessage>;

/**
 * Tuple with rest schema async type.
 */
interface TupleWithRestSchemaAsync<TItems extends TupleItemsAsync, TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TMessage extends ErrorMessage<TupleWithRestIssue> | undefined> extends BaseSchemaAsync<[
    ...InferTupleInput<TItems>,
    ...InferInput<TRest>[]
], [
    ...InferTupleOutput<TItems>,
    ...InferOutput<TRest>[]
], TupleWithRestIssue | InferTupleIssue<TItems> | InferIssue<TRest>> {
    /**
     * The schema type.
     */
    readonly type: 'tuple_with_rest';
    /**
     * The schema reference.
     */
    readonly reference: typeof tupleWithRestAsync;
    /**
     * The expected property.
     */
    readonly expects: 'Array';
    /**
     * The items schema.
     */
    readonly items: TItems;
    /**
     * The rest schema.
     */
    readonly rest: TRest;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a tuple with rest schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 *
 * @returns A tuple with rest schema.
 */
declare function tupleWithRestAsync<const TItems extends TupleItemsAsync, const TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(items: TItems, rest: TRest): TupleWithRestSchemaAsync<TItems, TRest, undefined>;
/**
 * Creates a tuple with rest schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param message The error message.
 *
 * @returns A tuple with rest schema.
 */
declare function tupleWithRestAsync<const TItems extends TupleItemsAsync, const TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TMessage extends ErrorMessage<TupleWithRestIssue> | undefined>(items: TItems, rest: TRest, message: TMessage): TupleWithRestSchemaAsync<TItems, TRest, TMessage>;

/**
 * Undefined issue type.
 */
interface UndefinedIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'undefined';
    /**
     * The expected property.
     */
    readonly expected: 'undefined';
}
/**
 * Undefined schema type.
 */
interface UndefinedSchema<TMessage extends ErrorMessage<UndefinedIssue> | undefined> extends BaseSchema<undefined, undefined, UndefinedIssue> {
    /**
     * The schema type.
     */
    readonly type: 'undefined';
    /**
     * The schema reference.
     */
    readonly reference: typeof undefined_;
    /**
     * The expected property.
     */
    readonly expects: 'undefined';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an undefined schema.
 *
 * @returns An undefined schema.
 */
declare function undefined_(): UndefinedSchema<undefined>;
/**
 * Creates an undefined schema.
 *
 * @param message The error message.
 *
 * @returns An undefined schema.
 */
declare function undefined_<const TMessage extends ErrorMessage<UndefinedIssue> | undefined>(message: TMessage): UndefinedSchema<TMessage>;

/**
 * Infer undefinedable output type.
 */
type InferUndefinedableOutput<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TDefault extends DefaultAsync<TWrapped, undefined>> = [TDefault] extends [never] ? InferOutput<TWrapped> | undefined : NonOptional<InferOutput<TWrapped>> | Extract<DefaultValue<TDefault>, undefined>;

/**
 * Undefinedable schema type.
 */
interface UndefinedableSchema<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TDefault extends Default<TWrapped, undefined>> extends BaseSchema<InferInput<TWrapped> | undefined, InferUndefinedableOutput<TWrapped, TDefault>, InferIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'undefinedable';
    /**
     * The schema reference.
     */
    readonly reference: typeof undefinedable;
    /**
     * The expected property.
     */
    readonly expects: `(${TWrapped['expects']} | undefined)`;
    /**
     * The wrapped schema.
     */
    readonly wrapped: TWrapped;
    /**
     * The default value.
     */
    readonly default: TDefault;
}
/**
 * Creates a undefinedable schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A undefinedable schema.
 */
declare function undefinedable<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(wrapped: TWrapped): UndefinedableSchema<TWrapped, never>;
/**
 * Creates a undefinedable schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A undefinedable schema.
 */
declare function undefinedable<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TDefault extends Default<TWrapped, undefined>>(wrapped: TWrapped, default_: TDefault): UndefinedableSchema<TWrapped, TDefault>;

/**
 * Undefinedable schema async type.
 */
interface UndefinedableSchemaAsync<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TDefault extends DefaultAsync<TWrapped, undefined>> extends BaseSchemaAsync<InferInput<TWrapped> | undefined, InferUndefinedableOutput<TWrapped, TDefault>, InferIssue<TWrapped>> {
    /**
     * The schema type.
     */
    readonly type: 'undefinedable';
    /**
     * The schema reference.
     */
    readonly reference: typeof undefinedableAsync;
    /**
     * The expected property.
     */
    readonly expects: `(${TWrapped['expects']} | undefined)`;
    /**
     * The wrapped schema.
     */
    readonly wrapped: TWrapped;
    /**
     * The default value.
     */
    readonly default: TDefault;
}
/**
 * Creates an undefinedable schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns An undefinedable schema.
 */
declare function undefinedableAsync<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(wrapped: TWrapped): UndefinedableSchemaAsync<TWrapped, never>;
/**
 * Creates an undefinedable schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An undefinedable schema.
 */
declare function undefinedableAsync<const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TDefault extends DefaultAsync<TWrapped, undefined>>(wrapped: TWrapped, default_: TDefault): UndefinedableSchemaAsync<TWrapped, TDefault>;

/**
 * Unknown schema type.
 */
interface UnknownSchema extends BaseSchema<unknown, unknown, never> {
    /**
     * The schema type.
     */
    readonly type: 'unknown';
    /**
     * The schema reference.
     */
    readonly reference: typeof unknown;
    /**
     * The expected property.
     */
    readonly expects: 'unknown';
}
/**
 * Creates a unknown schema.
 *
 * @returns A unknown schema.
 */
declare function unknown(): UnknownSchema;

/**
 * Variant schema type.
 */
interface VariantSchema<TKey extends string, TOptions extends VariantOptions<TKey>, TMessage extends ErrorMessage<VariantIssue> | undefined> extends BaseSchema<InferInput<TOptions[number]>, InferOutput<TOptions[number]>, VariantIssue | InferVariantIssue<TOptions>> {
    /**
     * The schema type.
     */
    readonly type: 'variant';
    /**
     * The schema reference.
     */
    readonly reference: typeof variant;
    /**
     * The expected property.
     */
    readonly expects: 'Object';
    /**
     * The discriminator key.
     */
    readonly key: TKey;
    /**
     * The variant options.
     */
    readonly options: TOptions;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a variant schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 *
 * @returns A variant schema.
 */
declare function variant<const TKey extends string, const TOptions extends VariantOptions<TKey>>(key: TKey, options: TOptions): VariantSchema<TKey, TOptions, undefined>;
/**
 * Creates a variant schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param message The error message.
 *
 * @returns An variant schema.
 */
declare function variant<const TKey extends string, const TOptions extends VariantOptions<TKey>, const TMessage extends ErrorMessage<VariantIssue> | undefined>(key: TKey, options: TOptions, message: TMessage): VariantSchema<TKey, TOptions, TMessage>;

/**
 * Variant schema async type.
 */
interface VariantSchemaAsync<TKey extends string, TOptions extends VariantOptionsAsync<TKey>, TMessage extends ErrorMessage<VariantIssue> | undefined> extends BaseSchemaAsync<InferInput<TOptions[number]>, InferOutput<TOptions[number]>, VariantIssue | InferVariantIssue<TOptions>> {
    /**
     * The schema type.
     */
    readonly type: 'variant';
    /**
     * The schema reference.
     */
    readonly reference: typeof variantAsync;
    /**
     * The expected property.
     */
    readonly expects: 'Object';
    /**
     * The discriminator key.
     */
    readonly key: TKey;
    /**
     * The variant options.
     */
    readonly options: TOptions;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a variant schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 *
 * @returns A variant schema.
 */
declare function variantAsync<const TKey extends string, const TOptions extends VariantOptionsAsync<TKey>>(key: TKey, options: TOptions): VariantSchemaAsync<TKey, TOptions, undefined>;
/**
 * Creates a variant schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param message The error message.
 *
 * @returns An variant schema.
 */
declare function variantAsync<const TKey extends string, const TOptions extends VariantOptionsAsync<TKey>, const TMessage extends ErrorMessage<VariantIssue> | undefined>(key: TKey, options: TOptions, message: TMessage): VariantSchemaAsync<TKey, TOptions, TMessage>;

/**
 * Variant issue type.
 */
interface VariantIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'variant';
    /**
     * The expected property.
     */
    readonly expected: string;
}
/**
 * Variant option schema type.
 */
interface VariantOptionSchema<TKey extends string> extends BaseSchema<unknown, unknown, VariantIssue | BaseIssue<unknown>> {
    readonly type: 'variant';
    readonly reference: typeof variant;
    readonly key: string;
    readonly options: VariantOptions<TKey>;
    readonly message: ErrorMessage<VariantIssue> | undefined;
}
/**
 * Variant option schema async type.
 */
interface VariantOptionSchemaAsync<TKey extends string> extends BaseSchemaAsync<unknown, unknown, VariantIssue | BaseIssue<unknown>> {
    readonly type: 'variant';
    readonly reference: typeof variantAsync;
    readonly key: string;
    readonly options: VariantOptionsAsync<TKey>;
    readonly message: ErrorMessage<VariantIssue> | undefined;
}
/**
 * Variant option type.
 */
type VariantOption<TKey extends string> = LooseObjectSchema<Record<TKey, BaseSchema<unknown, unknown, BaseIssue<unknown>>>, ErrorMessage<LooseObjectIssue> | undefined> | ObjectSchema<Record<TKey, BaseSchema<unknown, unknown, BaseIssue<unknown>>>, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchema<Record<TKey, BaseSchema<unknown, unknown, BaseIssue<unknown>>>, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchema<Record<TKey, BaseSchema<unknown, unknown, BaseIssue<unknown>>>, ErrorMessage<StrictObjectIssue> | undefined> | VariantOptionSchema<TKey>;
/**
 * Variant option async type.
 */
type VariantOptionAsync<TKey extends string> = LooseObjectSchemaAsync<Record<TKey, BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>, ErrorMessage<LooseObjectIssue> | undefined> | ObjectSchemaAsync<Record<TKey, BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchemaAsync<Record<TKey, BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>, BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchemaAsync<Record<TKey, BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>, ErrorMessage<StrictObjectIssue> | undefined> | VariantOptionSchemaAsync<TKey>;
/**
 * Variant options type.
 */
type VariantOptions<TKey extends string> = MaybeReadonly<VariantOption<TKey>[]>;
/**
 * Variant options async type.
 */
type VariantOptionsAsync<TKey extends string> = MaybeReadonly<(VariantOption<TKey> | VariantOptionAsync<TKey>)[]>;
/**
 * Infer variant issue type.
 */
type InferVariantIssue<TOptions extends VariantOptions<string> | VariantOptionsAsync<string>> = Exclude<InferIssue<TOptions[number]>, {
    type: 'loose_object' | 'object' | 'object_with_rest';
}>;

/**
 * Void issue type.
 */
interface VoidIssue extends BaseIssue<unknown> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema';
    /**
     * The issue type.
     */
    readonly type: 'void';
    /**
     * The expected property.
     */
    readonly expected: 'void';
}
/**
 * Void schema type.
 */
interface VoidSchema<TMessage extends ErrorMessage<VoidIssue> | undefined> extends BaseSchema<void, void, VoidIssue> {
    /**
     * The schema type.
     */
    readonly type: 'void';
    /**
     * The schema reference.
     */
    readonly reference: typeof void_;
    /**
     * The expected property.
     */
    readonly expects: 'void';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a void schema.
 *
 * @returns A void schema.
 */
declare function void_(): VoidSchema<undefined>;
/**
 * Creates a void schema.
 *
 * @param message The error message.
 *
 * @returns A void schema.
 */
declare function void_<const TMessage extends ErrorMessage<VoidIssue> | undefined>(message: TMessage): VoidSchema<TMessage>;

/**
 * Infer default type.
 */
type InferDefault<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>> | NullableSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown> | NullableSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, unknown> | NullishSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown> | NullishSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, unknown> | OptionalSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown> | OptionalSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, unknown> | UndefinedableSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown> | UndefinedableSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, unknown>> = TSchema extends NullableSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, infer TDefault> | NullableSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, infer TDefault> | NullishSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, infer TDefault> | NullishSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, infer TDefault> | OptionalSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, infer TDefault> | OptionalSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, infer TDefault> | UndefinedableSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, infer TDefault> | UndefinedableSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, infer TDefault> ? [TDefault] extends [never] ? undefined : TDefault extends () => MaybePromise<InferInput<TSchema>> ? ReturnType<TDefault> : TDefault : undefined;
/**
 * Returns the default value of the schema.
 *
 * @param schema The schema to get it from.
 * @param dataset The input dataset if available.
 * @param config The config if available.
 *
 * @returns The default value.
 */
declare function getDefault<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(schema: TSchema, dataset?: Dataset<null | undefined, never>, config?: Config<InferIssue<TSchema>>): InferDefault<TSchema>;

/**
 * Infer defaults type.
 */
type InferDefaults<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = TSchema extends LooseObjectSchema<infer TEntries, ErrorMessage<LooseObjectIssue> | undefined> | ObjectSchema<infer TEntries, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchema<infer TEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchema<infer TEntries, ErrorMessage<StrictObjectIssue> | undefined> ? {
    -readonly [TKey in keyof TEntries]: InferDefaults<TEntries[TKey]>;
} : TSchema extends LooseObjectSchemaAsync<infer TEntries, ErrorMessage<LooseObjectIssue> | undefined> | ObjectSchemaAsync<infer TEntries, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchemaAsync<infer TEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchemaAsync<infer TEntries, ErrorMessage<StrictObjectIssue> | undefined> ? {
    -readonly [TKey in keyof TEntries]: InferDefaults<TEntries[TKey]>;
} : TSchema extends LooseTupleSchema<infer TItems, ErrorMessage<LooseTupleIssue> | undefined> | StrictTupleSchema<infer TItems, ErrorMessage<StrictTupleIssue> | undefined> | TupleSchema<infer TItems, ErrorMessage<TupleIssue> | undefined> | TupleWithRestSchema<infer TItems, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<TupleWithRestIssue> | undefined> ? {
    -readonly [TKey in keyof TItems]: InferDefaults<TItems[TKey]>;
} : TSchema extends LooseTupleSchemaAsync<infer TItems, ErrorMessage<LooseTupleIssue> | undefined> | StrictTupleSchemaAsync<infer TItems, ErrorMessage<StrictTupleIssue> | undefined> | TupleSchemaAsync<infer TItems, ErrorMessage<TupleIssue> | undefined> | TupleWithRestSchemaAsync<infer TItems, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<TupleWithRestIssue> | undefined> ? {
    -readonly [TKey in keyof TItems]: InferDefaults<TItems[TKey]>;
} : Awaited<InferDefault<TSchema>>;

/**
 * Returns the default values of the schema.
 *
 * Hint: The difference to `getDefault` is that for object and tuple schemas
 * this function recursively returns the default values of the subschemas
 * instead of `undefined`.
 *
 * @param schema The schema to get them from.
 *
 * @returns The default values.
 */
declare function getDefaults<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined> | LooseTupleSchema<TupleItems, ErrorMessage<LooseTupleIssue> | undefined> | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchema<ObjectEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchema<ObjectEntries, ErrorMessage<StrictObjectIssue> | undefined> | StrictTupleSchema<TupleItems, ErrorMessage<StrictTupleIssue> | undefined> | TupleSchema<TupleItems, ErrorMessage<TupleIssue> | undefined> | TupleWithRestSchema<TupleItems, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<TupleWithRestIssue> | undefined>>(schema: TSchema): InferDefaults<TSchema>;

/**
 * Returns the default values of the schema.
 *
 * Hint: The difference to `getDefault` is that for object and tuple schemas
 * this function recursively returns the default values of the subschemas
 * instead of `undefined`.
 *
 * @param schema The schema to get them from.
 *
 * @returns The default values.
 */
declare function getDefaultsAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>> | LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined> | LooseObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<LooseObjectIssue> | undefined> | LooseTupleSchema<TupleItems, ErrorMessage<LooseTupleIssue> | undefined> | LooseTupleSchemaAsync<TupleItemsAsync, ErrorMessage<LooseTupleIssue> | undefined> | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined> | ObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchema<ObjectEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | ObjectWithRestSchemaAsync<ObjectEntriesAsync, BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchema<ObjectEntries, ErrorMessage<StrictObjectIssue> | undefined> | StrictObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<StrictObjectIssue> | undefined> | StrictTupleSchema<TupleItems, ErrorMessage<StrictTupleIssue> | undefined> | StrictTupleSchemaAsync<TupleItemsAsync, ErrorMessage<StrictTupleIssue> | undefined> | TupleSchema<TupleItems, ErrorMessage<TupleIssue> | undefined> | TupleSchemaAsync<TupleItemsAsync, ErrorMessage<TupleIssue> | undefined> | TupleWithRestSchema<TupleItems, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<TupleWithRestIssue> | undefined> | TupleWithRestSchemaAsync<TupleItemsAsync, BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<TupleWithRestIssue> | undefined>>(schema: TSchema): Promise<InferDefaults<TSchema>>;

/**
 * Infer fallback type.
 */
type InferFallback<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = TSchema extends SchemaWithFallback<BaseSchema<unknown, unknown, BaseIssue<unknown>>, infer TFallback> | SchemaWithFallbackAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, infer TFallback> ? TFallback extends InferOutput<TSchema> ? TFallback : TFallback extends () => MaybePromise<InferOutput<TSchema>> ? ReturnType<TFallback> : never : undefined;
/**
 * Returns the fallback value of the schema.
 *
 * @param schema The schema to get it from.
 * @param dataset The output dataset if available.
 * @param config The config if available.
 *
 * @returns The fallback value.
 */
declare function getFallback<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(schema: TSchema, dataset?: Dataset<InferOutput<TSchema>, InferIssue<TSchema>>, config?: Config<InferIssue<TSchema>>): InferFallback<TSchema>;

/**
 * Infer fallbacks type.
 */
type InferFallbacks<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = TSchema extends LooseObjectSchema<infer TEntries, ErrorMessage<LooseObjectIssue> | undefined> | ObjectSchema<infer TEntries, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchema<infer TEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchema<infer TEntries, ErrorMessage<StrictObjectIssue> | undefined> ? {
    -readonly [TKey in keyof TEntries]: InferFallbacks<TEntries[TKey]>;
} : TSchema extends LooseObjectSchemaAsync<infer TEntries, ErrorMessage<LooseObjectIssue> | undefined> | ObjectSchemaAsync<infer TEntries, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchemaAsync<infer TEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchemaAsync<infer TEntries, ErrorMessage<StrictObjectIssue> | undefined> ? {
    -readonly [TKey in keyof TEntries]: InferFallbacks<TEntries[TKey]>;
} : TSchema extends LooseTupleSchema<infer TItems, ErrorMessage<LooseTupleIssue> | undefined> | StrictTupleSchema<infer TItems, ErrorMessage<StrictTupleIssue> | undefined> | TupleSchema<infer TItems, ErrorMessage<TupleIssue> | undefined> | TupleWithRestSchema<infer TItems, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<TupleWithRestIssue> | undefined> ? {
    -readonly [TKey in keyof TItems]: InferFallbacks<TItems[TKey]>;
} : TSchema extends LooseTupleSchemaAsync<infer TItems, ErrorMessage<LooseTupleIssue> | undefined> | StrictTupleSchemaAsync<infer TItems, ErrorMessage<StrictTupleIssue> | undefined> | TupleSchemaAsync<infer TItems, ErrorMessage<TupleIssue> | undefined> | TupleWithRestSchemaAsync<infer TItems, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<TupleWithRestIssue> | undefined> ? {
    -readonly [TKey in keyof TItems]: InferFallbacks<TItems[TKey]>;
} : Awaited<InferFallback<TSchema>>;

/**
 * Returns the fallback values of the schema.
 *
 * Hint: The difference to `getFallback` is that for object and tuple schemas
 * this function recursively returns the fallback values of the subschemas
 * instead of `undefined`.
 *
 * @param schema The schema to get them from.
 *
 * @returns The fallback values.
 */
declare function getFallbacks<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined> | LooseTupleSchema<TupleItems, ErrorMessage<LooseTupleIssue> | undefined> | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchema<ObjectEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchema<ObjectEntries, ErrorMessage<StrictObjectIssue> | undefined> | StrictTupleSchema<TupleItems, ErrorMessage<StrictTupleIssue> | undefined> | TupleSchema<TupleItems, ErrorMessage<TupleIssue> | undefined> | TupleWithRestSchema<TupleItems, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<TupleWithRestIssue> | undefined>>(schema: TSchema): InferFallbacks<TSchema>;

/**
 * Returns the fallback values of the schema.
 *
 * Hint: The difference to `getFallback` is that for object and tuple schemas
 * this function recursively returns the fallback values of the subschemas
 * instead of `undefined`.
 *
 * @param schema The schema to get them from.
 *
 * @returns The fallback values.
 */
declare function getFallbacksAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>> | LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined> | LooseObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<LooseObjectIssue> | undefined> | LooseTupleSchema<TupleItems, ErrorMessage<LooseTupleIssue> | undefined> | LooseTupleSchemaAsync<TupleItemsAsync, ErrorMessage<LooseTupleIssue> | undefined> | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined> | ObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchema<ObjectEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | ObjectWithRestSchemaAsync<ObjectEntriesAsync, BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchema<ObjectEntries, ErrorMessage<StrictObjectIssue> | undefined> | StrictObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<StrictObjectIssue> | undefined> | StrictTupleSchema<TupleItems, ErrorMessage<StrictTupleIssue> | undefined> | StrictTupleSchemaAsync<TupleItemsAsync, ErrorMessage<StrictTupleIssue> | undefined> | TupleSchema<TupleItems, ErrorMessage<TupleIssue> | undefined> | TupleSchemaAsync<TupleItemsAsync, ErrorMessage<TupleIssue> | undefined> | TupleWithRestSchema<TupleItems, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<TupleWithRestIssue> | undefined> | TupleWithRestSchemaAsync<TupleItemsAsync, BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<TupleWithRestIssue> | undefined>>(schema: TSchema): Promise<InferFallbacks<TSchema>>;

/**
 * Checks if the input matches the scheme. By using a type predicate, this
 * function can be used as a type guard.
 *
 * @param schema The schema to be used.
 * @param input The input to be tested.
 *
 * @returns Whether the input matches the scheme.
 */
declare function is<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(schema: TSchema, input: unknown): input is InferInput<TSchema>;

/**
 * Schema type.
 */
type Schema$6 = LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined> | LooseObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<LooseObjectIssue> | undefined> | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined> | ObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchema<ObjectEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | ObjectWithRestSchemaAsync<ObjectEntriesAsync, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchema<ObjectEntries, ErrorMessage<StrictObjectIssue> | undefined> | StrictObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<StrictObjectIssue> | undefined>;
/**
 * Force tuple type.
 */
type ForceTuple<T> = T extends [string, ...string[]] ? T : [];
/**
 * Object keys type.
 */
type ObjectKeys$1<TSchema extends Schema$6> = ForceTuple<UnionToTuple<keyof TSchema['entries']>>;
/**
 * Creates a picklist schema of object keys.
 *
 * @param schema The object schema.
 *
 * @returns A picklist schema.
 */
declare function keyof<const TSchema extends Schema$6>(schema: TSchema): PicklistSchema<ObjectKeys$1<TSchema>, undefined>;
/**
 * Creates a picklist schema of object keys.
 *
 * @param schema The object schema.
 * @param message The error message.
 *
 * @returns A picklist schema.
 */
declare function keyof<const TSchema extends Schema$6, const TMessage extends ErrorMessage<PicklistIssue> | undefined>(schema: TSchema, message: TMessage): PicklistSchema<ObjectKeys$1<TSchema>, TMessage>;

/**
 * Schema type.
 */
type Schema$5 = NoPipe<LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined> | LooseObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<LooseObjectIssue> | undefined> | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined> | ObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchema<ObjectEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | ObjectWithRestSchemaAsync<ObjectEntriesAsync, BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchema<ObjectEntries, ErrorMessage<StrictObjectIssue> | undefined> | StrictObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<StrictObjectIssue> | undefined>>;
/**
 * Schema with omit type.
 */
type SchemaWithOmit<TSchema extends Schema$5, TKeys extends ObjectKeys<TSchema>> = TSchema extends ObjectSchema<infer TEntries, ErrorMessage<ObjectIssue> | undefined> | StrictObjectSchema<infer TEntries, ErrorMessage<StrictObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: Omit<TEntries, TKeys[number]>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Omit<TEntries, TKeys[number]>>>): Dataset<InferObjectOutput<Omit<TEntries, TKeys[number]>>, Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Omit<TEntries, TKeys[number]>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<Omit<TEntries, TKeys[number]>>;
        readonly output: InferObjectOutput<Omit<TEntries, TKeys[number]>>;
        readonly issue: Extract<InferIssue<TSchema>, {
            type: TSchema['type'];
        }> | InferObjectIssue<Omit<TEntries, TKeys[number]>>;
    };
} : TSchema extends ObjectSchemaAsync<infer TEntries, ErrorMessage<ObjectIssue> | undefined> | StrictObjectSchemaAsync<infer TEntries, ErrorMessage<StrictObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: Omit<TEntries, TKeys[number]>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Omit<TEntries, TKeys[number]>>>): Promise<Dataset<InferObjectOutput<Omit<TEntries, TKeys[number]>>, Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Omit<TEntries, TKeys[number]>>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<Omit<TEntries, TKeys[number]>>;
        readonly output: InferObjectOutput<Omit<TEntries, TKeys[number]>>;
        readonly issue: Extract<InferIssue<TSchema>, {
            type: TSchema['type'];
        }> | InferObjectIssue<Omit<TEntries, TKeys[number]>>;
    };
} : TSchema extends LooseObjectSchema<infer TEntries, ErrorMessage<LooseObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: Omit<TEntries, TKeys[number]>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Omit<TEntries, TKeys[number]>>>): Dataset<InferObjectOutput<Omit<TEntries, TKeys[number]>> & {
        [key: string]: unknown;
    }, Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Omit<TEntries, TKeys[number]>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<Omit<TEntries, TKeys[number]>> & {
            [key: string]: unknown;
        };
        readonly output: InferObjectOutput<Omit<TEntries, TKeys[number]>> & {
            [key: string]: unknown;
        };
        readonly issue: Extract<InferIssue<TSchema>, {
            type: TSchema['type'];
        }> | InferObjectIssue<Omit<TEntries, TKeys[number]>>;
    };
} : TSchema extends LooseObjectSchemaAsync<infer TEntries, ErrorMessage<LooseObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: Omit<TEntries, TKeys[number]>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Omit<TEntries, TKeys[number]>>>): Promise<Dataset<InferObjectOutput<Omit<TEntries, TKeys[number]>> & {
        [key: string]: unknown;
    }, Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Omit<TEntries, TKeys[number]>>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<Omit<TEntries, TKeys[number]>> & {
            [key: string]: unknown;
        };
        readonly output: InferObjectOutput<Omit<TEntries, TKeys[number]>> & {
            [key: string]: unknown;
        };
        readonly issue: Extract<InferIssue<TSchema>, {
            type: TSchema['type'];
        }> | InferObjectIssue<Omit<TEntries, TKeys[number]>>;
    };
} : TSchema extends ObjectWithRestSchema<infer TEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: Omit<TEntries, TKeys[number]>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Omit<TEntries, TKeys[number]>> | InferIssue<TSchema['rest']>>): Dataset<InferObjectOutput<Omit<TEntries, TKeys[number]>> & {
        [key: string]: InferOutput<TSchema['rest']>;
    }, Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Omit<TEntries, TKeys[number]>> | InferIssue<TSchema['rest']>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<Omit<TEntries, TKeys[number]>> & {
            [key: string]: InferInput<TSchema['rest']>;
        };
        readonly output: InferObjectOutput<Omit<TEntries, TKeys[number]>> & {
            [key: string]: InferOutput<TSchema['rest']>;
        };
        readonly issue: Extract<InferIssue<TSchema>, {
            type: TSchema['type'];
        }> | InferObjectIssue<Omit<TEntries, TKeys[number]>> | InferIssue<TSchema['rest']>;
    };
} : TSchema extends ObjectWithRestSchemaAsync<infer TEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: Omit<TEntries, TKeys[number]>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Omit<TEntries, TKeys[number]>> | InferIssue<TSchema['rest']>>): Promise<Dataset<InferObjectOutput<Omit<TEntries, TKeys[number]>> & {
        [key: string]: InferOutput<TSchema['rest']>;
    }, Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Omit<TEntries, TKeys[number]>> | InferIssue<TSchema['rest']>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<Omit<TEntries, TKeys[number]>> & {
            [key: string]: InferInput<TSchema['rest']>;
        };
        readonly output: InferObjectOutput<Omit<TEntries, TKeys[number]>> & {
            [key: string]: InferOutput<TSchema['rest']>;
        };
        readonly issue: Extract<InferIssue<TSchema>, {
            type: TSchema['type'];
        }> | InferObjectIssue<Omit<TEntries, TKeys[number]>> | InferIssue<TSchema['rest']>;
    };
} : never;
/**
 * Creates a modified copy of an object schema that does not contain the
 * selected entries.
 *
 * @param schema The schema to omit from.
 * @param keys The selected entries.
 *
 * @returns An object schema.
 */
declare function omit<const TSchema extends Schema$5, const TKeys extends ObjectKeys<TSchema>>(schema: TSchema, keys: TKeys): SchemaWithOmit<TSchema, TKeys>;

/**
 * Parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 * @param config The parse configuration.
 *
 * @returns The parsed input.
 */
declare function parse<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(schema: TSchema, input: unknown, config?: Config<InferIssue<TSchema>>): InferOutput<TSchema>;

/**
 * Parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 * @param config The parse configuration.
 *
 * @returns The parsed input.
 */
declare function parseAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(schema: TSchema, input: unknown, config?: Config<InferIssue<TSchema>>): Promise<InferOutput<TSchema>>;

/**
 * The parser type.
 */
interface Parser<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TConfig extends Config<InferIssue<TSchema>> | undefined> {
    /**
     * Parses an unknown input based on the schema.
     */
    (input: unknown): InferOutput<TSchema>;
    /**
     * The schema to be used.
     */
    readonly schema: TSchema;
    /**
     * The parser configuration.
     */
    readonly config: TConfig;
}
/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 *
 * @returns The parser function.
 */
declare function parser<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(schema: TSchema): Parser<TSchema, undefined>;
/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param config The parser configuration.
 *
 * @returns The parser function.
 */
declare function parser<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TConfig extends Config<InferIssue<TSchema>> | undefined>(schema: TSchema, config: TConfig): Parser<TSchema, TConfig>;

/**
 * The parser async type.
 */
interface ParserAsync<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TConfig extends Config<InferIssue<TSchema>> | undefined> {
    /**
     * Parses an unknown input based on the schema.
     */
    (input: unknown): Promise<InferOutput<TSchema>>;
    /**
     * The schema to be used.
     */
    readonly schema: TSchema;
    /**
     * The parser configuration.
     */
    readonly config: TConfig;
}
/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 *
 * @returns The parser function.
 */
declare function parserAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(schema: TSchema): ParserAsync<TSchema, undefined>;
/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param config The parser configuration.
 *
 * @returns The parser function.
 */
declare function parserAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TConfig extends Config<InferIssue<TSchema>> | undefined>(schema: TSchema, config: TConfig): ParserAsync<TSchema, TConfig>;

/**
 * Schema type.
 */
type Schema$4 = NoPipe<LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined> | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchema<ObjectEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchema<ObjectEntries, ErrorMessage<StrictObjectIssue> | undefined>>;
/**
 * Partial entries type.
 */
type PartialEntries$1<TEntries extends ObjectEntries, TKeys extends readonly (keyof TEntries)[] | undefined> = {
    [TKey in keyof TEntries]: TKeys extends readonly (keyof TEntries)[] ? TKey extends TKeys[number] ? OptionalSchema<TEntries[TKey], never> : TEntries[TKey] : OptionalSchema<TEntries[TKey], never>;
};
/**
 * Schema with partial type.
 */
type SchemaWithPartial<TSchema extends Schema$4, TKeys extends ObjectKeys<TSchema> | undefined> = TSchema extends ObjectSchema<infer TEntries, ErrorMessage<ObjectIssue> | undefined> | StrictObjectSchema<infer TEntries, ErrorMessage<StrictObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: PartialEntries$1<TEntries, TKeys>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<InferIssue<TSchema>>): Dataset<InferObjectOutput<PartialEntries$1<TEntries, TKeys>>, InferIssue<TSchema>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<PartialEntries$1<TEntries, TKeys>>;
        readonly output: InferObjectOutput<PartialEntries$1<TEntries, TKeys>>;
        readonly issue: InferIssue<TSchema>;
    };
} : TSchema extends LooseObjectSchema<infer TEntries, ErrorMessage<LooseObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: PartialEntries$1<TEntries, TKeys>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<InferIssue<TSchema>>): Dataset<InferObjectOutput<PartialEntries$1<TEntries, TKeys>> & {
        [key: string]: unknown;
    }, InferIssue<TSchema>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<PartialEntries$1<TEntries, TKeys>> & {
            [key: string]: unknown;
        };
        readonly output: InferObjectOutput<PartialEntries$1<TEntries, TKeys>> & {
            [key: string]: unknown;
        };
        readonly issue: InferIssue<TSchema>;
    };
} : TSchema extends ObjectWithRestSchema<infer TEntries, infer TRest, ErrorMessage<ObjectWithRestIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: PartialEntries$1<TEntries, TKeys>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<InferIssue<TSchema>>): Dataset<InferObjectOutput<PartialEntries$1<TEntries, TKeys>> & {
        [key: string]: InferOutput<TRest>;
    }, InferIssue<TSchema>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<PartialEntries$1<TEntries, TKeys>> & {
            [key: string]: InferInput<TRest>;
        };
        readonly output: InferObjectOutput<PartialEntries$1<TEntries, TKeys>> & {
            [key: string]: InferOutput<TRest>;
        };
        readonly issue: InferIssue<TSchema>;
    };
} : never;
/**
 * Creates a modified copy of an object schema that marks all entries as optional.
 *
 * @param schema The schema to modify.
 *
 * @returns An object schema.
 */
declare function partial<const TSchema extends Schema$4>(schema: TSchema): SchemaWithPartial<TSchema, undefined>;
/**
 * Creates a modified copy of an object schema that marks the selected entries
 * as optional.
 *
 * @param schema The schema to modify.
 * @param keys The selected entries.
 *
 * @returns An object schema.
 */
declare function partial<const TSchema extends Schema$4, const TKeys extends ObjectKeys<TSchema>>(schema: TSchema, keys: TKeys): SchemaWithPartial<TSchema, TKeys>;

/**
 * Schema type.
 */
type Schema$3 = NoPipe<LooseObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<LooseObjectIssue> | undefined> | ObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchemaAsync<ObjectEntriesAsync, BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<StrictObjectIssue> | undefined>>;
/**
 * Partial entries type.
 */
type PartialEntries<TEntries extends ObjectEntriesAsync, TKeys extends readonly (keyof TEntries)[] | undefined> = {
    [TKey in keyof TEntries]: TKeys extends readonly (keyof TEntries)[] ? TKey extends TKeys[number] ? OptionalSchemaAsync<TEntries[TKey], never> : TEntries[TKey] : OptionalSchemaAsync<TEntries[TKey], never>;
};
/**
 * Schema with partial type.
 */
type SchemaWithPartialAsync<TSchema extends Schema$3, TKeys extends ObjectKeys<TSchema> | undefined> = TSchema extends ObjectSchemaAsync<infer TEntries, ErrorMessage<ObjectIssue> | undefined> | StrictObjectSchemaAsync<infer TEntries, ErrorMessage<StrictObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: PartialEntries<TEntries, TKeys>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<InferIssue<TSchema>>): Promise<Dataset<InferObjectOutput<PartialEntries<TEntries, TKeys>>, InferIssue<TSchema>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<PartialEntries<TEntries, TKeys>>;
        readonly output: InferObjectOutput<PartialEntries<TEntries, TKeys>>;
        readonly issue: InferIssue<TSchema>;
    };
} : TSchema extends LooseObjectSchemaAsync<infer TEntries, ErrorMessage<LooseObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: PartialEntries<TEntries, TKeys>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<InferIssue<TSchema>>): Promise<Dataset<InferObjectOutput<PartialEntries<TEntries, TKeys>> & {
        [key: string]: unknown;
    }, InferIssue<TSchema>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<PartialEntries<TEntries, TKeys>> & {
            [key: string]: unknown;
        };
        readonly output: InferObjectOutput<PartialEntries<TEntries, TKeys>> & {
            [key: string]: unknown;
        };
        readonly issue: InferIssue<TSchema>;
    };
} : TSchema extends ObjectWithRestSchemaAsync<infer TEntries, infer TRest, ErrorMessage<ObjectWithRestIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: PartialEntries<TEntries, TKeys>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<InferIssue<TSchema>>): Promise<Dataset<InferObjectOutput<PartialEntries<TEntries, TKeys>> & {
        [key: string]: InferOutput<TRest>;
    }, InferIssue<TSchema>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<PartialEntries<TEntries, TKeys>> & {
            [key: string]: InferInput<TRest>;
        };
        readonly output: InferObjectOutput<PartialEntries<TEntries, TKeys>> & {
            [key: string]: InferOutput<TRest>;
        };
        readonly issue: InferIssue<TSchema>;
    };
} : never;
/**
 * Creates a modified copy of an object schema that marks all entries as optional.
 *
 * @param schema The schema to modify.
 *
 * @returns An object schema.
 */
declare function partialAsync<const TSchema extends Schema$3>(schema: TSchema): SchemaWithPartialAsync<TSchema, undefined>;
/**
 * Creates a modified copy of an object schema that marks the selected entries
 * as optional.
 *
 * @param schema The schema to modify.
 * @param keys The selected entries.
 *
 * @returns An object schema.
 */
declare function partialAsync<const TSchema extends Schema$3, const TKeys extends ObjectKeys<TSchema>>(schema: TSchema, keys: TKeys): SchemaWithPartialAsync<TSchema, TKeys>;

/**
 * The schema type.
 */
type Schema$2 = NoPipe<LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined> | LooseObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<LooseObjectIssue> | undefined> | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined> | ObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchema<ObjectEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | ObjectWithRestSchemaAsync<ObjectEntriesAsync, BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchema<ObjectEntries, ErrorMessage<StrictObjectIssue> | undefined> | StrictObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<StrictObjectIssue> | undefined>>;
/**
 * Schema with pick type.
 */
type SchemaWithPick<TSchema extends Schema$2, TKeys extends ObjectKeys<TSchema>> = TSchema extends ObjectSchema<infer TEntries, ErrorMessage<ObjectIssue> | undefined> | StrictObjectSchema<infer TEntries, ErrorMessage<StrictObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: Pick<TEntries, TKeys[number]>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Pick<TEntries, TKeys[number]>>>): Dataset<InferObjectOutput<Pick<TEntries, TKeys[number]>>, Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Pick<TEntries, TKeys[number]>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<Pick<TEntries, TKeys[number]>>;
        readonly output: InferObjectOutput<Pick<TEntries, TKeys[number]>>;
        readonly issue: Extract<InferIssue<TSchema>, {
            type: TSchema['type'];
        }> | InferObjectIssue<Pick<TEntries, TKeys[number]>>;
    };
} : TSchema extends ObjectSchemaAsync<infer TEntries, ErrorMessage<ObjectIssue> | undefined> | StrictObjectSchemaAsync<infer TEntries, ErrorMessage<StrictObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: Pick<TEntries, TKeys[number]>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Pick<TEntries, TKeys[number]>>>): Promise<Dataset<InferObjectOutput<Pick<TEntries, TKeys[number]>>, Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Pick<TEntries, TKeys[number]>>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<Pick<TEntries, TKeys[number]>>;
        readonly output: InferObjectOutput<Pick<TEntries, TKeys[number]>>;
        readonly issue: Extract<InferIssue<TSchema>, {
            type: TSchema['type'];
        }> | InferObjectIssue<Pick<TEntries, TKeys[number]>>;
    };
} : TSchema extends LooseObjectSchema<infer TEntries, ErrorMessage<LooseObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: Pick<TEntries, TKeys[number]>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Pick<TEntries, TKeys[number]>>>): Dataset<InferObjectOutput<Pick<TEntries, TKeys[number]>> & {
        [key: string]: unknown;
    }, Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Pick<TEntries, TKeys[number]>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<Pick<TEntries, TKeys[number]>> & {
            [key: string]: unknown;
        };
        readonly output: InferObjectOutput<Pick<TEntries, TKeys[number]>> & {
            [key: string]: unknown;
        };
        readonly issue: Extract<InferIssue<TSchema>, {
            type: TSchema['type'];
        }> | InferObjectIssue<Pick<TEntries, TKeys[number]>>;
    };
} : TSchema extends LooseObjectSchemaAsync<infer TEntries, ErrorMessage<LooseObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: Pick<TEntries, TKeys[number]>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Pick<TEntries, TKeys[number]>>>): Promise<Dataset<InferObjectOutput<Pick<TEntries, TKeys[number]>> & {
        [key: string]: unknown;
    }, Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Pick<TEntries, TKeys[number]>>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<Pick<TEntries, TKeys[number]>> & {
            [key: string]: unknown;
        };
        readonly output: InferObjectOutput<Pick<TEntries, TKeys[number]>> & {
            [key: string]: unknown;
        };
        readonly issue: Extract<InferIssue<TSchema>, {
            type: TSchema['type'];
        }> | InferObjectIssue<Pick<TEntries, TKeys[number]>>;
    };
} : TSchema extends ObjectWithRestSchema<infer TEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: Pick<TEntries, TKeys[number]>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Pick<TEntries, TKeys[number]>> | InferIssue<TSchema['rest']>>): Dataset<InferObjectOutput<Pick<TEntries, TKeys[number]>> & {
        [key: string]: InferOutput<TSchema['rest']>;
    }, Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Pick<TEntries, TKeys[number]>> | InferIssue<TSchema['rest']>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<Pick<TEntries, TKeys[number]>> & {
            [key: string]: InferInput<TSchema['rest']>;
        };
        readonly output: InferObjectOutput<Pick<TEntries, TKeys[number]>> & {
            [key: string]: InferOutput<TSchema['rest']>;
        };
        readonly issue: Extract<InferIssue<TSchema>, {
            type: TSchema['type'];
        }> | InferObjectIssue<Pick<TEntries, TKeys[number]>> | InferIssue<TSchema['rest']>;
    };
} : TSchema extends ObjectWithRestSchemaAsync<infer TEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: Pick<TEntries, TKeys[number]>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Pick<TEntries, TKeys[number]>> | InferIssue<TSchema['rest']>>): Promise<Dataset<InferObjectOutput<Pick<TEntries, TKeys[number]>> & {
        [key: string]: InferOutput<TSchema['rest']>;
    }, Extract<InferIssue<TSchema>, {
        type: TSchema['type'];
    }> | InferObjectIssue<Pick<TEntries, TKeys[number]>> | InferIssue<TSchema['rest']>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<Pick<TEntries, TKeys[number]>> & {
            [key: string]: InferInput<TSchema['rest']>;
        };
        readonly output: InferObjectOutput<Pick<TEntries, TKeys[number]>> & {
            [key: string]: InferOutput<TSchema['rest']>;
        };
        readonly issue: Extract<InferIssue<TSchema>, {
            type: TSchema['type'];
        }> | InferObjectIssue<Pick<TEntries, TKeys[number]>> | InferIssue<TSchema['rest']>;
    };
} : never;
/**
 * Creates a modified copy of an object schema that contains only the selected
 * entries.
 *
 * @param schema The schema to pick from.
 * @param keys The selected entries.
 *
 * @returns An object schema.
 */
declare function pick<const TSchema extends Schema$2, const TKeys extends ObjectKeys<TSchema>>(schema: TSchema, keys: TKeys): SchemaWithPick<TSchema, TKeys>;

/**
 * Schema with pipe type.
 */
type SchemaWithPipe<TPipe extends [
    BaseSchema<unknown, unknown, BaseIssue<unknown>>,
    ...PipeItem<any, unknown, BaseIssue<unknown>>[]
]> = Omit<FirstTupleItem<TPipe>, '_run' | '_types'> & {
    /**
     * The pipe items.
     */
    readonly pipe: TPipe;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    readonly _run: (dataset: Dataset<unknown, never>, config: Config<InferIssue<FirstTupleItem<TPipe>>>) => Dataset<InferOutput<LastTupleItem<TPipe>>, InferIssue<TPipe[number]>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferInput<FirstTupleItem<TPipe>>;
        readonly output: InferOutput<LastTupleItem<TPipe>>;
        readonly issue: InferIssue<TPipe[number]>;
    };
};
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>): SchemaWithPipe<[TSchema, TItem1]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>): SchemaWithPipe<[TSchema, TItem1, TItem2]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>): SchemaWithPipe<[TSchema, TItem1, TItem2, TItem3]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>): SchemaWithPipe<[TSchema, TItem1, TItem2, TItem3, TItem4]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>): SchemaWithPipe<[TSchema, TItem1, TItem2, TItem3, TItem4, TItem5]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>): SchemaWithPipe<[TSchema, TItem1, TItem2, TItem3, TItem4, TItem5, TItem6]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>): SchemaWithPipe<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>): SchemaWithPipe<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>): SchemaWithPipe<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>): SchemaWithPipe<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>): SchemaWithPipe<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>): SchemaWithPipe<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 * @param item13 The thirteenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>>, const TItem13 extends PipeItem<InferOutput<TItem12>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>, item13: TItem13 | PipeAction<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>>): SchemaWithPipe<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12,
    TItem13
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 * @param item13 The thirteenth pipe item.
 * @param item14 The fourteenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>>, const TItem13 extends PipeItem<InferOutput<TItem12>, unknown, BaseIssue<unknown>>, const TItem14 extends PipeItem<InferOutput<TItem13>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>, item13: TItem13 | PipeAction<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>>, item14: TItem14 | PipeAction<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>>): SchemaWithPipe<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12,
    TItem13,
    TItem14
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 * @param item13 The thirteenth pipe item.
 * @param item14 The fourteenth pipe item.
 * @param item15 The fifteenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>>, const TItem13 extends PipeItem<InferOutput<TItem12>, unknown, BaseIssue<unknown>>, const TItem14 extends PipeItem<InferOutput<TItem13>, unknown, BaseIssue<unknown>>, const TItem15 extends PipeItem<InferOutput<TItem14>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>, item13: TItem13 | PipeAction<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>>, item14: TItem14 | PipeAction<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>>, item15: TItem15 | PipeAction<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>>): SchemaWithPipe<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12,
    TItem13,
    TItem14,
    TItem15
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 * @param item13 The thirteenth pipe item.
 * @param item14 The fourteenth pipe item.
 * @param item15 The fifteenth pipe item.
 * @param item16 The sixteenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>>, const TItem13 extends PipeItem<InferOutput<TItem12>, unknown, BaseIssue<unknown>>, const TItem14 extends PipeItem<InferOutput<TItem13>, unknown, BaseIssue<unknown>>, const TItem15 extends PipeItem<InferOutput<TItem14>, unknown, BaseIssue<unknown>>, const TItem16 extends PipeItem<InferOutput<TItem15>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>, item13: TItem13 | PipeAction<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>>, item14: TItem14 | PipeAction<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>>, item15: TItem15 | PipeAction<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>>, item16: TItem16 | PipeAction<InferOutput<TItem15>, InferOutput<TItem16>, InferIssue<TItem16>>): SchemaWithPipe<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12,
    TItem13,
    TItem14,
    TItem15,
    TItem16
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 * @param item13 The thirteenth pipe item.
 * @param item14 The fourteenth pipe item.
 * @param item15 The fifteenth pipe item.
 * @param item16 The sixteenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>>, const TItem13 extends PipeItem<InferOutput<TItem12>, unknown, BaseIssue<unknown>>, const TItem14 extends PipeItem<InferOutput<TItem13>, unknown, BaseIssue<unknown>>, const TItem15 extends PipeItem<InferOutput<TItem14>, unknown, BaseIssue<unknown>>, const TItem16 extends PipeItem<InferOutput<TItem15>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>, item13: TItem13 | PipeAction<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>>, item14: TItem14 | PipeAction<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>>, item15: TItem15 | PipeAction<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>>, item16: TItem16 | PipeAction<InferOutput<TItem15>, InferOutput<TItem16>, InferIssue<TItem16>>): SchemaWithPipe<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12,
    TItem13,
    TItem14,
    TItem15,
    TItem16
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 * @param item13 The thirteenth pipe item.
 * @param item14 The fourteenth pipe item.
 * @param item15 The fifteenth pipe item.
 * @param item16 The sixteenth pipe item.
 * @param item17 The seventeenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>>, const TItem13 extends PipeItem<InferOutput<TItem12>, unknown, BaseIssue<unknown>>, const TItem14 extends PipeItem<InferOutput<TItem13>, unknown, BaseIssue<unknown>>, const TItem15 extends PipeItem<InferOutput<TItem14>, unknown, BaseIssue<unknown>>, const TItem16 extends PipeItem<InferOutput<TItem15>, unknown, BaseIssue<unknown>>, const TItem17 extends PipeItem<InferOutput<TItem16>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>, item13: TItem13 | PipeAction<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>>, item14: TItem14 | PipeAction<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>>, item15: TItem15 | PipeAction<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>>, item16: TItem16 | PipeAction<InferOutput<TItem15>, InferOutput<TItem16>, InferIssue<TItem16>>, item17: TItem17 | PipeAction<InferOutput<TItem16>, InferOutput<TItem17>, InferIssue<TItem17>>): SchemaWithPipe<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12,
    TItem13,
    TItem14,
    TItem15,
    TItem16,
    TItem17
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 * @param item13 The thirteenth pipe item.
 * @param item14 The fourteenth pipe item.
 * @param item15 The fifteenth pipe item.
 * @param item16 The sixteenth pipe item.
 * @param item17 The seventeenth pipe item.
 * @param item18 The eighteenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>>, const TItem13 extends PipeItem<InferOutput<TItem12>, unknown, BaseIssue<unknown>>, const TItem14 extends PipeItem<InferOutput<TItem13>, unknown, BaseIssue<unknown>>, const TItem15 extends PipeItem<InferOutput<TItem14>, unknown, BaseIssue<unknown>>, const TItem16 extends PipeItem<InferOutput<TItem15>, unknown, BaseIssue<unknown>>, const TItem17 extends PipeItem<InferOutput<TItem16>, unknown, BaseIssue<unknown>>, const TItem18 extends PipeItem<InferOutput<TItem17>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>, item13: TItem13 | PipeAction<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>>, item14: TItem14 | PipeAction<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>>, item15: TItem15 | PipeAction<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>>, item16: TItem16 | PipeAction<InferOutput<TItem15>, InferOutput<TItem16>, InferIssue<TItem16>>, item17: TItem17 | PipeAction<InferOutput<TItem16>, InferOutput<TItem17>, InferIssue<TItem17>>, item18: TItem18 | PipeAction<InferOutput<TItem17>, InferOutput<TItem18>, InferIssue<TItem18>>): SchemaWithPipe<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12,
    TItem13,
    TItem14,
    TItem15,
    TItem16,
    TItem17,
    TItem18
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 * @param item13 The thirteenth pipe item.
 * @param item14 The fourteenth pipe item.
 * @param item15 The fifteenth pipe item.
 * @param item16 The sixteenth pipe item.
 * @param item17 The seventeenth pipe item.
 * @param item18 The eighteenth pipe item.
 * @param item19 The nineteenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipe<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>>, const TItem13 extends PipeItem<InferOutput<TItem12>, unknown, BaseIssue<unknown>>, const TItem14 extends PipeItem<InferOutput<TItem13>, unknown, BaseIssue<unknown>>, const TItem15 extends PipeItem<InferOutput<TItem14>, unknown, BaseIssue<unknown>>, const TItem16 extends PipeItem<InferOutput<TItem15>, unknown, BaseIssue<unknown>>, const TItem17 extends PipeItem<InferOutput<TItem16>, unknown, BaseIssue<unknown>>, const TItem18 extends PipeItem<InferOutput<TItem17>, unknown, BaseIssue<unknown>>, const TItem19 extends PipeItem<InferOutput<TItem18>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>, item13: TItem13 | PipeAction<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>>, item14: TItem14 | PipeAction<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>>, item15: TItem15 | PipeAction<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>>, item16: TItem16 | PipeAction<InferOutput<TItem15>, InferOutput<TItem16>, InferIssue<TItem16>>, item17: TItem17 | PipeAction<InferOutput<TItem16>, InferOutput<TItem17>, InferIssue<TItem17>>, item18: TItem18 | PipeAction<InferOutput<TItem17>, InferOutput<TItem18>, InferIssue<TItem18>>, item19: TItem19 | PipeAction<InferOutput<TItem18>, InferOutput<TItem19>, InferIssue<TItem19>>): SchemaWithPipe<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12,
    TItem13,
    TItem14,
    TItem15,
    TItem16,
    TItem17,
    TItem18,
    TItem19
]>;

/**
 * Schema with pipe async type.
 */
type SchemaWithPipeAsync<TPipe extends [
    (BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>),
    ...(PipeItem<any, unknown, BaseIssue<unknown>> | PipeItemAsync<any, unknown, BaseIssue<unknown>>)[]
]> = Omit<FirstTupleItem<TPipe>, 'async' | '_run' | '_types'> & {
    /**
     * The pipe items.
     */
    readonly pipe: TPipe;
    /**
     * Whether it's async.
     */
    readonly async: true;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    readonly _run: (dataset: Dataset<unknown, never>, config: Config<InferIssue<FirstTupleItem<TPipe>>>) => Promise<Dataset<InferOutput<LastTupleItem<TPipe>>, InferIssue<TPipe[number]>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferInput<FirstTupleItem<TPipe>>;
        readonly output: InferOutput<LastTupleItem<TPipe>>;
        readonly issue: InferIssue<TPipe[number]>;
    };
};
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>): SchemaWithPipeAsync<[TSchema, TItem1]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>): SchemaWithPipeAsync<[TSchema, TItem1, TItem2]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>): SchemaWithPipeAsync<[TSchema, TItem1, TItem2, TItem3]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>): SchemaWithPipeAsync<[TSchema, TItem1, TItem2, TItem3, TItem4]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>> | PipeActionAsync<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>): SchemaWithPipeAsync<[TSchema, TItem1, TItem2, TItem3, TItem4, TItem5]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>> | PipeActionAsync<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>> | PipeActionAsync<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>): SchemaWithPipeAsync<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>> | PipeActionAsync<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>> | PipeActionAsync<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>> | PipeActionAsync<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>): SchemaWithPipeAsync<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem7>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>> | PipeActionAsync<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>> | PipeActionAsync<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>> | PipeActionAsync<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>> | PipeActionAsync<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>): SchemaWithPipeAsync<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem8>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>> | PipeActionAsync<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>> | PipeActionAsync<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>> | PipeActionAsync<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>> | PipeActionAsync<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>> | PipeActionAsync<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>): SchemaWithPipeAsync<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem9>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>> | PipeActionAsync<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>> | PipeActionAsync<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>> | PipeActionAsync<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>> | PipeActionAsync<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>> | PipeActionAsync<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>> | PipeActionAsync<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>): SchemaWithPipeAsync<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem10>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>> | PipeActionAsync<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>> | PipeActionAsync<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>> | PipeActionAsync<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>> | PipeActionAsync<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>> | PipeActionAsync<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>> | PipeActionAsync<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>> | PipeActionAsync<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>): SchemaWithPipeAsync<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem11>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>> | PipeActionAsync<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>> | PipeActionAsync<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>> | PipeActionAsync<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>> | PipeActionAsync<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>> | PipeActionAsync<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>> | PipeActionAsync<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>> | PipeActionAsync<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>> | PipeActionAsync<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>): SchemaWithPipeAsync<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 * @param item13 The thirteenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem11>, unknown, BaseIssue<unknown>>, const TItem13 extends PipeItem<InferOutput<TItem12>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem12>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>> | PipeActionAsync<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>> | PipeActionAsync<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>> | PipeActionAsync<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>> | PipeActionAsync<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>> | PipeActionAsync<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>> | PipeActionAsync<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>> | PipeActionAsync<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>> | PipeActionAsync<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>, item13: TItem13 | PipeAction<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>> | PipeActionAsync<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>>): SchemaWithPipeAsync<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12,
    TItem13
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 * @param item13 The thirteenth pipe item.
 * @param item14 The fourteenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem11>, unknown, BaseIssue<unknown>>, const TItem13 extends PipeItem<InferOutput<TItem12>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem12>, unknown, BaseIssue<unknown>>, const TItem14 extends PipeItem<InferOutput<TItem13>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem13>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>> | PipeActionAsync<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>> | PipeActionAsync<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>> | PipeActionAsync<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>> | PipeActionAsync<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>> | PipeActionAsync<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>> | PipeActionAsync<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>> | PipeActionAsync<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>> | PipeActionAsync<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>, item13: TItem13 | PipeAction<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>> | PipeActionAsync<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>>, item14: TItem14 | PipeAction<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>> | PipeActionAsync<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>>): SchemaWithPipeAsync<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12,
    TItem13,
    TItem14
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 * @param item13 The thirteenth pipe item.
 * @param item14 The fourteenth pipe item.
 * @param item15 The fifteenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem11>, unknown, BaseIssue<unknown>>, const TItem13 extends PipeItem<InferOutput<TItem12>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem12>, unknown, BaseIssue<unknown>>, const TItem14 extends PipeItem<InferOutput<TItem13>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem13>, unknown, BaseIssue<unknown>>, const TItem15 extends PipeItem<InferOutput<TItem14>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem14>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>> | PipeActionAsync<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>> | PipeActionAsync<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>> | PipeActionAsync<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>> | PipeActionAsync<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>> | PipeActionAsync<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>> | PipeActionAsync<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>> | PipeActionAsync<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>> | PipeActionAsync<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>, item13: TItem13 | PipeAction<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>> | PipeActionAsync<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>>, item14: TItem14 | PipeAction<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>> | PipeActionAsync<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>>, item15: TItem15 | PipeAction<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>> | PipeActionAsync<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>>): SchemaWithPipeAsync<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12,
    TItem13,
    TItem14,
    TItem15
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 * @param item13 The thirteenth pipe item.
 * @param item14 The fourteenth pipe item.
 * @param item15 The fifteenth pipe item.
 * @param item16 The sixteenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem11>, unknown, BaseIssue<unknown>>, const TItem13 extends PipeItem<InferOutput<TItem12>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem12>, unknown, BaseIssue<unknown>>, const TItem14 extends PipeItem<InferOutput<TItem13>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem13>, unknown, BaseIssue<unknown>>, const TItem15 extends PipeItem<InferOutput<TItem14>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem14>, unknown, BaseIssue<unknown>>, const TItem16 extends PipeItem<InferOutput<TItem15>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem15>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>> | PipeActionAsync<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>> | PipeActionAsync<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>> | PipeActionAsync<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>> | PipeActionAsync<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>> | PipeActionAsync<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>> | PipeActionAsync<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>> | PipeActionAsync<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>> | PipeActionAsync<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>, item13: TItem13 | PipeAction<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>> | PipeActionAsync<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>>, item14: TItem14 | PipeAction<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>> | PipeActionAsync<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>>, item15: TItem15 | PipeAction<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>> | PipeActionAsync<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>>, item16: TItem16 | PipeAction<InferOutput<TItem15>, InferOutput<TItem16>, InferIssue<TItem16>> | PipeActionAsync<InferOutput<TItem15>, InferOutput<TItem16>, InferIssue<TItem16>>): SchemaWithPipeAsync<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12,
    TItem13,
    TItem14,
    TItem15,
    TItem16
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 * @param item13 The thirteenth pipe item.
 * @param item14 The fourteenth pipe item.
 * @param item15 The fifteenth pipe item.
 * @param item16 The sixteenth pipe item.
 * @param item17 The seventeenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem11>, unknown, BaseIssue<unknown>>, const TItem13 extends PipeItem<InferOutput<TItem12>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem12>, unknown, BaseIssue<unknown>>, const TItem14 extends PipeItem<InferOutput<TItem13>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem13>, unknown, BaseIssue<unknown>>, const TItem15 extends PipeItem<InferOutput<TItem14>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem14>, unknown, BaseIssue<unknown>>, const TItem16 extends PipeItem<InferOutput<TItem15>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem15>, unknown, BaseIssue<unknown>>, const TItem17 extends PipeItem<InferOutput<TItem16>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem16>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>> | PipeActionAsync<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>> | PipeActionAsync<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>> | PipeActionAsync<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>> | PipeActionAsync<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>> | PipeActionAsync<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>> | PipeActionAsync<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>> | PipeActionAsync<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>> | PipeActionAsync<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>, item13: TItem13 | PipeAction<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>> | PipeActionAsync<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>>, item14: TItem14 | PipeAction<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>> | PipeActionAsync<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>>, item15: TItem15 | PipeAction<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>> | PipeActionAsync<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>>, item16: TItem16 | PipeAction<InferOutput<TItem15>, InferOutput<TItem16>, InferIssue<TItem16>> | PipeActionAsync<InferOutput<TItem15>, InferOutput<TItem16>, InferIssue<TItem16>>, item17: TItem17 | PipeAction<InferOutput<TItem16>, InferOutput<TItem17>, InferIssue<TItem17>> | PipeActionAsync<InferOutput<TItem16>, InferOutput<TItem17>, InferIssue<TItem17>>): SchemaWithPipeAsync<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12,
    TItem13,
    TItem14,
    TItem15,
    TItem16,
    TItem17
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 * @param item13 The thirteenth pipe item.
 * @param item14 The fourteenth pipe item.
 * @param item15 The fifteenth pipe item.
 * @param item16 The sixteenth pipe item.
 * @param item17 The seventeenth pipe item.
 * @param item18 The eighteenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem11>, unknown, BaseIssue<unknown>>, const TItem13 extends PipeItem<InferOutput<TItem12>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem12>, unknown, BaseIssue<unknown>>, const TItem14 extends PipeItem<InferOutput<TItem13>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem13>, unknown, BaseIssue<unknown>>, const TItem15 extends PipeItem<InferOutput<TItem14>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem14>, unknown, BaseIssue<unknown>>, const TItem16 extends PipeItem<InferOutput<TItem15>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem15>, unknown, BaseIssue<unknown>>, const TItem17 extends PipeItem<InferOutput<TItem16>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem16>, unknown, BaseIssue<unknown>>, const TItem18 extends PipeItem<InferOutput<TItem17>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem17>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>> | PipeActionAsync<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>> | PipeActionAsync<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>> | PipeActionAsync<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>> | PipeActionAsync<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>> | PipeActionAsync<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>> | PipeActionAsync<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>> | PipeActionAsync<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>> | PipeActionAsync<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>, item13: TItem13 | PipeAction<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>> | PipeActionAsync<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>>, item14: TItem14 | PipeAction<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>> | PipeActionAsync<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>>, item15: TItem15 | PipeAction<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>> | PipeActionAsync<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>>, item16: TItem16 | PipeAction<InferOutput<TItem15>, InferOutput<TItem16>, InferIssue<TItem16>> | PipeActionAsync<InferOutput<TItem15>, InferOutput<TItem16>, InferIssue<TItem16>>, item17: TItem17 | PipeAction<InferOutput<TItem16>, InferOutput<TItem17>, InferIssue<TItem17>> | PipeActionAsync<InferOutput<TItem16>, InferOutput<TItem17>, InferIssue<TItem17>>, item18: TItem18 | PipeAction<InferOutput<TItem17>, InferOutput<TItem18>, InferIssue<TItem18>> | PipeActionAsync<InferOutput<TItem17>, InferOutput<TItem18>, InferIssue<TItem18>>): SchemaWithPipeAsync<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12,
    TItem13,
    TItem14,
    TItem15,
    TItem16,
    TItem17,
    TItem18
]>;
/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 * @param item10 The tenth pipe item.
 * @param item11 The eleventh pipe item.
 * @param item12 The twelfth pipe item.
 * @param item13 The thirteenth pipe item.
 * @param item14 The fourteenth pipe item.
 * @param item15 The fifteenth pipe item.
 * @param item16 The sixteenth pipe item.
 * @param item17 The seventeenth pipe item.
 * @param item18 The eighteenth pipe item.
 * @param item19 The nineteenth pipe item.
 *
 * @returns A schema with a pipeline.
 */
declare function pipeAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TItem1 extends PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>, const TItem2 extends PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>, const TItem3 extends PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>, const TItem4 extends PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>, const TItem5 extends PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>, const TItem6 extends PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>, const TItem7 extends PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>, const TItem8 extends PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem7>, unknown, BaseIssue<unknown>>, const TItem9 extends PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem8>, unknown, BaseIssue<unknown>>, const TItem10 extends PipeItem<InferOutput<TItem9>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem9>, unknown, BaseIssue<unknown>>, const TItem11 extends PipeItem<InferOutput<TItem10>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem10>, unknown, BaseIssue<unknown>>, const TItem12 extends PipeItem<InferOutput<TItem11>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem11>, unknown, BaseIssue<unknown>>, const TItem13 extends PipeItem<InferOutput<TItem12>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem12>, unknown, BaseIssue<unknown>>, const TItem14 extends PipeItem<InferOutput<TItem13>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem13>, unknown, BaseIssue<unknown>>, const TItem15 extends PipeItem<InferOutput<TItem14>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem14>, unknown, BaseIssue<unknown>>, const TItem16 extends PipeItem<InferOutput<TItem15>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem15>, unknown, BaseIssue<unknown>>, const TItem17 extends PipeItem<InferOutput<TItem16>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem16>, unknown, BaseIssue<unknown>>, const TItem18 extends PipeItem<InferOutput<TItem17>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem17>, unknown, BaseIssue<unknown>>, const TItem19 extends PipeItem<InferOutput<TItem18>, unknown, BaseIssue<unknown>> | PipeItemAsync<InferOutput<TItem18>, unknown, BaseIssue<unknown>>>(schema: TSchema, item1: TItem1 | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>> | PipeActionAsync<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>, item2: TItem2 | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>> | PipeActionAsync<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>, item3: TItem3 | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>> | PipeActionAsync<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>, item4: TItem4 | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>> | PipeActionAsync<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>, item5: TItem5 | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>> | PipeActionAsync<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>, item6: TItem6 | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>> | PipeActionAsync<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>, item7: TItem7 | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>> | PipeActionAsync<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>, item8: TItem8 | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>> | PipeActionAsync<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>, item9: TItem9 | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>> | PipeActionAsync<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>, item10: TItem10 | PipeAction<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>> | PipeActionAsync<InferOutput<TItem9>, InferOutput<TItem10>, InferIssue<TItem10>>, item11: TItem11 | PipeAction<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>> | PipeActionAsync<InferOutput<TItem10>, InferOutput<TItem11>, InferIssue<TItem11>>, item12: TItem12 | PipeAction<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>> | PipeActionAsync<InferOutput<TItem11>, InferOutput<TItem12>, InferIssue<TItem12>>, item13: TItem13 | PipeAction<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>> | PipeActionAsync<InferOutput<TItem12>, InferOutput<TItem13>, InferIssue<TItem13>>, item14: TItem14 | PipeAction<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>> | PipeActionAsync<InferOutput<TItem13>, InferOutput<TItem14>, InferIssue<TItem14>>, item15: TItem15 | PipeAction<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>> | PipeActionAsync<InferOutput<TItem14>, InferOutput<TItem15>, InferIssue<TItem15>>, item16: TItem16 | PipeAction<InferOutput<TItem15>, InferOutput<TItem16>, InferIssue<TItem16>> | PipeActionAsync<InferOutput<TItem15>, InferOutput<TItem16>, InferIssue<TItem16>>, item17: TItem17 | PipeAction<InferOutput<TItem16>, InferOutput<TItem17>, InferIssue<TItem17>> | PipeActionAsync<InferOutput<TItem16>, InferOutput<TItem17>, InferIssue<TItem17>>, item18: TItem18 | PipeAction<InferOutput<TItem17>, InferOutput<TItem18>, InferIssue<TItem18>> | PipeActionAsync<InferOutput<TItem17>, InferOutput<TItem18>, InferIssue<TItem18>>, item19: TItem19 | PipeAction<InferOutput<TItem18>, InferOutput<TItem19>, InferIssue<TItem19>> | PipeActionAsync<InferOutput<TItem18>, InferOutput<TItem19>, InferIssue<TItem19>>): SchemaWithPipeAsync<[
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
    TItem10,
    TItem11,
    TItem12,
    TItem13,
    TItem14,
    TItem15,
    TItem16,
    TItem17,
    TItem18,
    TItem19
]>;

/**
 * Schema type.
 */
type Schema$1 = NoPipe<LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined> | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchema<ObjectEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchema<ObjectEntries, ErrorMessage<StrictObjectIssue> | undefined>>;
/**
 * Required entries type.
 */
type RequiredEntries$1<TEntries extends ObjectEntries, TKeys extends readonly (keyof TEntries)[] | undefined, TMessage extends ErrorMessage<NonOptionalIssue> | undefined> = {
    [TKey in keyof TEntries]: TKeys extends readonly (keyof TEntries)[] ? TKey extends TKeys[number] ? NonOptionalSchema<TEntries[TKey], TMessage> : TEntries[TKey] : NonOptionalSchema<TEntries[TKey], TMessage>;
};
/**
 * Schema with required type.
 */
type SchemaWithRequired<TSchema extends Schema$1, TKeys extends ObjectKeys<TSchema> | undefined, TMessage extends ErrorMessage<NonOptionalIssue> | undefined> = TSchema extends ObjectSchema<infer TEntries, ErrorMessage<ObjectIssue> | undefined> | StrictObjectSchema<infer TEntries, ErrorMessage<StrictObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: RequiredEntries$1<TEntries, TKeys, TMessage>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<InferIssue<TSchema>>): Dataset<InferObjectOutput<RequiredEntries$1<TEntries, TKeys, TMessage>>, NonOptionalIssue | InferIssue<TSchema>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<RequiredEntries$1<TEntries, TKeys, TMessage>>;
        readonly output: InferObjectOutput<RequiredEntries$1<TEntries, TKeys, TMessage>>;
        readonly issue: NonOptionalIssue | InferIssue<TSchema>;
    };
} : TSchema extends LooseObjectSchema<infer TEntries, ErrorMessage<LooseObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: RequiredEntries$1<TEntries, TKeys, TMessage>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<InferIssue<TSchema>>): Dataset<InferObjectOutput<RequiredEntries$1<TEntries, TKeys, TMessage>> & {
        [key: string]: unknown;
    }, NonOptionalIssue | InferIssue<TSchema>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<RequiredEntries$1<TEntries, TKeys, TMessage>> & {
            [key: string]: unknown;
        };
        readonly output: InferObjectOutput<RequiredEntries$1<TEntries, TKeys, TMessage>> & {
            [key: string]: unknown;
        };
        readonly issue: NonOptionalIssue | InferIssue<TSchema>;
    };
} : TSchema extends ObjectWithRestSchema<infer TEntries, infer TRest, ErrorMessage<ObjectWithRestIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: RequiredEntries$1<TEntries, TKeys, TMessage>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<InferIssue<TSchema>>): Dataset<InferObjectOutput<RequiredEntries$1<TEntries, TKeys, TMessage>> & {
        [key: string]: InferOutput<TRest>;
    }, NonOptionalIssue | InferIssue<TSchema>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<RequiredEntries$1<TEntries, TKeys, TMessage>> & {
            [key: string]: InferInput<TRest>;
        };
        readonly output: InferObjectOutput<RequiredEntries$1<TEntries, TKeys, TMessage>> & {
            [key: string]: InferOutput<TRest>;
        };
        readonly issue: NonOptionalIssue | InferIssue<TSchema>;
    };
} : never;
/**
 * Creates a modified copy of an object schema that marks all entries as required.
 *
 * @param schema The schema to modify.
 *
 * @returns An object schema.
 */
declare function required<const TSchema extends Schema$1>(schema: TSchema): SchemaWithRequired<TSchema, undefined, undefined>;
/**
 * Creates a modified copy of an object schema that marks all entries as required.
 *
 * @param schema The schema to modify.
 * @param message The error message.
 *
 * @returns An object schema.
 */
declare function required<const TSchema extends Schema$1, const TMessage extends ErrorMessage<NonOptionalIssue> | undefined>(schema: TSchema, message: TMessage): SchemaWithRequired<TSchema, undefined, TMessage>;
/**
 * Creates a modified copy of an object schema that marks the selected entries
 * as required.
 *
 * @param schema The schema to modify.
 * @param keys The selected entries.
 *
 * @returns An object schema.
 */
declare function required<const TSchema extends Schema$1, const TKeys extends ObjectKeys<TSchema>>(schema: TSchema, keys: TKeys): SchemaWithRequired<TSchema, TKeys, undefined>;
/**
 * Creates a modified copy of an object schema that marks the selected entries
 * as required.
 *
 * @param schema The schema to modify.
 * @param keys The selected entries.
 * @param message The error message.
 *
 * @returns An object schema.
 */
declare function required<const TSchema extends Schema$1, const TKeys extends ObjectKeys<TSchema>, const TMessage extends ErrorMessage<NonOptionalIssue> | undefined>(schema: TSchema, keys: TKeys, message: TMessage): SchemaWithRequired<TSchema, TKeys, TMessage>;

/**
 * Schema type.
 */
type Schema = NoPipe<LooseObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<LooseObjectIssue> | undefined> | ObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchemaAsync<ObjectEntriesAsync, BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<StrictObjectIssue> | undefined>>;
/**
 * Required entries type.
 */
type RequiredEntries<TEntries extends ObjectEntriesAsync, TKeys extends readonly (keyof TEntries)[] | undefined, TMessage extends ErrorMessage<NonOptionalIssue> | undefined> = {
    [TKey in keyof TEntries]: TKeys extends readonly (keyof TEntries)[] ? TKey extends TKeys[number] ? NonOptionalSchemaAsync<TEntries[TKey], TMessage> : TEntries[TKey] : NonOptionalSchemaAsync<TEntries[TKey], TMessage>;
};
/**
 * Schema with required type.
 */
type SchemaWithRequiredAsync<TSchema extends Schema, TKeys extends ObjectKeys<TSchema> | undefined, TMessage extends ErrorMessage<NonOptionalIssue> | undefined> = TSchema extends ObjectSchemaAsync<infer TEntries, ErrorMessage<ObjectIssue> | undefined> | StrictObjectSchemaAsync<infer TEntries, ErrorMessage<StrictObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: RequiredEntries<TEntries, TKeys, TMessage>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<InferIssue<TSchema>>): Promise<Dataset<InferObjectOutput<RequiredEntries<TEntries, TKeys, TMessage>>, NonOptionalIssue | InferIssue<TSchema>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<RequiredEntries<TEntries, TKeys, TMessage>>;
        readonly output: InferObjectOutput<RequiredEntries<TEntries, TKeys, TMessage>>;
        readonly issue: NonOptionalIssue | InferIssue<TSchema>;
    };
} : TSchema extends LooseObjectSchemaAsync<infer TEntries, ErrorMessage<LooseObjectIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: RequiredEntries<TEntries, TKeys, TMessage>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<InferIssue<TSchema>>): Promise<Dataset<InferObjectOutput<RequiredEntries<TEntries, TKeys, TMessage>> & {
        [key: string]: unknown;
    }, NonOptionalIssue | InferIssue<TSchema>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<RequiredEntries<TEntries, TKeys, TMessage>> & {
            [key: string]: unknown;
        };
        readonly output: InferObjectOutput<RequiredEntries<TEntries, TKeys, TMessage>> & {
            [key: string]: unknown;
        };
        readonly issue: NonOptionalIssue | InferIssue<TSchema>;
    };
} : TSchema extends ObjectWithRestSchemaAsync<infer TEntries, infer TRest, ErrorMessage<ObjectWithRestIssue> | undefined> ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
    /**
     * The object entries.
     */
    readonly entries: RequiredEntries<TEntries, TKeys, TMessage>;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    _run(dataset: Dataset<unknown, never>, config: Config<InferIssue<TSchema>>): Promise<Dataset<InferObjectOutput<RequiredEntries<TEntries, TKeys, TMessage>> & {
        [key: string]: InferOutput<TRest>;
    }, NonOptionalIssue | InferIssue<TSchema>>>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: InferObjectInput<RequiredEntries<TEntries, TKeys, TMessage>> & {
            [key: string]: InferInput<TRest>;
        };
        readonly output: InferObjectOutput<RequiredEntries<TEntries, TKeys, TMessage>> & {
            [key: string]: InferOutput<TRest>;
        };
        readonly issue: NonOptionalIssue | InferIssue<TSchema>;
    };
} : never;
/**
 * Creates a modified copy of an object schema that marks all entries as required.
 *
 * @param schema The schema to modify.
 *
 * @returns An object schema.
 */
declare function requiredAsync<const TSchema extends Schema>(schema: TSchema): SchemaWithRequiredAsync<TSchema, undefined, undefined>;
/**
 * Creates a modified copy of an object schema that marks all entries as required.
 *
 * @param schema The schema to modify.
 * @param message The error message.
 *
 * @returns An object schema.
 */
declare function requiredAsync<const TSchema extends Schema, const TMessage extends ErrorMessage<NonOptionalIssue> | undefined>(schema: TSchema, message: TMessage): SchemaWithRequiredAsync<TSchema, undefined, TMessage>;
/**
 * Creates a modified copy of an object schema that marks the selected entries
 * as required.
 *
 * @param schema The schema to modify.
 * @param keys The selected entries.
 *
 * @returns An object schema.
 */
declare function requiredAsync<const TSchema extends Schema, const TKeys extends ObjectKeys<TSchema>>(schema: TSchema, keys: TKeys): SchemaWithRequiredAsync<TSchema, TKeys, undefined>;
/**
 * Creates a modified copy of an object schema that marks the selected entries
 * as required.
 *
 * @param schema The schema to modify.
 * @param keys The selected entries.
 * @param message The error message.
 *
 * @returns An object schema.
 */
declare function requiredAsync<const TSchema extends Schema, const TKeys extends ObjectKeys<TSchema>, const TMessage extends ErrorMessage<NonOptionalIssue> | undefined>(schema: TSchema, keys: TKeys, message: TMessage): SchemaWithRequiredAsync<TSchema, TKeys, TMessage>;

/**
 * Safe parse result type.
 */
type SafeParseResult<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = {
    /**
     * Whether is's typed.
     */
    readonly typed: true;
    /**
     * Whether it's successful.
     */
    readonly success: true;
    /**
     * The output value.
     */
    readonly output: InferOutput<TSchema>;
    /**
     * The issues if any.
     */
    readonly issues: undefined;
} | {
    readonly typed: true;
    readonly success: false;
    readonly output: InferOutput<TSchema>;
    readonly issues: [InferIssue<TSchema>, ...InferIssue<TSchema>[]];
} | {
    readonly typed: false;
    readonly success: false;
    readonly output: unknown;
    readonly issues: [InferIssue<TSchema>, ...InferIssue<TSchema>[]];
};

/**
 * Parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 * @param config The parse configuration.
 *
 * @returns The parse result.
 */
declare function safeParse<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(schema: TSchema, input: unknown, config?: Config<InferIssue<TSchema>>): SafeParseResult<TSchema>;

/**
 * Parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 * @param config The parse configuration.
 *
 * @returns The parse result.
 */
declare function safeParseAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(schema: TSchema, input: unknown, config?: Config<InferIssue<TSchema>>): Promise<SafeParseResult<TSchema>>;

/**
 * The safe parser type.
 */
interface SafeParser<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TConfig extends Config<InferIssue<TSchema>> | undefined> {
    /**
     * Parses an unknown input based on the schema.
     */
    (input: unknown): SafeParseResult<TSchema>;
    /**
     * The schema to be used.
     */
    readonly schema: TSchema;
    /**
     * The parser configuration.
     */
    readonly config: TConfig;
}
/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 *
 * @returns The parser function.
 */
declare function safeParser<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(schema: TSchema): SafeParser<TSchema, undefined>;
/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param config The parser configuration.
 *
 * @returns The parser function.
 */
declare function safeParser<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, const TConfig extends Config<InferIssue<TSchema>> | undefined>(schema: TSchema, config: TConfig): SafeParser<TSchema, TConfig>;

/**
 * The safe parser async type.
 */
interface SafeParserAsync<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TConfig extends Config<InferIssue<TSchema>> | undefined> {
    /**
     * Parses an unknown input based on the schema.
     */
    (input: unknown): Promise<SafeParseResult<TSchema>>;
    /**
     * The schema to be used.
     */
    readonly schema: TSchema;
    /**
     * The parser configuration.
     */
    readonly config: TConfig;
}
/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 *
 * @returns The parser function.
 */
declare function safeParserAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(schema: TSchema): SafeParserAsync<TSchema, undefined>;
/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param config The parser configuration.
 *
 * @returns The parser function.
 */
declare function safeParserAsync<const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, const TConfig extends Config<InferIssue<TSchema>> | undefined>(schema: TSchema, config: TConfig): SafeParserAsync<TSchema, TConfig>;

/**
 * Unwraps the wrapped schema.
 *
 * @param schema The schema to be unwrapped.
 *
 * @returns The unwrapped schema.
 */
declare function unwrap<TSchema extends NonNullableSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<NonNullableIssue> | undefined> | NonNullableSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<NonNullableIssue> | undefined> | NonNullishSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<NonNullishIssue> | undefined> | NonNullishSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<NonNullishIssue> | undefined> | NonOptionalSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<NonOptionalIssue> | undefined> | NonOptionalSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<NonOptionalIssue> | undefined> | NullableSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown> | NullableSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, unknown> | NullishSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown> | NullishSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, unknown> | OptionalSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown> | OptionalSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, unknown> | UndefinedableSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown> | UndefinedableSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, unknown>>(schema: TSchema): TSchema['wrapped'];

/**
 * Base metadata type.
 */
interface BaseMetadata<TInput> {
    /**
     * The object kind.
     */
    readonly kind: 'metadata';
    /**
     * The metadata type.
     */
    readonly type: string;
    /**
     * The metadata reference.
     */
    readonly reference: (...args: any[]) => BaseMetadata<any>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: TInput;
        readonly output: TInput;
        readonly issue: never;
    };
}
/**
 * Generic metadata type.
 */
interface GenericMetadata<TInput = any> extends BaseMetadata<TInput> {
}

/**
 * Typed dataset type.
 */
interface TypedDataset<TValue, TIssue extends BaseIssue<unknown>> {
    /**
     * Whether is's typed.
     */
    typed: true;
    /**
     * The dataset value.
     */
    value: TValue;
    /**
     * The dataset issues.
     */
    issues?: [TIssue, ...TIssue[]];
}
/**
 * Untyped dataset type.
 */
interface UntypedDataset<TIssue extends BaseIssue<unknown>> {
    /**
     * Whether is's typed.
     */
    typed: false;
    /**
     * The dataset value.
     */
    value: unknown;
    /**
     * The dataset issues.
     */
    issues?: [TIssue, ...TIssue[]];
}
/**
 * Dataset type.
 */
type Dataset<TValue, TIssue extends BaseIssue<unknown>> = TypedDataset<TValue, TIssue> | UntypedDataset<TIssue>;

/**
 * Base schema type.
 */
interface BaseSchema<TInput, TOutput, TIssue extends BaseIssue<unknown>> {
    /**
     * The object kind.
     */
    readonly kind: 'schema';
    /**
     * The schema type.
     */
    readonly type: string;
    /**
     * The schema reference.
     */
    readonly reference: (...args: any[]) => BaseSchema<unknown, unknown, BaseIssue<unknown>>;
    /**
     * The expected property.
     */
    readonly expects: string;
    /**
     * Whether it's async.
     */
    readonly async: false;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    readonly _run: (dataset: Dataset<unknown, never>, config: Config<TIssue>) => Dataset<TOutput, TIssue>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: TInput;
        readonly output: TOutput;
        readonly issue: TIssue;
    };
}
/**
 * Base schema async type.
 */
interface BaseSchemaAsync<TInput, TOutput, TIssue extends BaseIssue<unknown>> extends Omit<BaseSchema<TInput, TOutput, TIssue>, 'reference' | 'async' | '_run'> {
    /**
     * The schema reference.
     */
    readonly reference: (...args: any[]) => BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>;
    /**
     * Whether it's async.
     */
    readonly async: true;
    /**
     * Parses unknown input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    readonly _run: (dataset: Dataset<unknown, never>, config: Config<TIssue>) => Promise<Dataset<TOutput, TIssue>>;
}
/**
 * Generic schema type.
 */
interface GenericSchema<TInput = unknown, TOutput = TInput, TIssue extends BaseIssue<unknown> = BaseIssue<unknown>> extends BaseSchema<TInput, TOutput, TIssue> {
}
/**
 * Generic schema async type.
 */
interface GenericSchemaAsync<TInput = unknown, TOutput = TInput, TIssue extends BaseIssue<unknown> = BaseIssue<unknown>> extends BaseSchemaAsync<TInput, TOutput, TIssue> {
}

/**
 * Base transformation type.
 */
interface BaseTransformation<TInput, TOutput, TIssue extends BaseIssue<unknown>> {
    /**
     * The object kind.
     */
    readonly kind: 'transformation';
    /**
     * The transformation type.
     */
    readonly type: string;
    /**
     * The transformation reference.
     */
    readonly reference: (...args: any[]) => BaseTransformation<any, any, BaseIssue<unknown>>;
    /**
     * Whether it's async.
     */
    readonly async: false;
    /**
     * Transforms known input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    readonly _run: (dataset: TypedDataset<TInput, never>, config: Config<TIssue>) => Dataset<TOutput, TIssue>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: TInput;
        readonly output: TOutput;
        readonly issue: TIssue;
    };
}
/**
 * Base transformation async type.
 */
interface BaseTransformationAsync<TInput, TOutput, TIssue extends BaseIssue<unknown>> extends Omit<BaseTransformation<TInput, TOutput, TIssue>, 'reference' | 'async' | '_run'> {
    /**
     * The transformation reference.
     */
    readonly reference: (...args: any[]) => BaseTransformation<any, any, BaseIssue<unknown>> | BaseTransformationAsync<any, any, BaseIssue<unknown>>;
    /**
     * Whether it's async.
     */
    readonly async: true;
    /**
     * Transforms known input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    readonly _run: (dataset: TypedDataset<TInput, never>, config: Config<TIssue>) => Promise<Dataset<TOutput, TIssue>>;
}
/**
 * Generic transformation type.
 */
interface GenericTransformation<TInput = any, TOutput = TInput, TIssue extends BaseIssue<unknown> = BaseIssue<unknown>> extends BaseTransformation<TInput, TOutput, TIssue> {
}
/**
 * Generic transformation async type.
 */
interface GenericTransformationAsync<TInput = any, TOutput = TInput, TIssue extends BaseIssue<unknown> = BaseIssue<unknown>> extends BaseTransformationAsync<TInput, TOutput, TIssue> {
}

/**
 * Base validation type.
 */
interface BaseValidation<TInput, TOutput, TIssue extends BaseIssue<unknown>> {
    /**
     * The object kind.
     */
    readonly kind: 'validation';
    /**
     * The validation type.
     */
    readonly type: string;
    /**
     * The validation reference.
     */
    readonly reference: (...args: any[]) => BaseValidation<any, any, BaseIssue<unknown>>;
    /**
     * The expected property.
     */
    readonly expects: string | null;
    /**
     * Whether it's async.
     */
    readonly async: false;
    /**
     * Validates known input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    readonly _run: (dataset: Dataset<TInput, BaseIssue<unknown>>, config: Config<TIssue>) => Dataset<TOutput, BaseIssue<unknown> | TIssue>;
    /**
     * Input, output and issue type.
     *
     * @internal
     */
    readonly _types?: {
        readonly input: TInput;
        readonly output: TOutput;
        readonly issue: TIssue;
    };
}
/**
 * Base validation async type.
 */
interface BaseValidationAsync<TInput, TOutput, TIssue extends BaseIssue<unknown>> extends Omit<BaseValidation<TInput, TOutput, TIssue>, 'reference' | 'async' | '_run'> {
    /**
     * The validation reference.
     */
    readonly reference: (...args: any[]) => BaseValidation<any, any, BaseIssue<unknown>> | BaseValidationAsync<any, any, BaseIssue<unknown>>;
    /**
     * Whether it's async.
     */
    readonly async: true;
    /**
     * Validates known input.
     *
     * @param dataset The input dataset.
     * @param config The configuration.
     *
     * @returns The output dataset.
     *
     * @internal
     */
    readonly _run: (dataset: Dataset<TInput, BaseIssue<unknown>>, config: Config<TIssue>) => Promise<Dataset<TOutput, BaseIssue<unknown> | TIssue>>;
}
/**
 * Generic validation type.
 */
interface GenericValidation<TInput = any, TOutput = TInput, TIssue extends BaseIssue<unknown> = BaseIssue<unknown>> extends BaseValidation<TInput, TOutput, TIssue> {
}
/**
 * Generic validation async type.
 */
interface GenericValidationAsync<TInput = any, TOutput = TInput, TIssue extends BaseIssue<unknown> = BaseIssue<unknown>> extends BaseValidationAsync<TInput, TOutput, TIssue> {
}

/**
 * Infer input type.
 */
type InferInput<TItem extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>> | BaseValidation<any, unknown, BaseIssue<unknown>> | BaseValidationAsync<any, unknown, BaseIssue<unknown>> | BaseTransformation<any, unknown, BaseIssue<unknown>> | BaseTransformationAsync<any, unknown, BaseIssue<unknown>> | BaseMetadata<any>> = NonNullable<TItem['_types']>['input'];
/**
 * Infer output type.
 */
type InferOutput<TItem extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>> | BaseValidation<any, unknown, BaseIssue<unknown>> | BaseValidationAsync<any, unknown, BaseIssue<unknown>> | BaseTransformation<any, unknown, BaseIssue<unknown>> | BaseTransformationAsync<any, unknown, BaseIssue<unknown>> | BaseMetadata<any>> = NonNullable<TItem['_types']>['output'];
/**
 * Infer issue type.
 */
type InferIssue<TItem extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>> | BaseValidation<any, unknown, BaseIssue<unknown>> | BaseValidationAsync<any, unknown, BaseIssue<unknown>> | BaseTransformation<any, unknown, BaseIssue<unknown>> | BaseTransformationAsync<any, unknown, BaseIssue<unknown>> | BaseMetadata<any>> = NonNullable<TItem['_types']>['issue'];

/**
 * Extracts `null` from a type.
 */
type NonNullable$1<TValue> = TValue extends null ? never : TValue;
/**
 * Extracts `null` and `undefined` from a type.
 */
type NonNullish<TValue> = TValue extends null | undefined ? never : TValue;
/**
 * Extracts `undefined` from a type.
 */
type NonOptional<TValue> = TValue extends undefined ? never : TValue;
/**
 * Constructs a type that is maybe readonly.
 */
type MaybeReadonly<TValue> = TValue | Readonly<TValue>;
/**
 * Constructs a type that is maybe a promise.
 */
type MaybePromise<TValue> = TValue | Promise<TValue>;
/**
 * Prettifies a type for better readability.
 *
 * Hint: This type has no effect and is only used so that TypeScript displays
 * the final type in the preview instead of the utility types used.
 */
type Prettify<TObject> = {
    [TKey in keyof TObject]: TObject[TKey];
} & {};
/**
 * Marks specific keys as optional.
 */
type MarkOptional<TObject, TKeys extends keyof TObject> = Omit<TObject, TKeys> & Partial<Pick<TObject, TKeys>>;
/**
 * Extracts first tuple item.
 */
type FirstTupleItem<TTuple extends [unknown, ...unknown[]]> = TTuple[0];
/**
 * Extracts last tuple item.
 */
type LastTupleItem<TTuple extends [unknown, ...unknown[]]> = TTuple[TTuple extends [unknown, ...infer TRest] ? TRest['length'] : never];
/**
 * Converts union to intersection type.
 */
type UnionToIntersect<TUnion> = (TUnion extends any ? (arg: TUnion) => void : never) extends (arg: infer Intersect) => void ? Intersect : never;
/**
 * Converts union to tuple type.
 */
type UnionToTuple<TUnion> = UnionToIntersect<TUnion extends never ? never : () => TUnion> extends () => infer TLast ? [...UnionToTuple<Exclude<TUnion, TLast>>, TLast] : [];
/**
 * Extracts tuples with path keys.
 */
type PathKeys<TValue> = MaybeReadonly<TValue extends readonly unknown[] ? number extends TValue['length'] ? [number] | [number, ...PathKeys<TValue[number]>] : {
    [TKey in keyof TValue]: TKey extends `${infer TIndex extends number}` ? [TIndex] | [TIndex, ...PathKeys<TValue[TKey]>] : never;
}[keyof TValue & number] : TValue extends Record<string, unknown> ? {
    [TKey in keyof TValue]: [TKey] | [TKey, ...PathKeys<TValue[TKey]>];
}[keyof TValue] : never>;
/**
 * Deeply picks specific keys.
 *
 * Hint: If this type is ever exported and accessible from the outside, it must
 * be wrapped in `UnionToIntersect` to avoid invalid results.
 */
type DeepPick<TValue, TPathKeys extends PathKeys<TValue>> = TPathKeys extends readonly [infer TPathKey, ...infer TPathRest] ? TValue extends readonly unknown[] ? number extends TValue['length'] ? TPathRest extends PathKeys<TValue[number]> ? DeepPick<TValue[number], TPathRest>[] : TValue : TPathKey extends string | number ? {
    [TKey in keyof TValue]: TKey extends `${TPathKey}` ? TPathRest extends PathKeys<TValue[TKey]> ? DeepPick<TValue[TKey], TPathRest> : TValue[TKey] : unknown;
} : never : {
    [TKey in keyof TValue as TKey extends TPathKey ? TKey : never]: TPathRest extends PathKeys<TValue[TKey]> ? DeepPick<TValue[TKey], TPathRest> : TValue[TKey];
} : never;
/**
 * Deeply merges two types.
 */
type DeepMerge<TValue1, TValue2> = TValue1 extends readonly unknown[] ? TValue2 extends readonly unknown[] ? number extends TValue1['length'] | TValue2['length'] ? DeepMerge<TValue1[number], TValue2[number]>[] : {
    [TKey in keyof TValue1]: TKey extends keyof TValue2 ? unknown extends TValue1[TKey] ? TValue2[TKey] : TValue1[TKey] : never;
} : never : TValue1 extends Record<string, unknown> ? TValue2 extends Record<string, unknown> ? {
    [TKey in keyof (TValue1 & TValue2)]: TKey extends keyof TValue1 ? TKey extends keyof TValue2 ? DeepMerge<TValue1[TKey], TValue2[TKey]> : TValue1[TKey] : TKey extends keyof TValue2 ? TValue2[TKey] : never;
} : never : TValue1 & TValue2;
/**
 * Deeply picks N specific keys.
 */
type DeepPickN<TInput, TPathList extends readonly PathKeys<TInput>[]> = TPathList extends readonly [
    infer TPathKeys extends PathKeys<TInput>,
    ...infer TRest extends PathKeys<TInput>[]
] ? TRest extends readonly [unknown, ...(readonly unknown[])] ? DeepMerge<DeepPick<TInput, TPathKeys>, DeepPickN<TInput, TRest>> : DeepPick<TInput, TPathKeys> : TInput;

/**
 * Error message type.
 */
type ErrorMessage<TIssue extends BaseIssue<unknown>> = ((issue: TIssue) => string) | string;
/**
 * Default type.
 */
type Default<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, TInput extends null | undefined> = MaybeReadonly<InferInput<TWrapped> | TInput> | ((dataset?: Dataset<TInput, never>, config?: Config<InferIssue<TWrapped>>) => MaybeReadonly<InferInput<TWrapped> | TInput>);
/**
 * Default async type.
 */
type DefaultAsync<TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, TInput extends null | undefined> = MaybeReadonly<InferInput<TWrapped> | TInput> | ((dataset?: Dataset<TInput, never>, config?: Config<InferIssue<TWrapped>>) => MaybePromise<MaybeReadonly<InferInput<TWrapped> | TInput>>);
/**
 * Default value type.
 */
type DefaultValue<TDefault extends Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>, null | undefined> | DefaultAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, null | undefined>> = TDefault extends DefaultAsync<infer TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, infer TInput> ? TDefault extends (dataset?: Dataset<TInput, never>, config?: Config<InferIssue<TWrapped>>) => MaybePromise<InferInput<TWrapped> | TInput> ? Awaited<ReturnType<TDefault>> : TDefault : never;

/**
 * Object entries type.
 */
interface ObjectEntries {
    [key: string]: BaseSchema<unknown, unknown, BaseIssue<unknown>>;
}
/**
 * Object entries async type.
 */
interface ObjectEntriesAsync {
    [key: string]: BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>;
}
/**
 * Object keys type.
 */
type ObjectKeys<TSchema extends LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined> | LooseObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<LooseObjectIssue> | undefined> | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined> | ObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<ObjectIssue> | undefined> | ObjectWithRestSchema<ObjectEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | ObjectWithRestSchemaAsync<ObjectEntriesAsync, BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | StrictObjectSchema<ObjectEntries, ErrorMessage<StrictObjectIssue> | undefined> | StrictObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<StrictObjectIssue> | undefined>> = MaybeReadonly<[keyof TSchema['entries'], ...(keyof TSchema['entries'])[]]>;
/**
 * Question mark schema type.
 *
 * TODO: Document that for simplicity and bundle size, we currently do not
 * distinguish between `undefined` and missing keys when using `optional` and
 * `nullish`.
 */
type QuestionMarkSchema = NullishSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown> | NullishSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, unknown> | OptionalSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown> | OptionalSchemaAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, unknown>;
/**
 * Has default type.
 */
type HasDefault<TSchema extends QuestionMarkSchema> = [
    TSchema['default']
] extends [never] ? false : true;
/**
 * Exact optional input type.
 */
type ExactOptionalInput<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = TSchema extends OptionalSchema<infer TWrapped, never> | OptionalSchemaAsync<infer TWrapped, never> ? ExactOptionalInput<TWrapped> : InferInput<TSchema>;
/**
 * Exact optional output type.
 */
type ExactOptionalOutput<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = TSchema extends OptionalSchema<infer TWrapped, never> | OptionalSchemaAsync<infer TWrapped, never> ? HasDefault<TSchema> extends true ? InferOutput<TSchema> : ExactOptionalOutput<TWrapped> : InferOutput<TSchema>;
/**
 * Infer entries input type.
 */
type InferEntriesInput<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
    -readonly [TKey in keyof TEntries]: ExactOptionalInput<TEntries[TKey]>;
};
/**
 * Infer entries output type.
 */
type InferEntriesOutput<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
    -readonly [TKey in keyof TEntries]: ExactOptionalOutput<TEntries[TKey]>;
};
/**
 * Optional input keys type.
 */
type OptionalInputKeys<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
    [TKey in keyof TEntries]: TEntries[TKey] extends QuestionMarkSchema ? TKey : never;
}[keyof TEntries];
/**
 * Optional output keys type.
 */
type OptionalOutputKeys<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
    [TKey in keyof TEntries]: TEntries[TKey] extends QuestionMarkSchema ? undefined extends InferOutput<TEntries[TKey]> ? HasDefault<TEntries[TKey]> extends false ? TKey : never : never : never;
}[keyof TEntries];
/**
 * Input with question marks type.
 */
type InputWithQuestionMarks<TEntries extends ObjectEntries | ObjectEntriesAsync, TObject extends InferEntriesInput<TEntries> | InferEntriesOutput<TEntries>> = MarkOptional<TObject, OptionalInputKeys<TEntries>>;
/**
 * Output with question marks type.
 */
type OutputWithQuestionMarks<TEntries extends ObjectEntries | ObjectEntriesAsync, TObject extends InferEntriesInput<TEntries> | InferEntriesOutput<TEntries>> = MarkOptional<TObject, OptionalOutputKeys<TEntries>>;
/**
 * Readonly output keys type.
 */
type ReadonlyOutputKeys<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
    [TKey in keyof TEntries]: TEntries[TKey] extends SchemaWithPipe<infer TPipe> | SchemaWithPipeAsync<infer TPipe> ? ReadonlyAction<any> extends TPipe[number] ? TKey : never : never;
}[keyof TEntries];
/**
 * Output with readonly type.
 */
type OutputWithReadonly<TEntries extends ObjectEntries | ObjectEntriesAsync, TObject extends OutputWithQuestionMarks<TEntries, InferEntriesOutput<TEntries>>> = Readonly<TObject> & Pick<TObject, Exclude<keyof TObject, ReadonlyOutputKeys<TEntries>>>;
/**
 * Infer object input type.
 */
type InferObjectInput<TEntries extends ObjectEntries | ObjectEntriesAsync> = Prettify<InputWithQuestionMarks<TEntries, InferEntriesInput<TEntries>>>;
/**
 * Infer object output type.
 */
type InferObjectOutput<TEntries extends ObjectEntries | ObjectEntriesAsync> = Prettify<OutputWithReadonly<TEntries, OutputWithQuestionMarks<TEntries, InferEntriesOutput<TEntries>>>>;
/**
 * Infer object issue type.
 */
type InferObjectIssue<TEntries extends ObjectEntries | ObjectEntriesAsync> = InferIssue<TEntries[keyof TEntries]>;

/**
 * Tuple items type.
 */
type TupleItems = MaybeReadonly<BaseSchema<unknown, unknown, BaseIssue<unknown>>[]>;
/**
 * Tuple items async type.
 */
type TupleItemsAsync = MaybeReadonly<(BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>)[]>;
/**
 * Infer tuple input type.
 */
type InferTupleInput<TItems extends TupleItems | TupleItemsAsync> = {
    -readonly [TKey in keyof TItems]: InferInput<TItems[TKey]>;
};
/**
 * Infer tuple output type.
 */
type InferTupleOutput<TItems extends TupleItems | TupleItemsAsync> = {
    -readonly [TKey in keyof TItems]: InferOutput<TItems[TKey]>;
};
/**
 * Infer tuple issue type.
 */
type InferTupleIssue<TItems extends TupleItems | TupleItemsAsync> = InferIssue<TItems[number]>;

/**
 * Array path item type.
 */
interface ArrayPathItem {
    /**
     * The path item type.
     */
    readonly type: 'array';
    /**
     * The path item origin.
     */
    readonly origin: 'value';
    /**
     * The path item input.
     */
    readonly input: MaybeReadonly<unknown[]>;
    /**
     * The path item key.
     */
    readonly key: number;
    /**
     * The path item value.
     */
    readonly value: unknown;
}
/**
 * Map path item type.
 */
interface MapPathItem {
    /**
     * The path item type.
     */
    readonly type: 'map';
    /**
     * The path item origin.
     */
    readonly origin: 'key' | 'value';
    /**
     * The path item input.
     */
    readonly input: Map<unknown, unknown>;
    /**
     * The path item key.
     */
    readonly key: unknown;
    /**
     * The path item value.
     */
    readonly value: unknown;
}
/**
 * Object path item type.
 */
interface ObjectPathItem {
    /**
     * The path item type.
     */
    readonly type: 'object';
    /**
     * The path item origin.
     */
    readonly origin: 'key' | 'value';
    /**
     * The path item input.
     */
    readonly input: Record<string, unknown>;
    /**
     * The path item key.
     */
    readonly key: string;
    /**
     * The path item value.
     */
    readonly value: unknown;
}
/**
 * Set path item type.
 */
interface SetPathItem {
    /**
     * The path item type.
     */
    readonly type: 'set';
    /**
     * The path item origin.
     */
    readonly origin: 'value';
    /**
     * The path item input.
     */
    readonly input: Set<unknown>;
    /**
     * The path item key.
     */
    readonly key: null;
    /**
     * The path item key.
     */
    readonly value: unknown;
}
/**
 * Unknown path item type.
 */
interface UnknownPathItem {
    /**
     * The path item type.
     */
    readonly type: 'unknown';
    /**
     * The path item origin.
     */
    readonly origin: 'key' | 'value';
    /**
     * The path item input.
     */
    readonly input: unknown;
    /**
     * The path item key.
     */
    readonly key: unknown;
    /**
     * The path item value.
     */
    readonly value: unknown;
}
/**
 * Issue path item type.
 *
 * TODO: Document that the input of the path may be different from the input of
 * the issue.
 */
type IssuePathItem = ArrayPathItem | MapPathItem | ObjectPathItem | SetPathItem | UnknownPathItem;
/**
 * Base issue type.
 */
interface BaseIssue<TInput> extends Config<BaseIssue<TInput>> {
    /**
     * The issue kind.
     */
    readonly kind: 'schema' | 'validation' | 'transformation';
    /**
     * The issue type.
     */
    readonly type: string;
    /**
     * The raw input data.
     */
    readonly input: TInput;
    /**
     * The expected property.
     */
    readonly expected: string | null;
    /**
     * The received property.
     */
    readonly received: string;
    /**
     * The error message.
     */
    readonly message: string;
    /**
     * The input requirement.
     */
    readonly requirement?: unknown | undefined;
    /**
     * The issue path.
     *
     * TODO: Investigate if it is possible to make the path type safe based on the
     * input.
     */
    readonly path?: [IssuePathItem, ...IssuePathItem[]] | undefined;
    /**
     * The sub issues.
     */
    readonly issues?: [BaseIssue<TInput>, ...BaseIssue<TInput>[]] | undefined;
}
/**
 * Generic issue type.
 */
interface GenericIssue<TInput = unknown> extends BaseIssue<TInput> {
}
/**
 * Dot path type.
 */
type DotPath<TKey extends string | number | symbol, TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = TKey extends string | number ? `${TKey}` | `${TKey}.${IssueDotPath<TSchema>}` : never;
/**
 * Object path type.
 */
type ObjectPath<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
    [TKey in keyof TEntries]: DotPath<TKey, TEntries[TKey]>;
}[keyof TEntries];
/**
 * Tuple keys type.
 */
type TupleKeys<TItems extends TupleItems | TupleItemsAsync> = Exclude<keyof TItems, keyof []>;
/**
 * Tuple path type.
 */
type TuplePath<TItems extends TupleItems | TupleItemsAsync> = {
    [TKey in TupleKeys<TItems>]: TItems[TKey] extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>> ? DotPath<TKey, TItems[TKey]> : never;
}[TupleKeys<TItems>];
/**
 * Issue dot path type.
 */
type IssueDotPath<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = TSchema extends SchemaWithPipe<infer TPipe> | SchemaWithPipeAsync<infer TPipe> ? IssueDotPath<FirstTupleItem<TPipe>> : TSchema extends ArraySchema<infer TItem, ErrorMessage<ArrayIssue> | undefined> | ArraySchemaAsync<infer TItem, ErrorMessage<ArrayIssue> | undefined> ? DotPath<number, TItem> : TSchema extends IntersectSchema<infer TOptions, ErrorMessage<IntersectIssue> | undefined> | IntersectSchemaAsync<infer TOptions, ErrorMessage<IntersectIssue> | undefined> | UnionSchema<infer TOptions, ErrorMessage<UnionIssue<BaseIssue<unknown>>> | undefined> | UnionSchemaAsync<infer TOptions, ErrorMessage<UnionIssue<BaseIssue<unknown>>> | undefined> | VariantSchema<string, infer TOptions, ErrorMessage<VariantIssue> | undefined> | VariantSchemaAsync<string, infer TOptions, ErrorMessage<VariantIssue> | undefined> ? IssueDotPath<TOptions[number]> : TSchema extends MapSchema<infer TKey, infer TValue, ErrorMessage<MapIssue> | undefined> | MapSchemaAsync<infer TKey, infer TValue, ErrorMessage<MapIssue> | undefined> | RecordSchema<infer TKey, infer TValue, ErrorMessage<RecordIssue> | undefined> | RecordSchemaAsync<infer TKey, infer TValue, ErrorMessage<RecordIssue> | undefined> ? DotPath<InferInput<TKey>, TValue> : TSchema extends LooseObjectSchema<infer TEntries, ErrorMessage<LooseObjectIssue> | undefined> | LooseObjectSchemaAsync<infer TEntries, ErrorMessage<LooseObjectIssue> | undefined> | ObjectSchema<infer TEntries, ErrorMessage<ObjectIssue> | undefined> | ObjectSchemaAsync<infer TEntries, ErrorMessage<ObjectIssue> | undefined> | StrictObjectSchema<infer TEntries, ErrorMessage<StrictObjectIssue> | undefined> | StrictObjectSchemaAsync<infer TEntries, ErrorMessage<StrictObjectIssue> | undefined> ? ObjectPath<TEntries> : TSchema extends ObjectWithRestSchema<ObjectEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> | ObjectWithRestSchemaAsync<ObjectEntriesAsync, BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined> ? string : TSchema extends SetSchema<infer TValue, ErrorMessage<SetIssue> | undefined> | SetSchemaAsync<infer TValue, ErrorMessage<SetIssue> | undefined> ? DotPath<number, TValue> : TSchema extends LooseTupleSchema<infer TItems, ErrorMessage<LooseTupleIssue> | undefined> | LooseTupleSchemaAsync<infer TItems, ErrorMessage<LooseTupleIssue> | undefined> | StrictTupleSchema<infer TItems, ErrorMessage<StrictTupleIssue> | undefined> | StrictTupleSchemaAsync<infer TItems, ErrorMessage<StrictTupleIssue> | undefined> | TupleSchema<infer TItems, ErrorMessage<TupleIssue> | undefined> | TupleSchemaAsync<infer TItems, ErrorMessage<TupleIssue> | undefined> ? TuplePath<TItems> : TSchema extends TupleWithRestSchema<infer TItems, infer TRest, ErrorMessage<TupleWithRestIssue> | undefined> | TupleWithRestSchemaAsync<infer TItems, infer TRest, ErrorMessage<TupleWithRestIssue> | undefined> ? TuplePath<TItems> | DotPath<number, TRest> : TSchema extends LazySchema<infer TWrapped> | LazySchemaAsync<infer TWrapped> | NonNullableSchema<infer TWrapped, ErrorMessage<NonNullableIssue> | undefined> | NonNullableSchemaAsync<infer TWrapped, ErrorMessage<NonNullableIssue> | undefined> | NonNullishSchema<infer TWrapped, ErrorMessage<NonNullishIssue> | undefined> | NonNullishSchemaAsync<infer TWrapped, ErrorMessage<NonNullishIssue> | undefined> | NonOptionalSchema<infer TWrapped, ErrorMessage<NonOptionalIssue> | undefined> | NonOptionalSchemaAsync<infer TWrapped, ErrorMessage<NonOptionalIssue> | undefined> | NullableSchema<infer TWrapped, Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>, null>> | NullableSchemaAsync<infer TWrapped, DefaultAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, null>> | NullishSchema<infer TWrapped, Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>, null | undefined>> | NullishSchemaAsync<infer TWrapped, DefaultAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, null | undefined>> | OptionalSchema<infer TWrapped, Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>, undefined>> | OptionalSchemaAsync<infer TWrapped, DefaultAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, undefined>> | UndefinedableSchema<infer TWrapped, Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>, undefined>> | UndefinedableSchemaAsync<infer TWrapped, DefaultAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, undefined>> ? IssueDotPath<TWrapped> : never;

/**
 * Config type.
 */
interface Config<TIssue extends BaseIssue<unknown>> {
    /**
     * The selected language.
     */
    readonly lang?: string | undefined;
    /**
     * The error message.
     */
    readonly message?: ErrorMessage<TIssue> | undefined;
    /**
     * Whether it was abort early.
     */
    readonly abortEarly?: boolean | undefined;
    /**
     * Whether the pipe was abort early.
     */
    readonly abortPipeEarly?: boolean | undefined;
}

/**
 * Pipe action type.
 */
type PipeAction<TInput, TOutput, TIssue extends BaseIssue<unknown>> = BaseValidation<TInput, TOutput, TIssue> | BaseTransformation<TInput, TOutput, TIssue> | BaseMetadata<TInput>;
/**
 * Pipe action async type.
 */
type PipeActionAsync<TInput, TOutput, TIssue extends BaseIssue<unknown>> = BaseValidationAsync<TInput, TOutput, TIssue> | BaseTransformationAsync<TInput, TOutput, TIssue>;
/**
 * Pipe item type.
 */
type PipeItem<TInput, TOutput, TIssue extends BaseIssue<unknown>> = BaseSchema<TInput, TOutput, TIssue> | PipeAction<TInput, TOutput, TIssue>;
/**
 * Pipe item async type.
 */
type PipeItemAsync<TInput, TOutput, TIssue extends BaseIssue<unknown>> = BaseSchemaAsync<TInput, TOutput, TIssue> | PipeActionAsync<TInput, TOutput, TIssue>;
/**
 * No pipe type.
 */
type NoPipe<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> = TSchema & {
    pipe?: never;
};

/**
 * Await action async type.
 */
interface AwaitActionAsync<TInput extends Promise<unknown>> extends BaseTransformationAsync<TInput, Awaited<TInput>, never> {
    /**
     * The action type.
     */
    readonly type: 'await';
    /**
     * The action reference.
     */
    readonly reference: typeof awaitAsync;
}
/**
 * Creates an await transformation action.
 *
 * @returns An await action.
 */
declare function awaitAsync<TInput extends Promise<unknown>>(): AwaitActionAsync<TInput>;

/**
 * Base64 issue type.
 */
interface Base64Issue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'base64';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The Base64 regex.
     */
    readonly requirement: RegExp;
}
/**
 * Base64 action type.
 */
interface Base64Action<TInput extends string, TMessage extends ErrorMessage<Base64Issue<TInput>> | undefined> extends BaseValidation<TInput, TInput, Base64Issue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'base64';
    /**
     * The action reference.
     */
    readonly reference: typeof base64;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The Base64 regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a [Base64](https://en.wikipedia.org/wiki/Base64) validation action.
 *
 * @returns A Base64 action.
 */
declare function base64<TInput extends string>(): Base64Action<TInput, undefined>;
/**
 * Creates a [Base64](https://en.wikipedia.org/wiki/Base64) validation action.
 *
 * @param message The error message.
 *
 * @returns A Base64 action.
 */
declare function base64<TInput extends string, const TMessage extends ErrorMessage<Base64Issue<TInput>> | undefined>(message: TMessage): Base64Action<TInput, TMessage>;

/**
 * BIC issue type.
 */
interface BicIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'bic';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The BIC regex.
     */
    readonly requirement: RegExp;
}
/**
 * BIC action type.
 */
interface BicAction<TInput extends string, TMessage extends ErrorMessage<BicIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, BicIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'bic';
    /**
     * The action reference.
     */
    readonly reference: typeof bic;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The BIC regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a [BIC](https://en.wikipedia.org/wiki/ISO_9362) validation action.
 *
 * @returns A BIC action.
 */
declare function bic<TInput extends string>(): BicAction<TInput, undefined>;
/**
 * Creates a [BIC](https://en.wikipedia.org/wiki/ISO_9362) validation action.
 *
 * @param message The error message.
 *
 * @returns A BIC action.
 */
declare function bic<TInput extends string, const TMessage extends ErrorMessage<BicIssue<TInput>> | undefined>(message: TMessage): BicAction<TInput, TMessage>;

/**
 * Brand symbol.
 */
declare const BrandSymbol: unique symbol;
/**
 * Brand name type.
 */
type BrandName = string | number | symbol;
/**
 * Brand type.
 */
interface Brand<TName extends BrandName> {
    [BrandSymbol]: {
        [TValue in TName]: TValue;
    };
}
/**
 * Brand action type.
 */
interface BrandAction<TInput, TName extends BrandName> extends BaseTransformation<TInput, TInput & Brand<TName>, never> {
    /**
     * The action type.
     */
    readonly type: 'brand';
    /**
     * The action reference.
     */
    readonly reference: typeof brand;
    /**
     * The brand name.
     */
    readonly name: TName;
}
/**
 * Creates a brand transformation action.
 *
 * @param name The brand name.
 *
 * @returns A brand action.
 */
declare function brand<TInput, TName extends BrandName>(name: TName): BrandAction<TInput, TName>;

/**
 * Bytes issue type.
 */
interface BytesIssue<TInput extends string, TRequirement extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'bytes';
    /**
     * The expected property.
     */
    readonly expected: `${TRequirement}`;
    /**
     * The received property.
     */
    readonly received: `${number}`;
    /**
     * The required bytes.
     */
    readonly requirement: TRequirement;
}
/**
 * Bytes action type.
 */
interface BytesAction<TInput extends string, TRequirement extends number, TMessage extends ErrorMessage<BytesIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, BytesIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'bytes';
    /**
     * The action reference.
     */
    readonly reference: typeof bytes;
    /**
     * The expected property.
     */
    readonly expects: `${TRequirement}`;
    /**
     * The required bytes.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a [bytes](https://en.wikipedia.org/wiki/Byte) validation action.
 *
 * @param requirement The required bytes.
 *
 * @returns A bytes action.
 */
declare function bytes<TInput extends string, const TRequirement extends number>(requirement: TRequirement): BytesAction<TInput, TRequirement, undefined>;
/**
 * Creates a [bytes](https://en.wikipedia.org/wiki/Byte) validation action.
 *
 * @param requirement The required bytes.
 * @param message The error message.
 *
 * @returns A bytes action.
 */
declare function bytes<TInput extends string, const TRequirement extends number, const TMessage extends ErrorMessage<BytesIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): BytesAction<TInput, TRequirement, TMessage>;

/**
 * Check issue type.
 */
interface CheckIssue<TInput> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'check';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The validation function.
     */
    readonly requirement: (input: TInput) => MaybePromise<boolean>;
}

/**
 * Check action type.
 */
interface CheckAction<TInput, TMessage extends ErrorMessage<CheckIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, CheckIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'check';
    /**
     * The action reference.
     */
    readonly reference: typeof check;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The validation function.
     */
    readonly requirement: (input: TInput) => boolean;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a check validation action.
 *
 * @param requirement The validation function.
 *
 * @returns A check action.
 */
declare function check<TInput>(requirement: (input: TInput) => boolean): CheckAction<TInput, undefined>;
/**
 * Creates a check validation action.
 *
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns A check action.
 */
declare function check<TInput, const TMessage extends ErrorMessage<CheckIssue<TInput>> | undefined>(requirement: (input: TInput) => boolean, message: TMessage): CheckAction<TInput, TMessage>;

/**
 * Check action async type.
 */
interface CheckActionAsync<TInput, TMessage extends ErrorMessage<CheckIssue<TInput>> | undefined> extends BaseValidationAsync<TInput, TInput, CheckIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'check';
    /**
     * The action reference.
     */
    readonly reference: typeof checkAsync;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The validation function.
     */
    readonly requirement: (input: TInput) => MaybePromise<boolean>;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a check validation action.
 *
 * @param requirement The validation function.
 *
 * @returns A check action.
 */
declare function checkAsync<TInput>(requirement: (input: TInput) => MaybePromise<boolean>): CheckActionAsync<TInput, undefined>;
/**
 * Creates a check validation action.
 *
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns A check action.
 */
declare function checkAsync<TInput, const TMessage extends ErrorMessage<CheckIssue<TInput>> | undefined>(requirement: (input: TInput) => MaybePromise<boolean>, message: TMessage): CheckActionAsync<TInput, TMessage>;

/**
 * Array input type.
 */
type ArrayInput = MaybeReadonly<unknown[]>;
/**
 * Array requirement type.
 */
type ArrayRequirement<TInput extends ArrayInput> = (item: TInput[number], index: number, array: TInput) => boolean;
/**
 * Content input type.
 */
type ContentInput = string | MaybeReadonly<unknown[]>;
/**
 * Content requirement type.
 */
type ContentRequirement<TInput extends ContentInput> = TInput extends readonly unknown[] ? TInput[number] : TInput;
/**
 * Length input type.
 */
type LengthInput = string | ArrayLike<unknown>;
/**
 * Size input type.
 */
type SizeInput = Blob | Map<unknown, unknown> | Set<unknown>;
/**
 * Value input type.
 */
type ValueInput = string | number | bigint | boolean | Date;

/**
 * Check items issue type.
 */
interface CheckItemsIssue<TInput extends ArrayInput> extends BaseIssue<TInput[number]> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'check_items';
    /**
     * The expected input.
     */
    readonly expected: null;
    /**
     * The validation function.
     */
    readonly requirement: ArrayRequirement<TInput>;
}
/**
 * Check items action type.
 */
interface CheckItemsAction<TInput extends ArrayInput, TMessage extends ErrorMessage<CheckItemsIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, CheckItemsIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'check_items';
    /**
     * The action reference.
     */
    readonly reference: typeof checkItems;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The validation function.
     */
    readonly requirement: ArrayRequirement<TInput>;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an check items validation action.
 *
 * @param requirement The validation function.
 *
 * @returns An check items action.
 */
declare function checkItems<TInput extends ArrayInput>(requirement: ArrayRequirement<TInput>): CheckItemsAction<TInput, undefined>;
/**
 * Creates an check items validation action.
 *
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns An check items action.
 */
declare function checkItems<TInput extends ArrayInput, const TMessage extends ErrorMessage<CheckItemsIssue<TInput>> | undefined>(requirement: ArrayRequirement<TInput>, message: TMessage): CheckItemsAction<TInput, TMessage>;

/**
 * Credit card issue type.
 */
interface CreditCardIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'credit_card';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The validation function.
     */
    readonly requirement: (input: string) => boolean;
}
/**
 * Credit card action type.
 */
interface CreditCardAction<TInput extends string, TMessage extends ErrorMessage<CreditCardIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, CreditCardIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'credit_card';
    /**
     * The action reference.
     */
    readonly reference: typeof creditCard;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The validation function.
     */
    readonly requirement: (input: string) => boolean;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a [credit card](https://en.wikipedia.org/wiki/Payment_card_number) validation action.
 *
 * @returns A Credit card action.
 */
declare function creditCard<TInput extends string>(): CreditCardAction<TInput, undefined>;
/**
 * Creates a [credit card](https://en.wikipedia.org/wiki/Payment_card_number) validation action.
 *
 * @param message The error message.
 *
 * @returns A credit card action.
 */
declare function creditCard<TInput extends string, const TMessage extends ErrorMessage<CreditCardIssue<TInput>> | undefined>(message: TMessage): CreditCardAction<TInput, TMessage>;

/**
 * Cuid2 issue type.
 */
interface Cuid2Issue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'cuid2';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The Cuid2 regex.
     */
    readonly requirement: RegExp;
}
/**
 * Cuid2 action type.
 */
interface Cuid2Action<TInput extends string, TMessage extends ErrorMessage<Cuid2Issue<TInput>> | undefined> extends BaseValidation<TInput, TInput, Cuid2Issue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'cuid2';
    /**
     * The action reference.
     */
    readonly reference: typeof cuid2;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The Cuid2 regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a [Cuid2](https://github.com/paralleldrive/cuid2) validation action.
 *
 * @returns A Cuid2 action.
 */
declare function cuid2<TInput extends string>(): Cuid2Action<TInput, undefined>;
/**
 * Creates a [Cuid2](https://github.com/paralleldrive/cuid2) validation action.
 *
 * @param message The error message.
 *
 * @returns A Cuid2 action.
 */
declare function cuid2<TInput extends string, const TMessage extends ErrorMessage<Cuid2Issue<TInput>> | undefined>(message: TMessage): Cuid2Action<TInput, TMessage>;

/**
 * Decimal issue type.
 */
interface DecimalIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'decimal';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The decimal regex.
     */
    readonly requirement: RegExp;
}
/**
 * Decimal action type.
 */
interface DecimalAction<TInput extends string, TMessage extends ErrorMessage<DecimalIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, DecimalIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'decimal';
    /**
     * The action reference.
     */
    readonly reference: typeof decimal;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The decimal regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a [decimal](https://en.wikipedia.org/wiki/Decimal) validation action.
 *
 * @returns An decimal action.
 */
declare function decimal<TInput extends string>(): DecimalAction<TInput, undefined>;
/**
 * Creates a [decimal](https://en.wikipedia.org/wiki/Decimal) validation action.
 *
 * @param message The error message.
 *
 * @returns An decimal action.
 */
declare function decimal<TInput extends string, const TMessage extends ErrorMessage<DecimalIssue<TInput>> | undefined>(message: TMessage): DecimalAction<TInput, TMessage>;

/**
 * Description action type.
 */
interface DescriptionAction<TInput, TDescription extends string> extends BaseMetadata<TInput> {
    /**
     * The action type.
     */
    readonly type: 'description';
    /**
     * The action reference.
     */
    readonly reference: typeof description;
    /**
     * The description text.
     */
    readonly description: TDescription;
}
/**
 * Creates a description metadata action.
 *
 * @param description_ The description text.
 *
 * @returns A description action.
 */
declare function description<TInput, TDescription extends string>(description_: TDescription): DescriptionAction<TInput, TDescription>;

/**
 * Email issue type.
 */
interface EmailIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'email';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The email regex.
     */
    readonly requirement: RegExp;
}
/**
 * Email action type.
 */
interface EmailAction<TInput extends string, TMessage extends ErrorMessage<EmailIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, EmailIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'email';
    /**
     * The action reference.
     */
    readonly reference: typeof email;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The email regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [email](https://en.wikipedia.org/wiki/Email_address) validation
 * action.
 *
 * Hint: This validation action intentionally only validates common email
 * addresses. If you are interested in an action that covers the entire
 * specification, please see issue [#204](https://github.com/fabian-hiller/valibot/issues/204).
 *
 * @returns An email action.
 */
declare function email<TInput extends string>(): EmailAction<TInput, undefined>;
/**
 * Creates an [email](https://en.wikipedia.org/wiki/Email_address) validation
 * action.
 *
 * Hint: This validation action intentionally only validates common email
 * addresses. If you are interested in an action that covers the entire
 * specification, please see issue [#204](https://github.com/fabian-hiller/valibot/issues/204).
 *
 * @param message The error message.
 *
 * @returns An email action.
 */
declare function email<TInput extends string, const TMessage extends ErrorMessage<EmailIssue<TInput>> | undefined>(message: TMessage): EmailAction<TInput, TMessage>;

/**
 * Emoji issue type.
 */
interface EmojiIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'emoji';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The emoji regex.
     */
    readonly requirement: RegExp;
}
/**
 * Emoji action type.
 */
interface EmojiAction<TInput extends string, TMessage extends ErrorMessage<EmojiIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, EmojiIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'emoji';
    /**
     * The action reference.
     */
    readonly reference: typeof emoji;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The emoji regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [emoji](https://en.wikipedia.org/wiki/Emoji) validation action.
 *
 * @returns An emoji action.
 */
declare function emoji<TInput extends string>(): EmojiAction<TInput, undefined>;
/**
 * Creates an [emoji](https://en.wikipedia.org/wiki/Emoji) validation action.
 *
 * @param message The error message.
 *
 * @returns An emoji action.
 */
declare function emoji<TInput extends string, const TMessage extends ErrorMessage<EmojiIssue<TInput>> | undefined>(message: TMessage): EmojiAction<TInput, TMessage>;

/**
 * Empty issue type.
 */
interface EmptyIssue<TInput extends LengthInput> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'empty';
    /**
     * The expected input.
     */
    readonly expected: '0';
    /**
     * The received input.
     */
    readonly received: `${number}`;
}
/**
 * Empty action type.
 */
interface EmptyAction<TInput extends LengthInput, TMessage extends ErrorMessage<EmptyIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, EmptyIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'empty';
    /**
     * The action reference.
     */
    readonly reference: typeof empty;
    /**
     * The expected property.
     */
    readonly expects: '0';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an empty validation action.
 *
 * @returns An empty action.
 */
declare function empty<TInput extends LengthInput>(): EmptyAction<TInput, undefined>;
/**
 * Creates an empty validation action.
 *
 * @param message The error message.
 *
 * @returns An empty action.
 */
declare function empty<TInput extends LengthInput, const TMessage extends ErrorMessage<EmptyIssue<TInput>> | undefined>(message: TMessage): EmptyAction<TInput, TMessage>;

/**
 * Ends with issue type.
 */
interface EndsWithIssue<TInput extends string, TRequirement extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'ends_with';
    /**
     * The expected property.
     */
    readonly expected: `"${TRequirement}"`;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The end string.
     */
    readonly requirement: TRequirement;
}
/**
 * Ends with action type.
 */
interface EndsWithAction<TInput extends string, TRequirement extends string, TMessage extends ErrorMessage<EndsWithIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, EndsWithIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'ends_with';
    /**
     * The action reference.
     */
    readonly reference: typeof endsWith;
    /**
     * The expected property.
     */
    readonly expects: `"${TRequirement}"`;
    /**
     * The end string.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an ends with validation action.
 *
 * @param requirement The end string.
 *
 * @returns An ends with action.
 */
declare function endsWith<TInput extends string, const TRequirement extends string>(requirement: TRequirement): EndsWithAction<TInput, TRequirement, undefined>;
/**
 * Creates an ends with validation action.
 *
 * @param requirement The end string.
 * @param message The error message.
 *
 * @returns An ends with action.
 */
declare function endsWith<TInput extends string, const TRequirement extends string, const TMessage extends ErrorMessage<EndsWithIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): EndsWithAction<TInput, TRequirement, TMessage>;

/**
 * Every item issue type.
 */
interface EveryItemIssue<TInput extends ArrayInput> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'every_item';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The validation function.
     */
    readonly requirement: ArrayRequirement<TInput>;
}
/**
 * Every item action type.
 */
interface EveryItemAction<TInput extends ArrayInput, TMessage extends ErrorMessage<EveryItemIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, EveryItemIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'every_item';
    /**
     * The action reference.
     */
    readonly reference: typeof everyItem;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The validation function.
     */
    readonly requirement: ArrayRequirement<TInput>;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an every item validation action.
 *
 * @param requirement The validation function.
 *
 * @returns An every item action.
 */
declare function everyItem<TInput extends ArrayInput>(requirement: ArrayRequirement<TInput>): EveryItemAction<TInput, undefined>;
/**
 * Creates an every item validation action.
 *
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns An every item action.
 */
declare function everyItem<TInput extends ArrayInput, const TMessage extends ErrorMessage<EveryItemIssue<TInput>> | undefined>(requirement: ArrayRequirement<TInput>, message: TMessage): EveryItemAction<TInput, TMessage>;

/**
 * Excludes issue type.
 */
interface ExcludesIssue<TInput extends ContentInput, TRequirement extends ContentRequirement<TInput>> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'excludes';
    /**
     * The expected property.
     */
    readonly expected: string;
    /**
     * The content to be excluded.
     */
    readonly requirement: TRequirement;
}
/**
 * Excludes action type.
 */
interface ExcludesAction<TInput extends ContentInput, TRequirement extends ContentRequirement<TInput>, TMessage extends ErrorMessage<ExcludesIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, ExcludesIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'excludes';
    /**
     * The action reference.
     */
    readonly reference: typeof excludes;
    /**
     * The expected property.
     */
    readonly expects: string;
    /**
     * The content to be excluded.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an excludes validation action.
 *
 * @param requirement The content to be excluded.
 *
 * @returns An excludes action.
 */
declare function excludes<TInput extends ContentInput, const TRequirement extends ContentRequirement<TInput>>(requirement: TRequirement): ExcludesAction<TInput, TRequirement, undefined>;
/**
 * Creates an excludes validation action.
 *
 * @param requirement The content to be excluded.
 * @param message The error message.
 *
 * @returns An excludes action.
 */
declare function excludes<TInput extends ContentInput, const TRequirement extends ContentRequirement<TInput>, const TMessage extends ErrorMessage<ExcludesIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): ExcludesAction<TInput, TRequirement, TMessage>;

/**
 * Filter items action type.
 */
interface FilterItemsAction<TInput extends ArrayInput> extends BaseTransformation<TInput, TInput, never> {
    /**
     * The action type.
     */
    readonly type: 'filter_items';
    /**
     * The action reference.
     */
    readonly reference: typeof filterItems;
    /**
     * The filter items operation.
     */
    readonly operation: ArrayRequirement<TInput>;
}
/**
 * Creates a filter items transformation action.
 *
 * @param operation The filter items operation.
 *
 * @returns A filter items action.
 */
declare function filterItems<TInput extends ArrayInput>(operation: ArrayRequirement<TInput>): FilterItemsAction<TInput>;

/**
 * Find item action type.
 */
interface FindItemAction<TInput extends ArrayInput> extends BaseTransformation<TInput, TInput[number] | undefined, never> {
    /**
     * The action type.
     */
    readonly type: 'find_item';
    /**
     * The action reference.
     */
    readonly reference: typeof findItem;
    /**
     * The find item operation.
     */
    readonly operation: ArrayRequirement<TInput>;
}
/**
 * Creates a find item transformation action.
 *
 * @param operation The find item operation.
 *
 * @returns A find item action.
 */
declare function findItem<TInput extends ArrayInput>(operation: ArrayRequirement<TInput>): FindItemAction<TInput>;

/**
 * Finite issue type.
 */
interface FiniteIssue<TInput extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'finite';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `${number}`;
    /**
     * The validation function.
     */
    readonly requirement: (input: number) => boolean;
}
/**
 * Finite action type.
 */
interface FiniteAction<TInput extends number, TMessage extends ErrorMessage<FiniteIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, FiniteIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'finite';
    /**
     * The action reference.
     */
    readonly reference: typeof finite;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The validation function.
     */
    readonly requirement: (input: number) => boolean;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a [finite](https://en.wikipedia.org/wiki/Finite) validation action.
 *
 * @returns A finite action.
 */
declare function finite<TInput extends number>(): FiniteAction<TInput, undefined>;
/**
 * Creates a [finite](https://en.wikipedia.org/wiki/Finite) validation action.
 *
 * @param message The error message.
 *
 * @returns A finite action.
 */
declare function finite<TInput extends number, const TMessage extends ErrorMessage<FiniteIssue<TInput>> | undefined>(message: TMessage): FiniteAction<TInput, TMessage>;

/**
 * Hash lengths object.
 */
declare const HASH_LENGTHS: {
    readonly md4: 32;
    readonly md5: 32;
    readonly sha1: 40;
    readonly sha256: 64;
    readonly sha384: 96;
    readonly sha512: 128;
    readonly ripemd128: 32;
    readonly ripemd160: 40;
    readonly tiger128: 32;
    readonly tiger160: 40;
    readonly tiger192: 48;
    readonly crc32: 8;
    readonly crc32b: 8;
    readonly adler32: 8;
};
/**
 * Hash type type.
 */
type HashType = keyof typeof HASH_LENGTHS;
/**
 * Hash issue type.
 */
interface HashIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'hash';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The hash regex.
     */
    readonly requirement: RegExp;
}
/**
 * Hash action type.
 */
interface HashAction<TInput extends string, TMessage extends ErrorMessage<HashIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, HashIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'hash';
    /**
     * The action reference.
     */
    readonly reference: typeof hash;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The hash regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a [hash](https://en.wikipedia.org/wiki/Hash_function) validation action.
 *
 * @param types The hash types.
 *
 * @returns A hash action.
 */
declare function hash<TInput extends string>(types: [HashType, ...HashType[]]): HashAction<TInput, undefined>;
/**
 * Creates a [hash](https://en.wikipedia.org/wiki/Hash_function) validation action.
 *
 * @param types The hash types.
 * @param message The error message.
 *
 * @returns A hash action.
 */
declare function hash<TInput extends string, const TMessage extends ErrorMessage<HashIssue<TInput>> | undefined>(types: [HashType, ...HashType[]], message: TMessage): HashAction<TInput, TMessage>;

/**
 * Hexadecimal issue type.
 */
interface HexadecimalIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'hexadecimal';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The hexadecimal regex.
     */
    readonly requirement: RegExp;
}
/**
 * Hexadecimal action type.
 */
interface HexadecimalAction<TInput extends string, TMessage extends ErrorMessage<HexadecimalIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, HexadecimalIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'hexadecimal';
    /**
     * The action reference.
     */
    readonly reference: typeof hexadecimal;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The hexadecimal regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) validation action.
 *
 * @returns A hexadecimal action.
 */
declare function hexadecimal<TInput extends string>(): HexadecimalAction<TInput, undefined>;
/**
 * Creates a [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) validation action.
 *
 * @param message The error message.
 *
 * @returns A hexadecimal action.
 */
declare function hexadecimal<TInput extends string, const TMessage extends ErrorMessage<HexadecimalIssue<TInput>> | undefined>(message: TMessage): HexadecimalAction<TInput, TMessage>;

/**
 * Hex color issue type.
 */
interface HexColorIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'hex_color';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The hex color regex.
     */
    readonly requirement: RegExp;
}
/**
 * Hex color action type.
 */
interface HexColorAction<TInput extends string, TMessage extends ErrorMessage<HexColorIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, HexColorIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'hex_color';
    /**
     * The action reference.
     */
    readonly reference: typeof hexColor;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The hex color regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a [hex color](https://en.wikipedia.org/wiki/Web_colors#Hex_triplet) validation action.
 *
 * @returns A hex color action.
 */
declare function hexColor<TInput extends string>(): HexColorAction<TInput, undefined>;
/**
 * Creates a [hex color](https://en.wikipedia.org/wiki/Web_colors#Hex_triplet) validation action.
 *
 * @param message The error message.
 *
 * @returns A hex color action.
 */
declare function hexColor<TInput extends string, const TMessage extends ErrorMessage<HexColorIssue<TInput>> | undefined>(message: TMessage): HexColorAction<TInput, TMessage>;

/**
 * IMEI issue type.
 */
interface ImeiIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'imei';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The validation function.
     */
    readonly requirement: (input: string) => boolean;
}
/**
 * IMEI action type.
 */
interface ImeiAction<TInput extends string, TMessage extends ErrorMessage<ImeiIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, ImeiIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'imei';
    /**
     * The action reference.
     */
    readonly reference: typeof imei;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The validation function.
     */
    readonly requirement: (input: string) => boolean;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [IMEI](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity) validation action.
 *
 * Formats:
 * - AABBBBBBCCCCCCD
 * - AA-BBBBBB-CCCCCC-D
 *
 * @returns An IMEI action.
 */
declare function imei<TInput extends string>(): ImeiAction<TInput, undefined>;
/**
 * Creates an [IMEI](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity) validation action.
 *
 * Formats:
 * - AABBBBBBCCCCCCD
 * - AA-BBBBBB-CCCCCC-D
 *
 * @param message The error message.
 *
 * @returns An IMEI action.
 */
declare function imei<TInput extends string, const TMessage extends ErrorMessage<ImeiIssue<TInput>> | undefined>(message: TMessage): ImeiAction<TInput, TMessage>;

/**
 * Includes issue type.
 */
interface IncludesIssue<TInput extends ContentInput, TRequirement extends ContentRequirement<TInput>> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'includes';
    /**
     * The expected property.
     */
    readonly expected: string;
    /**
     * The content to be included.
     */
    readonly requirement: TRequirement;
}
/**
 * Includes action type.
 */
interface IncludesAction<TInput extends ContentInput, TRequirement extends ContentRequirement<TInput>, TMessage extends ErrorMessage<IncludesIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, IncludesIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'includes';
    /**
     * The action reference.
     */
    readonly reference: typeof includes;
    /**
     * The expected property.
     */
    readonly expects: string;
    /**
     * The content to be included.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an includes validation action.
 *
 * @param requirement The content to be included.
 *
 * @returns An includes action.
 */
declare function includes<TInput extends ContentInput, const TRequirement extends ContentRequirement<TInput>>(requirement: TRequirement): IncludesAction<TInput, TRequirement, undefined>;
/**
 * Creates an includes validation action.
 *
 * @param requirement The content to be included.
 * @param message The error message.
 *
 * @returns An includes action.
 */
declare function includes<TInput extends ContentInput, const TRequirement extends ContentRequirement<TInput>, const TMessage extends ErrorMessage<IncludesIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): IncludesAction<TInput, TRequirement, TMessage>;

/**
 * Integer issue type.
 */
interface IntegerIssue<TInput extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'integer';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `${number}`;
    /**
     * The validation function.
     */
    readonly requirement: (input: number) => boolean;
}
/**
 * Integer action type.
 */
interface IntegerAction<TInput extends number, TMessage extends ErrorMessage<IntegerIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, IntegerIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'integer';
    /**
     * The action reference.
     */
    readonly reference: typeof integer;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The validation function.
     */
    readonly requirement: (input: number) => boolean;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [integer](https://en.wikipedia.org/wiki/Integer) validation action.
 *
 * @returns An integer action.
 */
declare function integer<TInput extends number>(): IntegerAction<TInput, undefined>;
/**
 * Creates an [integer](https://en.wikipedia.org/wiki/Integer) validation action.
 *
 * @param message The error message.
 *
 * @returns An integer action.
 */
declare function integer<TInput extends number, const TMessage extends ErrorMessage<IntegerIssue<TInput>> | undefined>(message: TMessage): IntegerAction<TInput, TMessage>;

/**
 * IP issue type.
 */
interface IpIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'ip';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The IP regex.
     */
    readonly requirement: RegExp;
}
/**
 * IP action type.
 */
interface IpAction<TInput extends string, TMessage extends ErrorMessage<IpIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, IpIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'ip';
    /**
     * The action reference.
     */
    readonly reference: typeof ip;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The IP regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [IP address](https://en.wikipedia.org/wiki/IP_address) validation action.
 *
 * @returns An IP action.
 */
declare function ip<TInput extends string>(): IpAction<TInput, undefined>;
/**
 * Creates an [IP address](https://en.wikipedia.org/wiki/IP_address) validation action.
 *
 * @param message The error message.
 *
 * @returns An IP action.
 */
declare function ip<TInput extends string, const TMessage extends ErrorMessage<IpIssue<TInput>> | undefined>(message: TMessage): IpAction<TInput, TMessage>;

/**
 * IPv4 issue type.
 */
interface Ipv4Issue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'ipv4';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The IPv4 regex.
     */
    readonly requirement: RegExp;
}
/**
 * IPv4 action type.
 */
interface Ipv4Action<TInput extends string, TMessage extends ErrorMessage<Ipv4Issue<TInput>> | undefined> extends BaseValidation<TInput, TInput, Ipv4Issue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'ipv4';
    /**
     * The action reference.
     */
    readonly reference: typeof ipv4;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The IPv4 regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [IPv4](https://en.wikipedia.org/wiki/IPv4) address validation action.
 *
 * @returns An IPv4 action.
 */
declare function ipv4<TInput extends string>(): Ipv4Action<TInput, undefined>;
/**
 * Creates an [IPv4](https://en.wikipedia.org/wiki/IPv4) address validation action.
 *
 * @param message The error message.
 *
 * @returns An IPv4 action.
 */
declare function ipv4<TInput extends string, const TMessage extends ErrorMessage<Ipv4Issue<TInput>> | undefined>(message: TMessage): Ipv4Action<TInput, TMessage>;

/**
 * IPv6 issue type.
 */
interface Ipv6Issue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'ipv6';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The IPv6 regex.
     */
    readonly requirement: RegExp;
}
/**
 * IPv6 action type.
 */
interface Ipv6Action<TInput extends string, TMessage extends ErrorMessage<Ipv6Issue<TInput>> | undefined> extends BaseValidation<TInput, TInput, Ipv6Issue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'ipv6';
    /**
     * The action reference.
     */
    readonly reference: typeof ipv6;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The IPv6 regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [IPv6](https://en.wikipedia.org/wiki/IPv6) address validation action.
 *
 * @returns An IPv6 action.
 */
declare function ipv6<TInput extends string>(): Ipv6Action<TInput, undefined>;
/**
 * Creates an [IPv6](https://en.wikipedia.org/wiki/IPv6) address validation action.
 *
 * @param message The error message.
 *
 * @returns An IPv6 action.
 */
declare function ipv6<TInput extends string, const TMessage extends ErrorMessage<Ipv6Issue<TInput>> | undefined>(message: TMessage): Ipv6Action<TInput, TMessage>;

/**
 * ISO date issue type.
 */
interface IsoDateIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'iso_date';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The ISO date regex.
     */
    readonly requirement: RegExp;
}
/**
 * ISO date action type.
 */
interface IsoDateAction<TInput extends string, TMessage extends ErrorMessage<IsoDateIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, IsoDateIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'iso_date';
    /**
     * The action reference.
     */
    readonly reference: typeof isoDate;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The ISO date regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [ISO date](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: yyyy-mm-dd
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31" is valid although June has only
 * 30 days.
 *
 * @returns An ISO date action.
 */
declare function isoDate<TInput extends string>(): IsoDateAction<TInput, undefined>;
/**
 * Creates an [ISO date](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: yyyy-mm-dd
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31" is valid although June has only
 * 30 days.
 *
 * @param message The error message.
 *
 * @returns An ISO date action.
 */
declare function isoDate<TInput extends string, const TMessage extends ErrorMessage<IsoDateIssue<TInput>> | undefined>(message: TMessage): IsoDateAction<TInput, TMessage>;

/**
 * ISO date time issue type.
 */
interface IsoDateTimeIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'iso_date_time';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The ISO date time regex.
     */
    readonly requirement: RegExp;
}
/**
 * ISO date time action type.
 */
interface IsoDateTimeAction<TInput extends string, TMessage extends ErrorMessage<IsoDateTimeIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, IsoDateTimeIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'iso_date_time';
    /**
     * The action reference.
     */
    readonly reference: typeof isoDateTime;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The ISO date time regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [ISO date time](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: yyyy-mm-ddThh:mm
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31T00:00" is valid although June has only
 * 30 days.
 *
 * @returns An ISO date time action.
 */
declare function isoDateTime<TInput extends string>(): IsoDateTimeAction<TInput, undefined>;
/**
 * Creates an [ISO date time](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: yyyy-mm-ddThh:mm
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31T00:00" is valid although June has only
 * 30 days.
 *
 * @param message The error message.
 *
 * @returns An ISO date time action.
 */
declare function isoDateTime<TInput extends string, const TMessage extends ErrorMessage<IsoDateTimeIssue<TInput>> | undefined>(message: TMessage): IsoDateTimeAction<TInput, TMessage>;

/**
 * ISO time issue type.
 */
interface IsoTimeIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'iso_time';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The ISO time regex.
     */
    readonly requirement: RegExp;
}
/**
 * ISO time action type.
 */
interface IsoTimeAction<TInput extends string, TMessage extends ErrorMessage<IsoTimeIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, IsoTimeIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'iso_time';
    /**
     * The action reference.
     */
    readonly reference: typeof isoTime;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The ISO time regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [ISO time](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: hh:mm
 *
 * @returns An ISO time action.
 */
declare function isoTime<TInput extends string>(): IsoTimeAction<TInput, undefined>;
/**
 * Creates an [ISO time](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: hh:mm
 *
 * @param message The error message.
 *
 * @returns An ISO time action.
 */
declare function isoTime<TInput extends string, const TMessage extends ErrorMessage<IsoTimeIssue<TInput>> | undefined>(message: TMessage): IsoTimeAction<TInput, TMessage>;

/**
 * ISO time second issue type.
 */
interface IsoTimeSecondIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'iso_time_second';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The ISO time with seconds regex.
     */
    readonly requirement: RegExp;
}
/**
 * ISO time second action type.
 */
interface IsoTimeSecondAction<TInput extends string, TMessage extends ErrorMessage<IsoTimeSecondIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, IsoTimeSecondIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'iso_time_second';
    /**
     * The action reference.
     */
    readonly reference: typeof isoTimeSecond;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The ISO time second regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [ISO time second](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: hh:mm:ss
 *
 * @returns An ISO time second action.
 */
declare function isoTimeSecond<TInput extends string>(): IsoTimeSecondAction<TInput, undefined>;
/**
 * Creates an [ISO time second](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: hh:mm:ss
 *
 * @param message The error message.
 *
 * @returns An ISO time second action.
 */
declare function isoTimeSecond<TInput extends string, const TMessage extends ErrorMessage<IsoTimeSecondIssue<TInput>> | undefined>(message: TMessage): IsoTimeSecondAction<TInput, TMessage>;

/**
 * ISO timestamp issue type.
 */
interface IsoTimestampIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'iso_timestamp';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The ISO timestamp regex.
     */
    readonly requirement: RegExp;
}
/**
 * ISO timestamp action type.
 */
interface IsoTimestampAction<TInput extends string, TMessage extends ErrorMessage<IsoTimestampIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, IsoTimestampIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'iso_timestamp';
    /**
     * The action reference.
     */
    readonly reference: typeof isoTimestamp;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The ISO timestamp regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [ISO timestamp](https://en.wikipedia.org/wiki/ISO_8601) validation
 * action.
 *
 * Formats:
 * - yyyy-mm-ddThh:mm:ss.sssZ
 * - yyyy-mm-ddThh:mm:ss.sss±hh:mm
 * - yyyy-mm-ddThh:mm:ss.sss±hhmm
 *
 * Hint: To support timestamps with lower or higher accuracy, the millisecond
 * specification can be removed or contain up to 9 digits.
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31T00:00:00.000Z" is valid although
 * June has only 30 days.
 *
 * @returns An ISO timestamp action.
 */
declare function isoTimestamp<TInput extends string>(): IsoTimestampAction<TInput, undefined>;
/**
 * Creates an [ISO timestamp](https://en.wikipedia.org/wiki/ISO_8601) validation
 * action.
 *
 * Formats:
 * - yyyy-mm-ddThh:mm:ss.sssZ
 * - yyyy-mm-ddThh:mm:ss.sss±hh:mm
 * - yyyy-mm-ddThh:mm:ss.sss±hhmm
 * - yyyy-mm-ddThh:mm:ss.sss±hh
 *
 * Hint: To support timestamps with lower or higher accuracy, the millisecond
 * specification can be removed or contain up to 9 digits.
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31T00:00:00.000Z" is valid although
 * June has only 30 days.
 *
 * @param message The error message.
 *
 * @returns An ISO timestamp action.
 */
declare function isoTimestamp<TInput extends string, const TMessage extends ErrorMessage<IsoTimestampIssue<TInput>> | undefined>(message: TMessage): IsoTimestampAction<TInput, TMessage>;

/**
 * ISO week issue type.
 */
interface IsoWeekIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'iso_week';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The ISO week regex.
     */
    readonly requirement: RegExp;
}
/**
 * ISO week action type.
 */
interface IsoWeekAction<TInput extends string, TMessage extends ErrorMessage<IsoWeekIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, IsoWeekIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'iso_week';
    /**
     * The action reference.
     */
    readonly reference: typeof isoWeek;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The ISO week regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [ISO week](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: yyyy-Www
 *
 * Hint: The regex used cannot validate the maximum number of weeks based on
 * the year. For example, "2021W53" is valid although 2021 has only 52 weeks.
 *
 * @returns An ISO week action.
 */
declare function isoWeek<TInput extends string>(): IsoWeekAction<TInput, undefined>;
/**
 * Creates an [ISO week](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: yyyy-Www
 *
 * Hint: The regex used cannot validate the maximum number of weeks based on
 * the year. For example, "2021W53" is valid although 2021 has only 52 weeks.
 *
 * @param message The error message.
 *
 * @returns An ISO week action.
 */
declare function isoWeek<TInput extends string, const TMessage extends ErrorMessage<IsoWeekIssue<TInput>> | undefined>(message: TMessage): IsoWeekAction<TInput, TMessage>;

/**
 * Length issue type.
 */
interface LengthIssue<TInput extends LengthInput, TRequirement extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'length';
    /**
     * The expected property.
     */
    readonly expected: `${TRequirement}`;
    /**
     * The received property.
     */
    readonly received: `${number}`;
    /**
     * The required length.
     */
    readonly requirement: TRequirement;
}
/**
 * Length action type.
 */
interface LengthAction<TInput extends LengthInput, TRequirement extends number, TMessage extends ErrorMessage<LengthIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, LengthIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'length';
    /**
     * The action reference.
     */
    readonly reference: typeof length;
    /**
     * The expected property.
     */
    readonly expects: `${TRequirement}`;
    /**
     * The required length.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a length validation action.
 *
 * @param requirement The required length.
 *
 * @returns A length action.
 */
declare function length<TInput extends LengthInput, const TRequirement extends number>(requirement: TRequirement): LengthAction<TInput, TRequirement, undefined>;
/**
 * Creates a length validation action.
 *
 * @param requirement The required length.
 * @param message The error message.
 *
 * @returns A length action.
 */
declare function length<TInput extends LengthInput, const TRequirement extends number, const TMessage extends ErrorMessage<LengthIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): LengthAction<TInput, TRequirement, TMessage>;

/**
 * MAC issue type.
 */
interface MacIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'mac';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The MAC regex.
     */
    readonly requirement: RegExp;
}
/**
 * MAC action type.
 */
interface MacAction<TInput extends string, TMessage extends ErrorMessage<MacIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, MacIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'mac';
    /**
     * The action reference.
     */
    readonly reference: typeof mac;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The MAC regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a [MAC address](https://en.wikipedia.org/wiki/MAC_address) validation action.
 *
 * @returns A MAC action.
 */
declare function mac<TInput extends string>(): MacAction<TInput, undefined>;
/**
 * Creates a [MAC address](https://en.wikipedia.org/wiki/MAC_address) validation action.
 *
 * @param message The error message.
 *
 * @returns A MAC action.
 */
declare function mac<TInput extends string, const TMessage extends ErrorMessage<MacIssue<TInput>> | undefined>(message: TMessage): MacAction<TInput, TMessage>;

/**
 * 48-bit MAC issue type.
 */
interface Mac48Issue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'mac48';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The 48-bit MAC regex.
     */
    readonly requirement: RegExp;
}
/**
 * 48-bit MAC action type.
 */
interface Mac48Action<TInput extends string, TMessage extends ErrorMessage<Mac48Issue<TInput>> | undefined> extends BaseValidation<TInput, TInput, Mac48Issue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'mac48';
    /**
     * The action reference.
     */
    readonly reference: typeof mac48;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The 48-bit MAC regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a 48-bit [MAC address](https://en.wikipedia.org/wiki/MAC_address) validation action.
 *
 * @returns A 48-bit MAC action.
 */
declare function mac48<TInput extends string>(): Mac48Action<TInput, undefined>;
/**
 * Creates a 48-bit [MAC address](https://en.wikipedia.org/wiki/MAC_address) validation action.
 *
 * @param message The error message.
 *
 * @returns A 48-bit MAC action.
 */
declare function mac48<TInput extends string, const TMessage extends ErrorMessage<Mac48Issue<TInput>> | undefined>(message: TMessage): Mac48Action<TInput, TMessage>;

/**
 * 64-bit MAC issue type.
 */
interface Mac64Issue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'mac64';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The 64-bit MAC regex.
     */
    readonly requirement: RegExp;
}
/**
 * 64-bit MAC action type.
 */
interface Mac64Action<TInput extends string, TMessage extends ErrorMessage<Mac64Issue<TInput>> | undefined> extends BaseValidation<TInput, TInput, Mac64Issue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'mac64';
    /**
     * The action reference.
     */
    readonly reference: typeof mac64;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The 64-bit MAC regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a 64-bit [MAC address](https://en.wikipedia.org/wiki/MAC_address) validation action.
 *
 * @returns A 64-bit MAC action.
 */
declare function mac64<TInput extends string>(): Mac64Action<TInput, undefined>;
/**
 * Creates a 64-bit [MAC address](https://en.wikipedia.org/wiki/MAC_address) validation action.
 *
 * @param message The error message.
 *
 * @returns A 64-bit MAC action.
 */
declare function mac64<TInput extends string, const TMessage extends ErrorMessage<Mac64Issue<TInput>> | undefined>(message: TMessage): Mac64Action<TInput, TMessage>;

/**
 * Array action type.
 */
type ArrayAction$2<TInput extends ArrayInput, TOutput> = (item: TInput[number], index: number, array: TInput) => TOutput;
/**
 * Map items action type.
 */
interface MapItemsAction<TInput extends ArrayInput, TOutput> extends BaseTransformation<TInput, TOutput[], never> {
    /**
     * The action type.
     */
    readonly type: 'map_items';
    /**
     * The action reference.
     */
    readonly reference: typeof mapItems;
    /**
     * The map items operation.
     */
    readonly operation: ArrayAction$2<TInput, TOutput>;
}
/**
 * Creates a map items transformation action.
 *
 * @param operation The map items operation.
 *
 * @returns A map items action.
 */
declare function mapItems<TInput extends ArrayInput, TOutput>(operation: ArrayAction$2<TInput, TOutput>): MapItemsAction<TInput, TOutput>;

/**
 * Max bytes issue type.
 */
interface MaxBytesIssue<TInput extends string, TRequirement extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'max_bytes';
    /**
     * The expected property.
     */
    readonly expected: `<=${TRequirement}`;
    /**
     * The received property.
     */
    readonly received: `${number}`;
    /**
     * The maximum bytes.
     */
    readonly requirement: TRequirement;
}
/**
 * Max bytes action type.
 */
interface MaxBytesAction<TInput extends string, TRequirement extends number, TMessage extends ErrorMessage<MaxBytesIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, MaxBytesIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'max_bytes';
    /**
     * The action reference.
     */
    readonly reference: typeof maxBytes;
    /**
     * The expected property.
     */
    readonly expects: `<=${TRequirement}`;
    /**
     * The maximum bytes.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a max [bytes](https://en.wikipedia.org/wiki/Byte) validation action.
 *
 * @param requirement The maximum bytes.
 *
 * @returns A max bytes action.
 */
declare function maxBytes<TInput extends string, const TRequirement extends number>(requirement: TRequirement): MaxBytesAction<TInput, TRequirement, undefined>;
/**
 * Creates a max [bytes](https://en.wikipedia.org/wiki/Byte) validation action.
 *
 * @param requirement The maximum bytes.
 * @param message The error message.
 *
 * @returns A max bytes action.
 */
declare function maxBytes<TInput extends string, const TRequirement extends number, const TMessage extends ErrorMessage<MaxBytesIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): MaxBytesAction<TInput, TRequirement, TMessage>;

/**
 * Max length issue type.
 */
interface MaxLengthIssue<TInput extends LengthInput, TRequirement extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'max_length';
    /**
     * The expected property.
     */
    readonly expected: `<=${TRequirement}`;
    /**
     * The received property.
     */
    readonly received: `${number}`;
    /**
     * The maximum length.
     */
    readonly requirement: TRequirement;
}
/**
 * Max length action type.
 */
interface MaxLengthAction<TInput extends LengthInput, TRequirement extends number, TMessage extends ErrorMessage<MaxLengthIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, MaxLengthIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'max_length';
    /**
     * The action reference.
     */
    readonly reference: typeof maxLength;
    /**
     * The expected property.
     */
    readonly expects: `<=${TRequirement}`;
    /**
     * The maximum length.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a max length validation action.
 *
 * @param requirement The maximum length.
 *
 * @returns A max length action.
 */
declare function maxLength<TInput extends LengthInput, const TRequirement extends number>(requirement: TRequirement): MaxLengthAction<TInput, TRequirement, undefined>;
/**
 * Creates a max length validation action.
 *
 * @param requirement The maximum length.
 * @param message The error message.
 *
 * @returns A max length action.
 */
declare function maxLength<TInput extends LengthInput, const TRequirement extends number, const TMessage extends ErrorMessage<MaxLengthIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): MaxLengthAction<TInput, TRequirement, TMessage>;

/**
 * Max size issue type.
 */
interface MaxSizeIssue<TInput extends SizeInput, TRequirement extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'max_size';
    /**
     * The expected property.
     */
    readonly expected: `<=${TRequirement}`;
    /**
     * The received property.
     */
    readonly received: `${number}`;
    /**
     * The maximum size.
     */
    readonly requirement: TRequirement;
}
/**
 * Max size action type.
 */
interface MaxSizeAction<TInput extends SizeInput, TRequirement extends number, TMessage extends ErrorMessage<MaxSizeIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, MaxSizeIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'max_size';
    /**
     * The action reference.
     */
    readonly reference: typeof maxSize;
    /**
     * The expected property.
     */
    readonly expects: `<=${TRequirement}`;
    /**
     * The maximum size.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a max size validation action.
 *
 * @param requirement The maximum size.
 *
 * @returns A max size action.
 */
declare function maxSize<TInput extends SizeInput, const TRequirement extends number>(requirement: TRequirement): MaxSizeAction<TInput, TRequirement, undefined>;
/**
 * Creates a max size validation action.
 *
 * @param requirement The maximum size.
 * @param message The error message.
 *
 * @returns A max size action.
 */
declare function maxSize<TInput extends SizeInput, const TRequirement extends number, const TMessage extends ErrorMessage<MaxSizeIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): MaxSizeAction<TInput, TRequirement, TMessage>;

/**
 * Max value issue type.
 */
interface MaxValueIssue<TInput extends ValueInput, TRequirement extends ValueInput> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'max_value';
    /**
     * The expected property.
     */
    readonly expected: `<=${string}`;
    /**
     * The maximum value.
     */
    readonly requirement: TRequirement;
}
/**
 * Max value action type.
 */
interface MaxValueAction<TInput extends ValueInput, TRequirement extends TInput, TMessage extends ErrorMessage<MaxValueIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, MaxValueIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'max_value';
    /**
     * The action reference.
     */
    readonly reference: typeof maxValue;
    /**
     * The expected property.
     */
    readonly expects: `<=${string}`;
    /**
     * The maximum value.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a max value validation action.
 *
 * @param requirement The maximum value.
 *
 * @returns A max value action.
 */
declare function maxValue<TInput extends ValueInput, const TRequirement extends TInput>(requirement: TRequirement): MaxValueAction<TInput, TRequirement, undefined>;
/**
 * Creates a max value validation action.
 *
 * @param requirement The maximum value.
 * @param message The error message.
 *
 * @returns A max value action.
 */
declare function maxValue<TInput extends ValueInput, const TRequirement extends TInput, const TMessage extends ErrorMessage<MaxValueIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): MaxValueAction<TInput, TRequirement, TMessage>;

/**
 * Requirement type.
 */
type Requirement = readonly `${string}/${string}`[];
/**
 * MIME type issue type.
 */
interface MimeTypeIssue<TInput extends Blob, TRequirement extends Requirement> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'mime_type';
    /**
     * The expected input.
     */
    readonly expected: string;
    /**
     * The received input.
     */
    readonly received: `"${string}"`;
    /**
     * The MIME types.
     */
    readonly requirement: TRequirement;
}
/**
 * MIME type action type.
 */
interface MimeTypeAction<TInput extends Blob, TRequirement extends Requirement, TMessage extends ErrorMessage<MimeTypeIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, MimeTypeIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'mime_type';
    /**
     * The action reference.
     */
    readonly reference: typeof mimeType;
    /**
     * The expected property.
     */
    readonly expects: string;
    /**
     * The MIME types.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a [MIME type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types) validation action.
 *
 * @param requirement The MIME types.
 *
 * @returns A MIME type action.
 */
declare function mimeType<TInput extends Blob, const TRequirement extends Requirement>(requirement: TRequirement): MimeTypeAction<TInput, TRequirement, undefined>;
/**
 * Creates a [MIME type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types) validation action.
 *
 * @param requirement The MIME types.
 * @param message The error message.
 *
 * @returns A MIME type action.
 */
declare function mimeType<TInput extends Blob, const TRequirement extends Requirement, const TMessage extends ErrorMessage<MimeTypeIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): MimeTypeAction<TInput, TRequirement, TMessage>;

/**
 * Min bytes issue type.
 */
interface MinBytesIssue<TInput extends string, TRequirement extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'min_bytes';
    /**
     * The expected property.
     */
    readonly expected: `>=${TRequirement}`;
    /**
     * The received property.
     */
    readonly received: `${number}`;
    /**
     * The minimum bytes.
     */
    readonly requirement: TRequirement;
}
/**
 * Min bytes action type.
 */
interface MinBytesAction<TInput extends string, TRequirement extends number, TMessage extends ErrorMessage<MinBytesIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, MinBytesIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'min_bytes';
    /**
     * The action reference.
     */
    readonly reference: typeof minBytes;
    /**
     * The expected property.
     */
    readonly expects: `>=${TRequirement}`;
    /**
     * The minimum bytes.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a min [bytes](https://en.wikipedia.org/wiki/Byte) validation action.
 *
 * @param requirement The minimum bytes.
 *
 * @returns A min bytes action.
 */
declare function minBytes<TInput extends string, const TRequirement extends number>(requirement: TRequirement): MinBytesAction<TInput, TRequirement, undefined>;
/**
 * Creates a min [bytes](https://en.wikipedia.org/wiki/Byte) validation action.
 *
 * @param requirement The minimum bytes.
 * @param message The error message.
 *
 * @returns A min bytes action.
 */
declare function minBytes<TInput extends string, const TRequirement extends number, const TMessage extends ErrorMessage<MinBytesIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): MinBytesAction<TInput, TRequirement, TMessage>;

/**
 * Min length issue type.
 */
interface MinLengthIssue<TInput extends LengthInput, TRequirement extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'min_length';
    /**
     * The expected property.
     */
    readonly expected: `>=${TRequirement}`;
    /**
     * The received property.
     */
    readonly received: `${number}`;
    /**
     * The minimum length.
     */
    readonly requirement: TRequirement;
}
/**
 * Min length action type.
 */
interface MinLengthAction<TInput extends LengthInput, TRequirement extends number, TMessage extends ErrorMessage<MinLengthIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, MinLengthIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'min_length';
    /**
     * The action reference.
     */
    readonly reference: typeof minLength;
    /**
     * The expected property.
     */
    readonly expects: `>=${TRequirement}`;
    /**
     * The minimum length.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a min length validation action.
 *
 * @param requirement The minimum length.
 *
 * @returns A min length action.
 */
declare function minLength<TInput extends LengthInput, const TRequirement extends number>(requirement: TRequirement): MinLengthAction<TInput, TRequirement, undefined>;
/**
 * Creates a min length validation action.
 *
 * @param requirement The minimum length.
 * @param message The error message.
 *
 * @returns A min length action.
 */
declare function minLength<TInput extends LengthInput, const TRequirement extends number, const TMessage extends ErrorMessage<MinLengthIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): MinLengthAction<TInput, TRequirement, TMessage>;

/**
 * Min size issue type.
 */
interface MinSizeIssue<TInput extends SizeInput, TRequirement extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'min_size';
    /**
     * The expected property.
     */
    readonly expected: `>=${TRequirement}`;
    /**
     * The received property.
     */
    readonly received: `${number}`;
    /**
     * The minimum size.
     */
    readonly requirement: TRequirement;
}
/**
 * Min size action type.
 */
interface MinSizeAction<TInput extends SizeInput, TRequirement extends number, TMessage extends ErrorMessage<MinSizeIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, MinSizeIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'min_size';
    /**
     * The action reference.
     */
    readonly reference: typeof minSize;
    /**
     * The expected property.
     */
    readonly expects: `>=${TRequirement}`;
    /**
     * The minimum size.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a min size validation action.
 *
 * @param requirement The minimum size.
 *
 * @returns A min size action.
 */
declare function minSize<TInput extends SizeInput, const TRequirement extends number>(requirement: TRequirement): MinSizeAction<TInput, TRequirement, undefined>;
/**
 * Creates a min size validation action.
 *
 * @param requirement The minimum size.
 * @param message The error message.
 *
 * @returns A min size action.
 */
declare function minSize<TInput extends SizeInput, const TRequirement extends number, const TMessage extends ErrorMessage<MinSizeIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): MinSizeAction<TInput, TRequirement, TMessage>;

/**
 * Min value issue type.
 */
interface MinValueIssue<TInput extends ValueInput, TRequirement extends ValueInput> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'min_value';
    /**
     * The expected property.
     */
    readonly expected: `>=${string}`;
    /**
     * The minimum value.
     */
    readonly requirement: TRequirement;
}
/**
 * Min value action type.
 */
interface MinValueAction<TInput extends ValueInput, TRequirement extends TInput, TMessage extends ErrorMessage<MinValueIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, MinValueIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'min_value';
    /**
     * The action reference.
     */
    readonly reference: typeof minValue;
    /**
     * The expected property.
     */
    readonly expects: `>=${string}`;
    /**
     * The minimum value.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a min value validation action.
 *
 * @param requirement The minimum value.
 *
 * @returns A min value action.
 */
declare function minValue<TInput extends ValueInput, const TRequirement extends TInput>(requirement: TRequirement): MinValueAction<TInput, TRequirement, undefined>;
/**
 * Creates a min value validation action.
 *
 * @param requirement The minimum value.
 * @param message The error message.
 *
 * @returns A min value action.
 */
declare function minValue<TInput extends ValueInput, const TRequirement extends TInput, const TMessage extends ErrorMessage<MinValueIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): MinValueAction<TInput, TRequirement, TMessage>;

/**
 * Multiple of issue type.
 */
interface MultipleOfIssue<TInput extends number, TRequirement extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'multiple_of';
    /**
     * The expected property.
     */
    readonly expected: `%${TRequirement}`;
    /**
     * The received property.
     */
    readonly received: `${number}`;
    /**
     * The divisor.
     */
    readonly requirement: TRequirement;
}
/**
 * Multiple of action type.
 */
interface MultipleOfAction<TInput extends number, TRequirement extends number, TMessage extends ErrorMessage<MultipleOfIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, MultipleOfIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'multiple_of';
    /**
     * The action reference.
     */
    readonly reference: typeof multipleOf;
    /**
     * The expected property.
     */
    readonly expects: `%${TRequirement}`;
    /**
     * The divisor.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a [multiple](https://en.wikipedia.org/wiki/Multiple_(mathematics)) of validation action.
 *
 * @param requirement The divisor.
 *
 * @returns A multiple of action.
 */
declare function multipleOf<TInput extends number, const TRequirement extends number>(requirement: TRequirement): MultipleOfAction<TInput, TRequirement, undefined>;
/**
 * Creates a [multiple](https://en.wikipedia.org/wiki/Multiple_(mathematics)) of validation action.
 *
 * @param requirement The divisor.
 * @param message The error message.
 *
 * @returns A multiple of action.
 */
declare function multipleOf<TInput extends number, const TRequirement extends number, const TMessage extends ErrorMessage<MultipleOfIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): MultipleOfAction<TInput, TRequirement, TMessage>;

/**
 * Nano ID issue type.
 */
interface NanoIDIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'nanoid';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: string;
    /**
     * The Nano ID regex.
     */
    readonly requirement: RegExp;
}
/**
 * Nano ID action type.
 */
interface NanoIDAction<TInput extends string, TMessage extends ErrorMessage<NanoIDIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, NanoIDIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'nanoid';
    /**
     * The action reference.
     */
    readonly reference: typeof nanoid;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The Nano ID regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a [Nano ID](https://github.com/ai/nanoid) validation action.
 *
 * @returns A Nano ID action.
 */
declare function nanoid<TInput extends string>(): NanoIDAction<TInput, undefined>;
/**
 * Creates a [Nano ID](https://github.com/ai/nanoid) validation action.
 *
 * @param message The error message.
 *
 * @returns A Nano ID action.
 */
declare function nanoid<TInput extends string, const TMessage extends ErrorMessage<NanoIDIssue<TInput>> | undefined>(message: TMessage): NanoIDAction<TInput, TMessage>;

/**
 * Non empty issue type.
 */
interface NonEmptyIssue<TInput extends LengthInput> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'non_empty';
    /**
     * The expected input.
     */
    readonly expected: '!0';
    /**
     * The received input.
     */
    readonly received: '0';
}
/**
 * Non empty action type.
 */
interface NonEmptyAction<TInput extends LengthInput, TMessage extends ErrorMessage<NonEmptyIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, NonEmptyIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'non_empty';
    /**
     * The action reference.
     */
    readonly reference: typeof nonEmpty;
    /**
     * The expected property.
     */
    readonly expects: '!0';
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a non-empty validation action.
 *
 * @returns A non-empty action.
 */
declare function nonEmpty<TInput extends LengthInput>(): NonEmptyAction<TInput, undefined>;
/**
 * Creates a non-empty validation action.
 *
 * @param message The error message.
 *
 * @returns A non-empty action.
 */
declare function nonEmpty<TInput extends LengthInput, const TMessage extends ErrorMessage<NonEmptyIssue<TInput>> | undefined>(message: TMessage): NonEmptyAction<TInput, TMessage>;

/**
 * Normalize form type.
 */
type NormalizeForm = 'NFC' | 'NFD' | 'NFKC' | 'NFKD';
/**
 * Normalize action type.
 */
interface NormalizeAction<TForm extends NormalizeForm | undefined> extends BaseTransformation<string, string, never> {
    /**
     * The action type.
     */
    readonly type: 'normalize';
    /**
     * The action reference.
     */
    readonly reference: typeof normalize;
    /**
     * The normalization form.
     */
    readonly form: TForm;
}
/**
 * Creates a normalize transformation action.
 *
 * @returns A normalize action.
 */
declare function normalize(): NormalizeAction<undefined>;
/**
 * Creates a normalize transformation action.
 *
 * @param form The normalization form.
 *
 * @returns A normalize action.
 */
declare function normalize<TForm extends NormalizeForm | undefined>(form: TForm): NormalizeAction<TForm>;

/**
 * Not bytes issue type.
 */
interface NotBytesIssue<TInput extends string, TRequirement extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'not_bytes';
    /**
     * The expected property.
     */
    readonly expected: `!${TRequirement}`;
    /**
     * The received property.
     */
    readonly received: `${number}`;
    /**
     * The not required bytes.
     */
    readonly requirement: TRequirement;
}
/**
 * Not bytes action type.
 */
interface NotBytesAction<TInput extends string, TRequirement extends number, TMessage extends ErrorMessage<NotBytesIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, NotBytesIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'not_bytes';
    /**
     * The action reference.
     */
    readonly reference: typeof notBytes;
    /**
     * The expected property.
     */
    readonly expects: `!${TRequirement}`;
    /**
     * The not required bytes.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a not [bytes](https://en.wikipedia.org/wiki/Byte) validation action.
 *
 * @param requirement The not required bytes.
 *
 * @returns A not bytes action.
 */
declare function notBytes<TInput extends string, const TRequirement extends number>(requirement: TRequirement): NotBytesAction<TInput, TRequirement, undefined>;
/**
 * Creates a not [bytes](https://en.wikipedia.org/wiki/Byte) validation action.
 *
 * @param requirement The not required bytes.
 * @param message The error message.
 *
 * @returns A not bytes action.
 */
declare function notBytes<TInput extends string, const TRequirement extends number, const TMessage extends ErrorMessage<NotBytesIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): NotBytesAction<TInput, TRequirement, TMessage>;

/**
 * Not length issue type.
 */
interface NotLengthIssue<TInput extends LengthInput, TRequirement extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'not_length';
    /**
     * The expected property.
     */
    readonly expected: `!${TRequirement}`;
    /**
     * The received property.
     */
    readonly received: `${TRequirement}`;
    /**
     * The not required length.
     */
    readonly requirement: TRequirement;
}
/**
 * Not length action type.
 */
interface NotLengthAction<TInput extends LengthInput, TRequirement extends number, TMessage extends ErrorMessage<NotLengthIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, NotLengthIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'not_length';
    /**
     * The action reference.
     */
    readonly reference: typeof notLength;
    /**
     * The expected property.
     */
    readonly expects: `!${TRequirement}`;
    /**
     * The not required length.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a not length validation action.
 *
 * @param requirement The not required length.
 *
 * @returns A not length action.
 */
declare function notLength<TInput extends LengthInput, const TRequirement extends number>(requirement: TRequirement): NotLengthAction<TInput, TRequirement, undefined>;
/**
 * Creates a not length validation action.
 *
 * @param requirement The not required length.
 * @param message The error message.
 *
 * @returns A not length action.
 */
declare function notLength<TInput extends LengthInput, const TRequirement extends number, const TMessage extends ErrorMessage<NotLengthIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): NotLengthAction<TInput, TRequirement, TMessage>;

/**
 * Not size issue type.
 */
interface NotSizeIssue<TInput extends SizeInput, TRequirement extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'not_size';
    /**
     * The expected property.
     */
    readonly expected: `!${TRequirement}`;
    /**
     * The received property.
     */
    readonly received: `${TRequirement}`;
    /**
     * The not required size.
     */
    readonly requirement: TRequirement;
}
/**
 * Not size action type.
 */
interface NotSizeAction<TInput extends SizeInput, TRequirement extends number, TMessage extends ErrorMessage<NotSizeIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, NotSizeIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'not_size';
    /**
     * The action reference.
     */
    readonly reference: typeof notSize;
    /**
     * The expected property.
     */
    readonly expects: `!${TRequirement}`;
    /**
     * The not required size.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a not size validation action.
 *
 * @param requirement The not required size.
 *
 * @returns A not size action.
 */
declare function notSize<TInput extends SizeInput, const TRequirement extends number>(requirement: TRequirement): NotSizeAction<TInput, TRequirement, undefined>;
/**
 * Creates a not size validation action.
 *
 * @param requirement The not required size.
 * @param message The error message.
 *
 * @returns A not size action.
 */
declare function notSize<TInput extends SizeInput, const TRequirement extends number, const TMessage extends ErrorMessage<NotSizeIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): NotSizeAction<TInput, TRequirement, TMessage>;

/**
 * Not value issue type.
 */
interface NotValueIssue<TInput extends ValueInput, TRequirement extends TInput> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'not_value';
    /**
     * The expected property.
     */
    readonly expected: `!${string}`;
    /**
     * The not required value.
     */
    readonly requirement: TRequirement;
}
/**
 * Not value action type.
 */
interface NotValueAction<TInput extends ValueInput, TRequirement extends TInput, TMessage extends ErrorMessage<NotValueIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, NotValueIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'not_value';
    /**
     * The action reference.
     */
    readonly reference: typeof notValue;
    /**
     * The expected property.
     */
    readonly expects: `!${string}`;
    /**
     * The not required value.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a not value validation action.
 *
 * @param requirement The not required value.
 *
 * @returns A not value action.
 */
declare function notValue<TInput extends ValueInput, const TRequirement extends TInput>(requirement: TRequirement): NotValueAction<TInput, TRequirement, undefined>;
/**
 * Creates a not value validation action.
 *
 * @param requirement The not required value.
 * @param message The error message.
 *
 * @returns A not value action.
 */
declare function notValue<TInput extends ValueInput, const TRequirement extends TInput, const TMessage extends ErrorMessage<NotValueIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): NotValueAction<TInput, TRequirement, TMessage>;

/**
 * Octal issue type.
 */
interface OctalIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'octal';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The octal regex.
     */
    readonly requirement: RegExp;
}
/**
 * Octal action type.
 */
interface OctalAction<TInput extends string, TMessage extends ErrorMessage<OctalIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, OctalIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'octal';
    /**
     * The action reference.
     */
    readonly reference: typeof octal;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The octal regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [octal](https://en.wikipedia.org/wiki/Octal) validation action.
 *
 * @returns An octal action.
 */
declare function octal<TInput extends string>(): OctalAction<TInput, undefined>;
/**
 * Creates an [octal](https://en.wikipedia.org/wiki/Octal) validation action.
 *
 * @param message The error message.
 *
 * @returns An octal action.
 */
declare function octal<TInput extends string, const TMessage extends ErrorMessage<OctalIssue<TInput>> | undefined>(message: TMessage): OctalAction<TInput, TMessage>;

/**
 * Partial input type.
 */
type PartialInput = Record<string, unknown> | ArrayLike<unknown>;
/**
 * Partial check issue type.
 */
interface PartialCheckIssue<TInput extends PartialInput> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'partial_check';
    /**
     * The expected input.
     */
    readonly expected: null;
    /**
     * The validation function.
     */
    readonly requirement: (input: TInput) => MaybePromise<boolean>;
}

/**
 * Partial check action type.
 *
 * TODO: Should we add a `pathList` property?
 */
interface PartialCheckAction<TInput extends PartialInput, TSelection extends PartialInput, TMessage extends ErrorMessage<PartialCheckIssue<TSelection>> | undefined> extends BaseValidation<TInput, TInput, PartialCheckIssue<TSelection>> {
    /**
     * The action type.
     */
    readonly type: 'partial_check';
    /**
     * The action reference.
     */
    readonly reference: typeof partialCheck;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The validation function.
     */
    readonly requirement: (input: TSelection) => boolean;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a partial check validation action.
 *
 * @param pathList The selected paths.
 * @param requirement The validation function.
 *
 * @returns A partial check action.
 */
declare function partialCheck<TInput extends PartialInput, const TPathList extends readonly PathKeys<TInput>[], const TSelection extends DeepPickN<TInput, TPathList>>(pathList: TPathList, requirement: (input: TSelection) => boolean): PartialCheckAction<TInput, TSelection, undefined>;
/**
 * Creates a partial check validation action.
 *
 * @param pathList The selected paths.
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns A partial check action.
 */
declare function partialCheck<TInput extends PartialInput, const TPathList extends readonly PathKeys<TInput>[], const TSelection extends DeepPickN<TInput, TPathList>, const TMessage extends ErrorMessage<PartialCheckIssue<TSelection>> | undefined>(pathList: TPathList, requirement: (input: TSelection) => boolean, message: TMessage): PartialCheckAction<TInput, TSelection, TMessage>;

/**
 * Partial check action async type.
 *
 * TODO: Should we add a `pathList` property?
 */
interface PartialCheckActionAsync<TInput extends PartialInput, TSelection extends PartialInput, TMessage extends ErrorMessage<PartialCheckIssue<TSelection>> | undefined> extends BaseValidationAsync<TInput, TInput, PartialCheckIssue<TSelection>> {
    /**
     * The action type.
     */
    readonly type: 'partial_check';
    /**
     * The action reference.
     */
    readonly reference: typeof partialCheckAsync;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The validation function.
     */
    readonly requirement: (input: TSelection) => MaybePromise<boolean>;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a partial check validation action.
 *
 * @param pathList The selected paths.
 * @param requirement The validation function.
 *
 * @returns A partial check action.
 */
declare function partialCheckAsync<TInput extends PartialInput, const TPathList extends readonly PathKeys<TInput>[], const TSelection extends DeepPickN<TInput, TPathList>>(pathList: TPathList, requirement: (input: TSelection) => MaybePromise<boolean>): PartialCheckActionAsync<TInput, TSelection, undefined>;
/**
 * Creates a partial check validation action.
 *
 * @param pathList The selected paths.
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns A partial check action.
 */
declare function partialCheckAsync<TInput extends PartialInput, const TPathList extends readonly PathKeys<TInput>[], const TSelection extends DeepPickN<TInput, TPathList>, const TMessage extends ErrorMessage<PartialCheckIssue<TSelection>> | undefined>(pathList: TPathList, requirement: (input: TSelection) => MaybePromise<boolean>, message: TMessage): PartialCheckActionAsync<TInput, TSelection, TMessage>;

/**
 * Raw check issue type.
 */
interface RawCheckIssue<TInput> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'raw_check';
}
/**
 * Issue info type.
 */
interface IssueInfo$1<TInput> {
    label?: string | undefined;
    input?: unknown | undefined;
    expected?: string | undefined;
    received?: string | undefined;
    message?: ErrorMessage<RawCheckIssue<TInput>> | undefined;
    path?: [IssuePathItem, ...IssuePathItem[]] | undefined;
}
/**
 * Add issue type.
 */
type AddIssue$1<TInput> = (info?: IssueInfo$1<TInput>) => void;
/**
 * Context type.
 */
interface Context$2<TInput> {
    readonly dataset: Dataset<TInput, BaseIssue<unknown>>;
    readonly config: Config<RawCheckIssue<TInput>>;
    readonly addIssue: AddIssue$1<TInput>;
}

/**
 * Raw check action type.
 */
interface RawCheckAction<TInput> extends BaseValidation<TInput, TInput, RawCheckIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'raw_check';
    /**
     * The action reference.
     */
    readonly reference: typeof rawCheck;
    /**
     * The expected property.
     */
    readonly expects: null;
}
/**
 * Creates a raw check validation action.
 *
 * @param action The validation action.
 *
 * @returns A raw check action.
 */
declare function rawCheck<TInput>(action: (context: Context$2<TInput>) => void): RawCheckAction<TInput>;

/**
 * Raw check action async type.
 */
interface RawCheckActionAsync<TInput> extends BaseValidationAsync<TInput, TInput, RawCheckIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'raw_check';
    /**
     * The action reference.
     */
    readonly reference: typeof rawCheckAsync;
    /**
     * The expected property.
     */
    readonly expects: null;
}
/**
 * Creates a raw check validation action.
 *
 * @param action The validation action.
 *
 * @returns A raw check action.
 */
declare function rawCheckAsync<TInput>(action: (context: Context$2<TInput>) => MaybePromise<void>): RawCheckActionAsync<TInput>;

/**
 * Raw transform issue type.
 */
interface RawTransformIssue<TInput> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'transformation';
    /**
     * The issue type.
     */
    readonly type: 'raw_transform';
}
/**
 * Issue info type.
 */
interface IssueInfo<TInput> {
    label?: string | undefined;
    input?: unknown | undefined;
    expected?: string | undefined;
    received?: string | undefined;
    message?: ErrorMessage<RawTransformIssue<TInput>> | undefined;
    path?: [IssuePathItem, ...IssuePathItem[]] | undefined;
}
/**
 * Add issue type.
 */
type AddIssue<TInput> = (info?: IssueInfo<TInput>) => void;
/**
 * Context type.
 */
interface Context$1<TInput> {
    readonly dataset: TypedDataset<TInput, never>;
    readonly config: Config<RawTransformIssue<TInput>>;
    readonly addIssue: AddIssue<TInput>;
    readonly NEVER: never;
}

/**
 * Raw transform action type.
 */
interface RawTransformAction<TInput, TOutput> extends BaseTransformation<TInput, TOutput, RawTransformIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'raw_transform';
    /**
     * The action reference.
     */
    readonly reference: typeof rawTransform;
}
/**
 * Creates a raw transformation action.
 *
 * @param action The transformation action.
 *
 * @returns A raw transform action.
 */
declare function rawTransform<TInput, TOutput>(action: (context: Context$1<TInput>) => TOutput): RawTransformAction<TInput, TOutput>;

/**
 * Raw transform action async type.
 */
interface RawTransformActionAsync<TInput, TOutput> extends BaseTransformationAsync<TInput, TOutput, RawTransformIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'raw_transform';
    /**
     * The action reference.
     */
    readonly reference: typeof rawTransformAsync;
}
/**
 * Creates a raw transformation action.
 *
 * @param action The transformation action.
 *
 * @returns A raw transform action.
 */
declare function rawTransformAsync<TInput, TOutput>(action: (context: Context$1<TInput>) => MaybePromise<TOutput>): RawTransformActionAsync<TInput, TOutput>;

/**
 * Readonly action type.
 */
interface ReadonlyAction<TInput> extends BaseTransformation<TInput, Readonly<TInput>, never> {
    /**
     * The action type.
     */
    readonly type: 'readonly';
    /**
     * The action reference.
     */
    readonly reference: typeof readonly;
}
/**
 * Creates a readonly transformation action.
 *
 * @returns A readonly action.
 */
declare function readonly<TInput>(): ReadonlyAction<TInput>;

/**
 * Array action type.
 */
type ArrayAction$1<TInput extends ArrayInput, TOutput> = (output: TOutput, item: TInput[number], index: number, array: TInput) => TOutput;
/**
 * Reduce items action type.
 */
interface ReduceItemsAction<TInput extends ArrayInput, TOutput> extends BaseTransformation<TInput, TOutput, never> {
    /**
     * The action type.
     */
    readonly type: 'reduce_items';
    /**
     * The action reference.
     */
    readonly reference: typeof reduceItems;
    /**
     * The reduce items operation.
     */
    readonly operation: ArrayAction$1<TInput, TOutput>;
    /**
     * The initial value.
     */
    readonly initial: TOutput;
}
/**
 * Creates a reduce items transformation action.
 *
 * @param operation The reduce items operation.
 * @param initial The initial value.
 *
 * @returns A reduce items action.
 */
declare function reduceItems<TInput extends ArrayInput, TOutput>(operation: ArrayAction$1<TInput, TOutput>, initial: TOutput): ReduceItemsAction<TInput, TOutput>;

/**
 * Regex issue type.
 */
interface RegexIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'regex';
    /**
     * The expected input.
     */
    readonly expected: string;
    /**
     * The received input.
     */
    readonly received: `"${string}"`;
    /**
     * The regex pattern.
     */
    readonly requirement: RegExp;
}
/**
 * Regex action type.
 */
interface RegexAction<TInput extends string, TMessage extends ErrorMessage<RegexIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, RegexIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'regex';
    /**
     * The action reference.
     */
    readonly reference: typeof regex;
    /**
     * The expected property.
     */
    readonly expects: string;
    /**
     * The regex pattern.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a [regex](https://en.wikipedia.org/wiki/Regular_expression) validation action.
 *
 * @param requirement The regex pattern.
 *
 * @returns A regex action.
 */
declare function regex<TInput extends string>(requirement: RegExp): RegexAction<TInput, undefined>;
/**
 * Creates a [regex](https://en.wikipedia.org/wiki/Regular_expression) validation action.
 *
 * @param requirement The regex pattern.
 * @param message The error message.
 *
 * @returns A regex action.
 */
declare function regex<TInput extends string, const TMessage extends ErrorMessage<RegexIssue<TInput>> | undefined>(requirement: RegExp, message: TMessage): RegexAction<TInput, TMessage>;

/**
 * Safe integer issue type.
 */
interface SafeIntegerIssue<TInput extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'safe_integer';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `${number}`;
    /**
     * The validation function.
     */
    readonly requirement: (input: number) => boolean;
}
/**
 * Safe integer action type.
 */
interface SafeIntegerAction<TInput extends number, TMessage extends ErrorMessage<SafeIntegerIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, SafeIntegerIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'safe_integer';
    /**
     * The action reference.
     */
    readonly reference: typeof safeInteger;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The validation function.
     */
    readonly requirement: (input: number) => boolean;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a safe integer validation action.
 *
 * @returns A safe integer action.
 */
declare function safeInteger<TInput extends number>(): SafeIntegerAction<TInput, undefined>;
/**
 * Creates a safe integer validation action.
 *
 * @param message The error message.
 *
 * @returns A safe integer action.
 */
declare function safeInteger<TInput extends number, const TMessage extends ErrorMessage<SafeIntegerIssue<TInput>> | undefined>(message: TMessage): SafeIntegerAction<TInput, TMessage>;

/**
 * Size issue type.
 */
interface SizeIssue<TInput extends SizeInput, TRequirement extends number> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'size';
    /**
     * The expected property.
     */
    readonly expected: `${TRequirement}`;
    /**
     * The received property.
     */
    readonly received: `${number}`;
    /**
     * The required size.
     */
    readonly requirement: TRequirement;
}
/**
 * Size action type.
 */
interface SizeAction<TInput extends SizeInput, TRequirement extends number, TMessage extends ErrorMessage<SizeIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, SizeIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'size';
    /**
     * The action reference.
     */
    readonly reference: typeof size;
    /**
     * The expected property.
     */
    readonly expects: `${TRequirement}`;
    /**
     * The required size.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a size validation action.
 *
 * @param requirement The required size.
 *
 * @returns A size action.
 */
declare function size<TInput extends SizeInput, const TRequirement extends number>(requirement: TRequirement): SizeAction<TInput, TRequirement, undefined>;
/**
 * Creates a size validation action.
 *
 * @param requirement The required size.
 * @param message The error message.
 *
 * @returns A size action.
 */
declare function size<TInput extends SizeInput, const TRequirement extends number, const TMessage extends ErrorMessage<SizeIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): SizeAction<TInput, TRequirement, TMessage>;

/**
 * Some item issue type.
 */
interface SomeItemIssue<TInput extends ArrayInput> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'some_item';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The validation function.
     */
    readonly requirement: ArrayRequirement<TInput>;
}
/**
 * Some item action type.
 */
interface SomeItemAction<TInput extends ArrayInput, TMessage extends ErrorMessage<SomeItemIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, SomeItemIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'some_item';
    /**
     * The action reference.
     */
    readonly reference: typeof someItem;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The validation function.
     */
    readonly requirement: ArrayRequirement<TInput>;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a some item validation action.
 *
 * @param requirement The validation function.
 *
 * @returns A some item action.
 */
declare function someItem<TInput extends ArrayInput>(requirement: ArrayRequirement<TInput>): SomeItemAction<TInput, undefined>;
/**
 * Creates a some item validation action.
 *
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns A some item action.
 */
declare function someItem<TInput extends ArrayInput, const TMessage extends ErrorMessage<SomeItemIssue<TInput>> | undefined>(requirement: ArrayRequirement<TInput>, message: TMessage): SomeItemAction<TInput, TMessage>;

/**
 * Array action type.
 */
type ArrayAction<TInput extends ArrayInput> = (itemA: TInput[number], itemB: TInput[number]) => number;
/**
 * Sort items action type.
 */
interface SortItemsAction<TInput extends ArrayInput> extends BaseTransformation<TInput, TInput, never> {
    /**
     * The action type.
     */
    readonly type: 'sort_items';
    /**
     * The action reference.
     */
    readonly reference: typeof sortItems;
    /**
     * The sort items operation.
     */
    readonly operation: ArrayAction<TInput> | undefined;
}
/**
 * Creates a sort items transformation action.
 *
 * @param operation The sort items operation.
 *
 * @returns A sort items action.
 */
declare function sortItems<TInput extends ArrayInput>(operation?: ArrayAction<TInput>): SortItemsAction<TInput>;

/**
 * Starts with issue type.
 */
interface StartsWithIssue<TInput extends string, TRequirement extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'starts_with';
    /**
     * The expected property.
     */
    readonly expected: `"${TRequirement}"`;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The start string.
     */
    readonly requirement: TRequirement;
}
/**
 * Starts with action type.
 */
interface StartsWithAction<TInput extends string, TRequirement extends string, TMessage extends ErrorMessage<StartsWithIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, StartsWithIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'starts_with';
    /**
     * The action reference.
     */
    readonly reference: typeof startsWith;
    /**
     * The expected property.
     */
    readonly expects: `"${TRequirement}"`;
    /**
     * The start string.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a starts with validation action.
 *
 * @param requirement The start string.
 *
 * @returns A starts with action.
 */
declare function startsWith<TInput extends string, const TRequirement extends string>(requirement: TRequirement): StartsWithAction<TInput, TRequirement, undefined>;
/**
 * Creates a starts with validation action.
 *
 * @param requirement The start string.
 * @param message The error message.
 *
 * @returns A starts with action.
 */
declare function startsWith<TInput extends string, const TRequirement extends string, const TMessage extends ErrorMessage<StartsWithIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): StartsWithAction<TInput, TRequirement, TMessage>;

/**
 * To lower case action type.
 */
interface ToLowerCaseAction extends BaseTransformation<string, string, never> {
    /**
     * The action type.
     */
    readonly type: 'to_lower_case';
    /**
     * The action reference.
     */
    readonly reference: typeof toLowerCase;
}
/**
 * Creates a to lower case transformation action.
 *
 * @returns A to lower case action.
 */
declare function toLowerCase(): ToLowerCaseAction;

/**
 * To max value action type.
 */
interface ToMaxValueAction<TInput extends ValueInput, TRequirement extends TInput> extends BaseTransformation<TInput, TInput, never> {
    /**
     * The action type.
     */
    readonly type: 'to_max_value';
    /**
     * The action reference.
     */
    readonly reference: typeof toMaxValue;
    /**
     * The maximum value.
     */
    readonly requirement: TRequirement;
}
/**
 * Creates a to max value transformation action.
 *
 * @param requirement The maximum value.
 *
 * @returns A to max value action.
 */
declare function toMaxValue<TInput extends ValueInput, const TRequirement extends TInput>(requirement: TRequirement): ToMaxValueAction<TInput, TRequirement>;

/**
 * To min value action type.
 */
interface ToMinValueAction<TInput extends ValueInput, TRequirement extends TInput> extends BaseTransformation<TInput, TInput, never> {
    /**
     * The action type.
     */
    readonly type: 'to_min_value';
    /**
     * The action reference.
     */
    readonly reference: typeof toMinValue;
    /**
     * The minimum value.
     */
    readonly requirement: TRequirement;
}
/**
 * Creates a to min value transformation action.
 *
 * @param requirement The minimum value.
 *
 * @returns A to min value action.
 */
declare function toMinValue<TInput extends ValueInput, const TRequirement extends TInput>(requirement: TRequirement): ToMinValueAction<TInput, TRequirement>;

/**
 * To upper case action type.
 */
interface ToUpperCaseAction extends BaseTransformation<string, string, never> {
    /**
     * The action type.
     */
    readonly type: 'to_upper_case';
    /**
     * The action reference.
     */
    readonly reference: typeof toUpperCase;
}
/**
 * Creates a to upper case transformation action.
 *
 * @returns A to upper case action.
 */
declare function toUpperCase(): ToUpperCaseAction;

/**
 * Transform action type.
 */
interface TransformAction<TInput, TOutput> extends BaseTransformation<TInput, TOutput, never> {
    /**
     * The action type.
     */
    readonly type: 'transform';
    /**
     * The action reference.
     */
    readonly reference: typeof transform;
    /**
     * The transformation operation.
     */
    readonly operation: (input: TInput) => TOutput;
}
/**
 * Creates a custom transformation action.
 *
 * @param operation The transformation operation.
 *
 * @returns A transform action.
 */
declare function transform<TInput, TOutput>(operation: (input: TInput) => TOutput): TransformAction<TInput, TOutput>;

/**
 * Transform action async type.
 */
interface TransformActionAsync<TInput, TOutput> extends BaseTransformationAsync<TInput, TOutput, never> {
    /**
     * The action type.
     */
    readonly type: 'transform';
    /**
     * The action reference.
     */
    readonly reference: typeof transformAsync;
    /**
     * The transformation operation.
     */
    readonly operation: (input: TInput) => Promise<TOutput>;
}
/**
 * Creates a custom transformation action.
 *
 * @param operation The transformation operation.
 *
 * @returns A transform action.
 */
declare function transformAsync<TInput, TOutput>(operation: (input: TInput) => Promise<TOutput>): TransformActionAsync<TInput, TOutput>;

/**
 * Trim action type.
 */
interface TrimAction extends BaseTransformation<string, string, never> {
    /**
     * The action type.
     */
    readonly type: 'trim';
    /**
     * The action reference.
     */
    readonly reference: typeof trim;
}
/**
 * Creates a trim transformation action.
 *
 * @returns A trim action.
 */
declare function trim(): TrimAction;

/**
 * Trim end action type.
 */
interface TrimEndAction extends BaseTransformation<string, string, never> {
    /**
     * The action type.
     */
    readonly type: 'trim_end';
    /**
     * The action reference.
     */
    readonly reference: typeof trimEnd;
}
/**
 * Creates a trim end transformation action.
 *
 * @returns A trim end action.
 */
declare function trimEnd(): TrimEndAction;

/**
 * Trim start action type.
 */
interface TrimStartAction extends BaseTransformation<string, string, never> {
    /**
     * The action type.
     */
    readonly type: 'trim_start';
    /**
     * The action reference.
     */
    readonly reference: typeof trimStart;
}
/**
 * Creates a trim start transformation action.
 *
 * @returns A trim start action.
 */
declare function trimStart(): TrimStartAction;

/**
 * ULID issue type.
 */
interface UlidIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'ulid';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The ULID regex.
     */
    readonly requirement: RegExp;
}
/**
 * ULID action type.
 */
interface UlidAction<TInput extends string, TMessage extends ErrorMessage<UlidIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, UlidIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'ulid';
    /**
     * The action reference.
     */
    readonly reference: typeof ulid;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The ULID regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [ULID](https://github.com/ulid/spec) validation action.
 *
 * @returns An ULID action.
 */
declare function ulid<TInput extends string>(): UlidAction<TInput, undefined>;
/**
 * Creates an [ULID](https://github.com/ulid/spec) validation action.
 *
 * @param message The error message.
 *
 * @returns An ULID action.
 */
declare function ulid<TInput extends string, const TMessage extends ErrorMessage<UlidIssue<TInput>> | undefined>(message: TMessage): UlidAction<TInput, TMessage>;

/**
 * URL issue type.
 */
interface UrlIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'url';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The validation function.
     */
    readonly requirement: (input: string) => boolean;
}
/**
 * URL action type.
 */
interface UrlAction<TInput extends string, TMessage extends ErrorMessage<UrlIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, UrlIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'url';
    /**
     * The action reference.
     */
    readonly reference: typeof url;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The validation function.
     */
    readonly requirement: (input: string) => boolean;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [URL](https://en.wikipedia.org/wiki/URL) validation action.
 *
 * Hint: The value is passed to the URL constructor to check if it is valid.
 * This check is not perfect. For example, values like "abc:1234" are accepted.
 *
 * @returns An URL action.
 */
declare function url<TInput extends string>(): UrlAction<TInput, undefined>;
/**
 * Creates an [URL](https://en.wikipedia.org/wiki/URL) validation action.
 *
 * Hint: The value is passed to the URL constructor to check if it is valid.
 * This check is not perfect. For example, values like "abc:1234" are accepted.
 *
 * @param message The error message.
 *
 * @returns An URL action.
 */
declare function url<TInput extends string, const TMessage extends ErrorMessage<UrlIssue<TInput>> | undefined>(message: TMessage): UrlAction<TInput, TMessage>;

/**
 * UUID issue type.
 */
interface UuidIssue<TInput extends string> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'uuid';
    /**
     * The expected property.
     */
    readonly expected: null;
    /**
     * The received property.
     */
    readonly received: `"${string}"`;
    /**
     * The UUID regex.
     */
    readonly requirement: RegExp;
}
/**
 * UUID action type.
 */
interface UuidAction<TInput extends string, TMessage extends ErrorMessage<UuidIssue<TInput>> | undefined> extends BaseValidation<TInput, TInput, UuidIssue<TInput>> {
    /**
     * The action type.
     */
    readonly type: 'uuid';
    /**
     * The action reference.
     */
    readonly reference: typeof uuid;
    /**
     * The expected property.
     */
    readonly expects: null;
    /**
     * The UUID regex.
     */
    readonly requirement: RegExp;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates an [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) validation action.
 *
 * @returns An UUID action.
 */
declare function uuid<TInput extends string>(): UuidAction<TInput, undefined>;
/**
 * Creates an [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) validation action.
 *
 * @param message The error message.
 *
 * @returns An UUID action.
 */
declare function uuid<TInput extends string, const TMessage extends ErrorMessage<UuidIssue<TInput>> | undefined>(message: TMessage): UuidAction<TInput, TMessage>;

/**
 * Value issue type.
 */
interface ValueIssue<TInput extends ValueInput, TRequirement extends TInput> extends BaseIssue<TInput> {
    /**
     * The issue kind.
     */
    readonly kind: 'validation';
    /**
     * The issue type.
     */
    readonly type: 'value';
    /**
     * The expected property.
     */
    readonly expected: string;
    /**
     * The required value.
     */
    readonly requirement: TRequirement;
}
/**
 * Value action type.
 */
interface ValueAction<TInput extends ValueInput, TRequirement extends TInput, TMessage extends ErrorMessage<ValueIssue<TInput, TRequirement>> | undefined> extends BaseValidation<TInput, TInput, ValueIssue<TInput, TRequirement>> {
    /**
     * The action type.
     */
    readonly type: 'value';
    /**
     * The action reference.
     */
    readonly reference: typeof value;
    /**
     * The expected property.
     */
    readonly expects: string;
    /**
     * The required value.
     */
    readonly requirement: TRequirement;
    /**
     * The error message.
     */
    readonly message: TMessage;
}
/**
 * Creates a value validation action.
 *
 * @param requirement The required value.
 *
 * @returns A value action.
 */
declare function value<TInput extends ValueInput, const TRequirement extends TInput>(requirement: TRequirement): ValueAction<TInput, TRequirement, undefined>;
/**
 * Creates a value validation action.
 *
 * @param requirement The required value.
 * @param message The error message.
 *
 * @returns A value action.
 */
declare function value<TInput extends ValueInput, const TRequirement extends TInput, const TMessage extends ErrorMessage<ValueIssue<TInput, TRequirement>> | undefined>(requirement: TRequirement, message: TMessage): ValueAction<TInput, TRequirement, TMessage>;

/**
 * [Base64](https://en.wikipedia.org/wiki/Base64) regex.
 */
declare const BASE64_REGEX: RegExp;
/**
 * [BIC](https://en.wikipedia.org/wiki/ISO_9362) regex.
 */
declare const BIC_REGEX: RegExp;
/**
 * [Cuid2](https://github.com/paralleldrive/cuid2) regex.
 */
declare const CUID2_REGEX: RegExp;
/**
 * [Decimal](https://en.wikipedia.org/wiki/Decimal) regex.
 */
declare const DECIMAL_REGEX: RegExp;
/**
 * Email regex.
 */
declare const EMAIL_REGEX: RegExp;
/**
 * Emoji regex from [emoji-regex-xs](https://github.com/slevithan/emoji-regex-xs) v1.0.0 (MIT license).
 *
 * Hint: We decided against the newer `/^\p{RGI_Emoji}+$/v` regex because it is
 * not supported in older runtimes and does not match all emoji.
 */
declare const EMOJI_REGEX: RegExp;
/**
 * [Hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) regex.
 */
declare const HEXADECIMAL_REGEX: RegExp;
/**
 * [Hex color](https://en.wikipedia.org/wiki/Web_colors#Hex_triplet) regex.
 */
declare const HEX_COLOR_REGEX: RegExp;
/**
 * [IMEI](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity) regex.
 */
declare const IMEI_REGEX: RegExp;
/**
 * [IPv4](https://en.wikipedia.org/wiki/IPv4) regex.
 */
declare const IPV4_REGEX: RegExp;
/**
 * [IPv6](https://en.wikipedia.org/wiki/IPv6) regex.
 */
declare const IPV6_REGEX: RegExp;
/**
 * [IP](https://en.wikipedia.org/wiki/IP_address) regex.
 */
declare const IP_REGEX: RegExp;
/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date regex.
 */
declare const ISO_DATE_REGEX: RegExp;
/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date-time regex.
 */
declare const ISO_DATE_TIME_REGEX: RegExp;
/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) time regex.
 */
declare const ISO_TIME_REGEX: RegExp;
/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) time with seconds regex.
 */
declare const ISO_TIME_SECOND_REGEX: RegExp;
/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp regex.
 */
declare const ISO_TIMESTAMP_REGEX: RegExp;
/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) week regex.
 */
declare const ISO_WEEK_REGEX: RegExp;
/**
 * [MAC](https://en.wikipedia.org/wiki/MAC_address) 48 bit regex.
 */
declare const MAC48_REGEX: RegExp;
/**
 * [MAC](https://en.wikipedia.org/wiki/MAC_address) 64 bit regex.
 */
declare const MAC64_REGEX: RegExp;
/**
 * [MAC](https://en.wikipedia.org/wiki/MAC_address) regex.
 */
declare const MAC_REGEX: RegExp;
/**
 * [Nano ID](https://github.com/ai/nanoid) regex.
 */
declare const NANO_ID_REGEX: RegExp;
/**
 * [Octal](https://en.wikipedia.org/wiki/Octal) regex.
 */
declare const OCTAL_REGEX: RegExp;
/**
 * [ULID](https://github.com/ulid/spec) regex.
 */
declare const ULID_REGEX: RegExp;
/**
 * [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) regex.
 */
declare const UUID_REGEX: RegExp;

/**
 * The global config type.
 */
type GlobalConfig = Omit<Config<never>, 'message'>;
/**
 * Sets the global configuration.
 *
 * @param config The configuration.
 */
declare function setGlobalConfig(config: GlobalConfig): void;
/**
 * Returns the global configuration.
 *
 * @param config The config to merge.
 *
 * @returns The configuration.
 */
declare function getGlobalConfig<const TIssue extends BaseIssue<unknown>>(config?: Config<TIssue>): Config<TIssue>;
/**
 * Deletes the global configuration.
 */
declare function deleteGlobalConfig(): void;

/**
 * Sets a global error message.
 *
 * @param message The error message.
 * @param lang The language of the message.
 */
declare function setGlobalMessage(message: ErrorMessage<BaseIssue<unknown>>, lang?: string): void;
/**
 * Returns a global error message.
 *
 * @param lang The language of the message.
 *
 * @returns The error message.
 */
declare function getGlobalMessage(lang?: string): ErrorMessage<BaseIssue<unknown>> | undefined;
/**
 * Deletes a global error message.
 *
 * @param lang The language of the message.
 */
declare function deleteGlobalMessage(lang?: string): void;

/**
 * Sets a schema error message.
 *
 * @param message The error message.
 * @param lang The language of the message.
 */
declare function setSchemaMessage(message: ErrorMessage<BaseIssue<unknown>>, lang?: string): void;
/**
 * Returns a schema error message.
 *
 * @param lang The language of the message.
 *
 * @returns The error message.
 */
declare function getSchemaMessage(lang?: string): ErrorMessage<BaseIssue<unknown>> | undefined;
/**
 * Deletes a schema error message.
 *
 * @param lang The language of the message.
 */
declare function deleteSchemaMessage(lang?: string): void;

/**
 * Reference type.
 */
type Reference = (...args: any[]) => BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>> | BaseValidation<unknown, unknown, BaseIssue<unknown>> | BaseValidationAsync<unknown, unknown, BaseIssue<unknown>> | BaseTransformation<unknown, unknown, BaseIssue<unknown>> | BaseTransformationAsync<unknown, unknown, BaseIssue<unknown>>;
/**
 * Sets a specific error message.
 *
 * @param reference The identifier reference.
 * @param message The error message.
 * @param lang The language of the message.
 */
declare function setSpecificMessage<const TReference extends Reference>(reference: TReference, message: ErrorMessage<InferIssue<ReturnType<TReference>>>, lang?: string): void;
/**
 * Returns a specific error message.
 *
 * @param reference The identifier reference.
 * @param lang The language of the message.
 *
 * @returns The error message.
 */
declare function getSpecificMessage<const TReference extends Reference>(reference: TReference, lang?: string): ErrorMessage<InferIssue<ReturnType<TReference>>> | undefined;
/**
 * Deletes a specific error message.
 *
 * @param reference The identifier reference.
 * @param lang The language of the message.
 */
declare function deleteSpecificMessage(reference: Reference, lang?: string): void;

/**
 * Context type.
 */
type Context = BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>> | BaseValidation<any, unknown, BaseIssue<unknown>> | BaseValidationAsync<any, unknown, BaseIssue<unknown>> | BaseTransformation<any, unknown, BaseIssue<unknown>> | BaseTransformationAsync<any, unknown, BaseIssue<unknown>>;
/**
 * Other type.
 */
interface Other<TContext extends Context> {
    input?: unknown | undefined;
    expected?: string | undefined;
    received?: string | undefined;
    message?: ErrorMessage<InferIssue<TContext>> | undefined;
    path?: [IssuePathItem, ...IssuePathItem[]] | undefined;
    issues?: [BaseIssue<InferInput<TContext>>, ...BaseIssue<InferInput<TContext>>[]] | undefined;
}
/**
 * Adds an issue to the dataset.
 *
 * @param context The issue context.
 * @param label The issue label.
 * @param dataset The input dataset.
 * @param config The configuration.
 * @param other The optional props.
 *
 * @internal
 */
declare function _addIssue<const TContext extends Context>(context: TContext, label: string, dataset: Dataset<unknown, BaseIssue<unknown>>, config: Config<InferIssue<TContext>>, other?: Other<TContext>): void;

/**
 * Checks whether a string with numbers corresponds to the luhn algorithm.
 *
 * @param input The input to be checked.
 *
 * @returns Whether input is valid.
 *
 * @internal
 */
declare function _isLuhnAlgo(input: string): boolean;

/**
 * Disallows inherited object properties and prevents object prototype
 * pollution by disallowing certain keys.
 *
 * @param object The object to check.
 * @param key The key to check.
 *
 * @returns Whether the key is allowed.
 *
 * @internal
 */
declare function _isValidObjectKey(object: object, key: string): boolean;

/**
 * Joins multiple `expects` values with the given separator.
 *
 * @param values The `expects` values.
 * @param separator The separator.
 *
 * @returns The joined `expects` property.
 *
 * @internal
 */
declare function _joinExpects(values: string[], separator: '&' | '|'): string;

/**
 * Stringifies an unknown input to a literal or type string.
 *
 * @param input The unknown input.
 *
 * @returns A literal or type string.
 *
 * @internal
 */
declare function _stringify(input: unknown): string;

/**
 * Creates an object entries definition from a list of keys and a schema.
 *
 * @param list A list of keys.
 * @param schema The schema of the keys.
 *
 * @returns The object entries.
 */
declare function entriesFromList<const TList extends readonly (string | number | symbol)[], const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(list: TList, schema: TSchema): Record<TList[number], TSchema>;

/**
 * Creates and returns the dot path of an issue if possible.
 *
 * @param issue The issue to get the dot path from.
 *
 * @returns The dot path or null.
 */
declare function getDotPath(issue: BaseIssue<unknown>): string | null;
/**
 * Creates and returns the dot path of an issue if possible.
 *
 * @param issue The issue to get the dot path from.
 *
 * @returns The dot path or null.
 */
declare function getDotPath<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(issue: InferIssue<TSchema>): IssueDotPath<TSchema> | null;

/**
 * A generic type guard to check the kind of an object.
 *
 * @param kind The kind to check for.
 * @param object The object to check.
 *
 * @returns Whether it matches.
 */
declare function isOfKind<const TKind extends TObject['kind'], const TObject extends {
    kind: string;
}>(kind: TKind, object: TObject): object is Extract<TObject, {
    kind: TKind;
}>;

/**
 * A generic type guard to check the type of an object.
 *
 * @param type The type to check for.
 * @param object The object to check.
 *
 * @returns Whether it matches.
 */
declare function isOfType<const TType extends TObject['type'], const TObject extends {
    type: string;
}>(type: TType, object: TObject): object is Extract<TObject, {
    type: TType;
}>;

/**
 * A type guard to check if an error is a ValiError.
 *
 * @param error The error to check.
 *
 * @returns Whether its a ValiError.
 */
declare function isValiError<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>(error: unknown): error is ValiError<TSchema>;

/**
 * A Valibot error with useful information.
 */
declare class ValiError<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>> extends Error {
    /**
     * The error issues.
     */
    readonly issues: [InferIssue<TSchema>, ...InferIssue<TSchema>[]];
    /**
     * Creates a Valibot error with useful information.
     *
     * @param issues The error issues.
     */
    constructor(issues: [InferIssue<TSchema>, ...InferIssue<TSchema>[]]);
}

export { type AnySchema, type ArrayInput, type ArrayIssue, type ArrayPathItem, type ArrayRequirement, type ArraySchema, type ArraySchemaAsync, type AwaitActionAsync, BASE64_REGEX, BIC_REGEX, type Base64Action, type Base64Issue, type BaseIssue, type BaseMetadata, type BaseSchema, type BaseSchemaAsync, type BaseTransformation, type BaseTransformationAsync, type BaseValidation, type BaseValidationAsync, type BicAction, type BicIssue, type BigintIssue, type BigintSchema, type BlobIssue, type BlobSchema, type BooleanIssue, type BooleanSchema, type Brand, type BrandAction, type BrandName, BrandSymbol, type BytesAction, type BytesIssue, CUID2_REGEX, type CheckAction, type CheckActionAsync, type CheckIssue, type CheckItemsAction, type CheckItemsIssue, type Class, type Config, type ContentInput, type ContentRequirement, type CreditCardAction, type CreditCardIssue, type Cuid2Action, type Cuid2Issue, type CustomIssue, type CustomSchema, type CustomSchemaAsync, DECIMAL_REGEX, type Dataset, type DateIssue, type DateSchema, type DecimalAction, type DecimalIssue, type DeepPickN, type Default, type DefaultAsync, type DefaultValue, type DescriptionAction, EMAIL_REGEX, EMOJI_REGEX, type EmailAction, type EmailIssue, type EmojiAction, type EmojiIssue, type EmptyAction, type EmptyIssue, type EndsWithAction, type EndsWithIssue, type Enum, type EnumIssue, type EnumSchema, type ErrorMessage, type EveryItemAction, type EveryItemIssue, type ExcludesAction, type ExcludesIssue, type Fallback, type FallbackAsync, type FileIssue, type FileSchema, type FilterItemsAction, type FindItemAction, type FiniteAction, type FiniteIssue, type FirstTupleItem, type FlatErrors, type FunctionIssue, type FunctionSchema, type GenericIssue, type GenericMetadata, type GenericSchema, type GenericSchemaAsync, type GenericTransformation, type GenericTransformationAsync, type GenericValidation, type GenericValidationAsync, type GlobalConfig, HEXADECIMAL_REGEX, HEX_COLOR_REGEX, type HashAction, type HashIssue, type HashType, type HexColorAction, type HexColorIssue, type HexadecimalAction, type HexadecimalIssue, IMEI_REGEX, IPV4_REGEX, IPV6_REGEX, IP_REGEX, ISO_DATE_REGEX, ISO_DATE_TIME_REGEX, ISO_TIMESTAMP_REGEX, ISO_TIME_REGEX, ISO_TIME_SECOND_REGEX, ISO_WEEK_REGEX, type ImeiAction, type ImeiIssue, type IncludesAction, type IncludesIssue, type InferDefault, type InferDefaults, type InferFallback, type InferFallbacks, type InferInput, type InferIntersectInput, type InferIntersectOutput, type InferIssue, type InferMapInput, type InferMapOutput, type InferNonNullableInput, type InferNonNullableIssue, type InferNonNullableOutput, type InferNonNullishInput, type InferNonNullishIssue, type InferNonNullishOutput, type InferNonOptionalInput, type InferNonOptionalIssue, type InferNonOptionalOutput, type InferNullableOutput, type InferNullishOutput, type InferObjectInput, type InferObjectIssue, type InferObjectOutput, type InferOptionalOutput, type InferOutput, type InferRecordInput, type InferRecordOutput, type InferSetInput, type InferSetOutput, type InferTupleInput, type InferTupleIssue, type InferTupleOutput, type InferUndefinedableOutput, type InferVariantIssue, type InstanceIssue, type InstanceSchema, type IntegerAction, type IntegerIssue, type IntersectIssue, type IntersectOptions, type IntersectOptionsAsync, type IntersectSchema, type IntersectSchemaAsync, type IpAction, type IpIssue, type Ipv4Action, type Ipv4Issue, type Ipv6Action, type Ipv6Issue, type IsoDateAction, type IsoDateIssue, type IsoDateTimeAction, type IsoDateTimeIssue, type IsoTimeAction, type IsoTimeIssue, type IsoTimeSecondAction, type IsoTimeSecondIssue, type IsoTimestampAction, type IsoTimestampIssue, type IsoWeekAction, type IsoWeekIssue, type IssueDotPath, type IssuePathItem, type LastTupleItem, type LazySchema, type LazySchemaAsync, type LengthAction, type LengthInput, type LengthIssue, type Literal, type LiteralIssue, type LiteralSchema, type LooseObjectIssue, type LooseObjectSchema, type LooseObjectSchemaAsync, type LooseTupleIssue, type LooseTupleSchema, type LooseTupleSchemaAsync, MAC48_REGEX, MAC64_REGEX, MAC_REGEX, type Mac48Action, type Mac48Issue, type Mac64Action, type Mac64Issue, type MacAction, type MacIssue, type MapIssue, type MapItemsAction, type MapPathItem, type MapSchema, type MapSchemaAsync, type MarkOptional, type MaxBytesAction, type MaxBytesIssue, type MaxLengthAction, type MaxLengthIssue, type MaxSizeAction, type MaxSizeIssue, type MaxValueAction, type MaxValueIssue, type MaybePromise, type MaybeReadonly, type MimeTypeAction, type MimeTypeIssue, type MinBytesAction, type MinBytesIssue, type MinLengthAction, type MinLengthIssue, type MinSizeAction, type MinSizeIssue, type MinValueAction, type MinValueIssue, type MultipleOfAction, type MultipleOfIssue, NANO_ID_REGEX, type NanIssue, type NanSchema, type NanoIDAction, type NanoIDIssue, type NeverIssue, type NeverSchema, type NoPipe, type NonEmptyAction, type NonEmptyIssue, type NonNullable$1 as NonNullable, type NonNullableIssue, type NonNullableSchema, type NonNullableSchemaAsync, type NonNullish, type NonNullishIssue, type NonNullishSchema, type NonNullishSchemaAsync, type NonOptional, type NonOptionalIssue, type NonOptionalSchema, type NonOptionalSchemaAsync, type NormalizeAction, type NormalizeForm, type NotBytesAction, type NotBytesIssue, type NotLengthAction, type NotLengthIssue, type NotSizeAction, type NotSizeIssue, type NotValueAction, type NotValueIssue, type NullIssue, type NullSchema, type NullableSchema, type NullableSchemaAsync, type NullishSchema, type NullishSchemaAsync, type NumberIssue, type NumberSchema, OCTAL_REGEX, type ObjectEntries, type ObjectEntriesAsync, type ObjectIssue, type ObjectKeys, type ObjectPathItem, type ObjectSchema, type ObjectSchemaAsync, type ObjectWithRestIssue, type ObjectWithRestSchema, type ObjectWithRestSchemaAsync, type OctalAction, type OctalIssue, type OptionalSchema, type OptionalSchemaAsync, type Parser, type ParserAsync, type PartialCheckAction, type PartialCheckActionAsync, type PartialCheckIssue, type PathKeys, type PicklistIssue, type PicklistOptions, type PicklistSchema, type PipeAction, type PipeActionAsync, type PipeItem, type PipeItemAsync, type Prettify, type PromiseIssue, type PromiseSchema, type RawCheckAction, type RawCheckActionAsync, type RawCheckIssue, type RawTransformAction, type RawTransformActionAsync, type RawTransformIssue, type ReadonlyAction, type RecordIssue, type RecordSchema, type RecordSchemaAsync, type ReduceItemsAction, type RegexAction, type RegexIssue, type SafeIntegerAction, type SafeIntegerIssue, type SafeParseResult, type SafeParser, type SafeParserAsync, type SchemaWithFallback, type SchemaWithFallbackAsync, type SchemaWithOmit, type SchemaWithPartial, type SchemaWithPartialAsync, type SchemaWithPick, type SchemaWithPipe, type SchemaWithPipeAsync, type SchemaWithRequired, type SchemaWithRequiredAsync, type SetIssue, type SetPathItem, type SetSchema, type SetSchemaAsync, type SizeAction, type SizeInput, type SizeIssue, type SomeItemAction, type SomeItemIssue, type SortItemsAction, type StartsWithAction, type StartsWithIssue, type StrictObjectIssue, type StrictObjectSchema, type StrictObjectSchemaAsync, type StrictTupleIssue, type StrictTupleSchema, type StrictTupleSchemaAsync, type StringIssue, type StringSchema, type SymbolIssue, type SymbolSchema, type ToLowerCaseAction, type ToMaxValueAction, type ToMinValueAction, type ToUpperCaseAction, type TransformAction, type TransformActionAsync, type TrimAction, type TrimEndAction, type TrimStartAction, type TupleIssue, type TupleItems, type TupleItemsAsync, type TupleSchema, type TupleSchemaAsync, type TupleWithRestIssue, type TupleWithRestSchema, type TupleWithRestSchemaAsync, type TypedDataset, ULID_REGEX, UUID_REGEX, type UlidAction, type UlidIssue, type UndefinedIssue, type UndefinedSchema, type UndefinedableSchema, type UndefinedableSchemaAsync, type UnionIssue, type UnionOptions, type UnionOptionsAsync, type UnionSchema, type UnionSchemaAsync, type UnionToIntersect, type UnionToTuple, type UnknownPathItem, type UnknownSchema, type UntypedDataset, type UrlAction, type UrlIssue, type UuidAction, type UuidIssue, ValiError, type ValueAction, type ValueInput, type ValueIssue, type VariantIssue, type VariantOptionSchema, type VariantOptionSchemaAsync, type VariantOptions, type VariantOptionsAsync, type VariantSchema, type VariantSchemaAsync, type VoidIssue, type VoidSchema, _addIssue, _isLuhnAlgo, _isValidObjectKey, _joinExpects, _stringify, any, array, arrayAsync, awaitAsync, base64, bic, bigint, blob, boolean, brand, bytes, check, checkAsync, checkItems, config, creditCard, cuid2, custom, customAsync, date, decimal, deleteGlobalConfig, deleteGlobalMessage, deleteSchemaMessage, deleteSpecificMessage, description, email, emoji, empty, endsWith, entriesFromList, enum_ as enum, enum_, everyItem, excludes, fallback, fallbackAsync, file, filterItems, findItem, finite, flatten, forward, forwardAsync, function_ as function, function_, getDefault, getDefaults, getDefaultsAsync, getDotPath, getFallback, getFallbacks, getFallbacksAsync, getGlobalConfig, getGlobalMessage, getSchemaMessage, getSpecificMessage, hash, hexColor, hexadecimal, imei, includes, instance, integer, intersect, intersectAsync, ip, ipv4, ipv6, is, isOfKind, isOfType, isValiError, isoDate, isoDateTime, isoTime, isoTimeSecond, isoTimestamp, isoWeek, keyof, lazy, lazyAsync, length, literal, looseObject, looseObjectAsync, looseTuple, looseTupleAsync, mac, mac48, mac64, map, mapAsync, mapItems, maxBytes, maxLength, maxSize, maxValue, mimeType, minBytes, minLength, minSize, minValue, multipleOf, nan, nanoid, never, nonEmpty, nonNullable, nonNullableAsync, nonNullish, nonNullishAsync, nonOptional, nonOptionalAsync, normalize, notBytes, notLength, notSize, notValue, null_ as null, null_, nullable, nullableAsync, nullish, nullishAsync, number, object, objectAsync, objectWithRest, objectWithRestAsync, octal, omit, optional, optionalAsync, parse, parseAsync, parser, parserAsync, partial, partialAsync, partialCheck, partialCheckAsync, pick, picklist, pipe, pipeAsync, promise, rawCheck, rawCheckAsync, rawTransform, rawTransformAsync, readonly, record, recordAsync, reduceItems, regex, required, requiredAsync, safeInteger, safeParse, safeParseAsync, safeParser, safeParserAsync, set, setAsync, setGlobalConfig, setGlobalMessage, setSchemaMessage, setSpecificMessage, size, someItem, sortItems, startsWith, strictObject, strictObjectAsync, strictTuple, strictTupleAsync, string, symbol, toLowerCase, toMaxValue, toMinValue, toUpperCase, transform, transformAsync, trim, trimEnd, trimStart, tuple, tupleAsync, tupleWithRest, tupleWithRestAsync, ulid, undefined_ as undefined, undefined_, undefinedable, undefinedableAsync, union, unionAsync, unknown, unwrap, url, uuid, value, variant, variantAsync, void_ as void, void_ };
