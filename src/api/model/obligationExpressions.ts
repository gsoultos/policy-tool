/**
 * Policy Tool Service
 * Policy Tool Service Swagger Specification.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: soultos@protonmail.ch
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from './models';
import { ObligationExpression } from './obligationExpression';

/**
* Can be null
*/
export class ObligationExpressions {
    /**
    * Obligation expressions
    */
    'obligationExpressions': Array<ObligationExpression>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "obligationExpressions",
            "baseName": "obligationExpressions",
            "type": "Array<ObligationExpression>"
        }    ];

    static getAttributeTypeMap() {
        return ObligationExpressions.attributeTypeMap;
    }
}

