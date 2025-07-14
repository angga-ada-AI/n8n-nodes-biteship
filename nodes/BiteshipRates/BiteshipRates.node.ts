import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class BiteshipRates implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Biteship Rates',
        name: 'biteshipRates',
        icon: 'file:biteship.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["requestType"]}}',
        description: 'Get shipping rates with Biteship API',
        defaults: {
            name: 'Biteship Rates',
        },
        inputs: ['main' as NodeConnectionType],
        outputs: ['main' as NodeConnectionType],
        credentials: [
            {
                name: 'biteshipApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://api.biteship.com',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Get Rates',
                        value: 'getRates',
                        description: 'Get available shipping rates',
                        action: 'Get shipping rates',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/v1/rates/couriers',
                            },
                        },
                    },
                ],
                default: 'getRates',
            },
            {
                displayName: 'Type of Request',
                name: 'requestType',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Rates by Coordinates',
                        value: 'coordinates',
                        description: 'Get rates using latitude and longitude coordinates',
                    },
                    {
                        name: 'Rates by Postal Code',
                        value: 'postalCode',
                        description: 'Get rates using postal codes',
                    },
                ],
                default: 'postalCode',
            },
            {
                displayName: 'Origin Latitude',
                name: 'originLatitude',
                type: 'number',
                default: 0,
                description: 'The origin latitude where items can be picked up',
                required: true,
                displayOptions: {
                    show: {
                        requestType: ['coordinates'],
                    },
                },
                routing: {
                    request: {
                        body: {
                            origin_latitude: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Origin Longitude',
                name: 'originLongitude',
                type: 'number',
                default: 0,
                description: 'The origin longitude where items can be picked up',
                required: true,
                displayOptions: {
                    show: {
                        requestType: ['coordinates'],
                    },
                },
                routing: {
                    request: {
                        body: {
                            origin_longitude: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Destination Latitude',
                name: 'destinationLatitude',
                type: 'number',
                default: 0,
                description: 'The destination latitude where items will be received',
                required: true,
                displayOptions: {
                    show: {
                        requestType: ['coordinates'],
                    },
                },
                routing: {
                    request: {
                        body: {
                            destination_latitude: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Destination Longitude',
                name: 'destinationLongitude',
                type: 'number',
                default: 0,
                description: 'The destination longitude where items will be received',
                required: true,
                displayOptions: {
                    show: {
                        requestType: ['coordinates'],
                    },
                },
                routing: {
                    request: {
                        body: {
                            destination_longitude: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Origin Postal Code',
                name: 'originPostalCode',
                type: 'number',
                default: 0,
                description: 'Postal code for the origin location',
                required: true,
                displayOptions: {
                    show: {
                        requestType: ['postalCode'],
                    },
                },
                routing: {
                    request: {
                        body: {
                            origin_postal_code: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Destination Postal Code',
                name: 'destinationPostalCode',
                type: 'number',
                default: 0,
                description: 'Postal code for the destination location',
                required: true,
                displayOptions: {
                    show: {
                        requestType: ['postalCode'],
                    },
                },
                routing: {
                    request: {
                        body: {
                            destination_postal_code: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Couriers',
                name: 'couriers',
                type: 'multiOptions',
                options: [
                    { name: 'GoJek', value: 'gojek' },
                    { name: 'Grab', value: 'grab' },
                    { name: 'Deliveree', value: 'deliveree' },
                    { name: 'JNE', value: 'jne' },
                    { name: 'TIKI', value: 'tiki' },
                    { name: 'Ninja Express', value: 'ninja' },
                    { name: 'Lion Parcel', value: 'lion' },
                    { name: 'Rara', value: 'rara' },
                    { name: 'SiCepat', value: 'sicepat' },
                    { name: 'J&T Express', value: 'jnt' },
                    { name: 'ID Express', value: 'idexpress' },
                    { name: 'RPX', value: 'rpx' },
                    { name: 'JDL', value: 'jdl' },
                    { name: 'Wahana', value: 'wahana' },
                    { name: 'Pos Indonesia', value: 'pos' },
                    { name: 'AnterAja', value: 'anteraja' },
                    { name: 'SAP Express', value: 'sap' },
                    { name: 'Paxel', value: 'paxel' },
                    { name: 'Borzo', value: 'borzo' },
                    { name: 'Lalamove', value: 'lalamove' },
                ],
                default: [],
                description: 'Select one or more couriers to query rates for, separated by commas',
                required: true,
                routing: {
                    request: {
                        body: {
                            couriers: '={{$value.join(",")}}',
                        },
                    },
                },
            },
            {
                displayName: 'Items',
                name: 'items',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: true,
                },
                default: {},
                description: 'The items of the shipment',
                options: [
                    {
                        name: 'item',
                        displayName: 'Item',
                        values: [
                            {
                                displayName: 'Name',
                                name: 'name',
                                type: 'string',
                                default: '',
                                description: 'Name of your package',
                                required: true,
                            },
                            {
                                displayName: 'Description',
                                name: 'description',
                                type: 'string',
                                default: '',
                                description: 'A description of your package (e.g., color, details)',
                            },
                            {
                                displayName: 'SKU',
                                name: 'sku',
                                type: 'string',
                                default: '',
                                description: 'Item SKU if available',
                            },
                            {
                                displayName: 'Value (IDR)',
                                name: 'value',
                                type: 'number',
                                default: 0,
                                description: 'The value of the item in IDR',
                                required: true,
                            },
                            {
                                displayName: 'Quantity',
                                name: 'quantity',
                                type: 'number',
                                default: 1,
                                description: 'The total number of items',
                                required: true,
                            },
                            {
                                displayName: 'Weight (grams)',
                                name: 'weight',
                                type: 'number',
                                default: 0,
                                description: 'The weight of the item in grams',
                                required: true,
                            },
                            {
                                displayName: 'Height (cm)',
                                name: 'height',
                                type: 'number',
                                default: 0,
                                description: 'The height of the item in centimeters',
                            },
                            {
                                displayName: 'Length (cm)',
                                name: 'length',
                                type: 'number',
                                default: 0,
                                description: 'The length of the item in centimeters',
                            },
                            {
                                displayName: 'Width (cm)',
                                name: 'width',
                                type: 'number',
                                default: 0,
                                description: 'The width of the item in centimeters',
                            },
                        ],
                    },
                ],
                routing: {
                    request: {
                        body: {
                            items: '={{$value.item}}',
                        },
                    },
                },
            },
            {
                displayName: 'Simplify Response',
                name: 'simplifyResponse',
                type: 'boolean',
                default: false,
                description: 'Whether to return a simplified version of the response',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const operation = this.getNodeParameter('operation', i) as string;
                const requestType = this.getNodeParameter('requestType', i) as string;
                const couriers = this.getNodeParameter('couriers', i) as string[];
                const itemsData = (this.getNodeParameter('items', i) as any).item;
                const simplifyResponse = this.getNodeParameter('simplifyResponse', i, false) as boolean;

                if (operation === 'getRates') {
                    const body: { [key: string]: any } = {
                        couriers: couriers.join(','),
                        items: itemsData,
                    };

                    if (requestType === 'coordinates') {
                        body.origin_latitude = this.getNodeParameter('originLatitude', i) as number;
                        body.origin_longitude = this.getNodeParameter('originLongitude', i) as number;
                        body.destination_latitude = this.getNodeParameter('destinationLatitude', i) as number;
                        body.destination_longitude = this.getNodeParameter('destinationLongitude', i) as number;
                    } else if (requestType === 'postalCode') {
                        body.origin_postal_code = this.getNodeParameter('originPostalCode', i) as number;
                        body.destination_postal_code = this.getNodeParameter('destinationPostalCode', i) as number;
                    }

                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this,
                        'biteshipApi',
                        {
                            method: 'POST',
                            url: '/v1/rates/couriers',
                            body,
                            json: true,
                        }
                    );

                    if (simplifyResponse) {
                        const simplified = response.rates?.map((rate: any) => ({
                            courier: rate.company,
                            service: rate.service_type,
                            price: rate.price,
                            estimatedDelivery: rate.estimated_days,
                        })) || [];
                        returnData.push({ json: { success: true, rates: simplified } });
                    } else {
                        returnData.push({ json: response });
                    }
                } else {
                    throw new Error(`Unknown operation: ${operation}`);
                }
            } catch (error) {
                returnData.push({
                    json: {
                        success: false,
                        error: error.message,
                        details: error.response?.data || null,
                    },
                });
            }
        }

        return [returnData];
    }
}

module.exports = { BiteshipRates };