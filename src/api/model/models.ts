
export * from './adviceExpression';
export * from './adviceExpressions';
export * from './allOf';
export * from './anyOf';
export * from './attribute';
export * from './attributeAssignmentExpression';
export * from './attributeDesignatorType';
export * from './attributeSelectorType';
export * from './attributeValueType';
export * from './content';
export * from './defaultsType';
export * from './match';
export * from './modelError';
export * from './obligationExpression';
export * from './obligationExpressions';
export * from './policy';
export * from './policyIssuer';
export * from './rule';
export * from './target';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;

