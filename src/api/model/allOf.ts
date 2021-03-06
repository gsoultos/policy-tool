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
import { Match } from './match';

export class AllOf {
    /**
    * Matches
    */
    'matches': Array<Match>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "matches",
            "baseName": "matches",
            "type": "Array<Match>"
        }    ];

    static getAttributeTypeMap() {
        return AllOf.attributeTypeMap;
    }
}

