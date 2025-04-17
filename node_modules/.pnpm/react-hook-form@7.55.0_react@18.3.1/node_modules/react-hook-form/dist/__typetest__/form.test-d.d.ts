import { z } from 'zod';
import { FieldValues, Resolver } from '../types';
export declare function mockZodResolver<Input extends FieldValues, Context, Output>(schema: z.ZodSchema<Output, any, Input>, schemaOptions?: Partial<z.ParseParams>, resolverOptions?: {
    mode?: 'async' | 'sync';
    raw?: false;
}): Resolver<Input, Context, Output>;
export declare function mockZodResolver<Input extends FieldValues, Context, Output>(schema: z.ZodSchema<Output, any, Input>, schemaOptions: Partial<z.ParseParams> | undefined, resolverOptions: {
    mode?: 'async' | 'sync';
    raw: true;
}): Resolver<Input, Context, Input>;
//# sourceMappingURL=form.test-d.d.ts.map