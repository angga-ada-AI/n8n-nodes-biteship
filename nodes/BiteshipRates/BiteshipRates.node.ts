import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class BiteshipRates implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Biteship Rates',
        name: 'biteshipRates',
        icon: 'file:biteship.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
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
                displayName: 'Origin Postal Code',
                name: 'originPostalCode',
                type: 'number',
                default: 0,
                description: 'Origin postal code',
                required: true,
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
                description: 'Destination postal code',
                required: true,
                routing: {
                    request: {
                        body: {
                            destination_postal_code: '={{$value}}',
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
                                description: 'Item name',
                            },
                            {
                                displayName: 'Value (IDR)',
                                name: 'value',
                                type: 'number',
                                default: 0,
                                description: 'Item value in IDR',
                            },
                            {
                                displayName: 'Weight (grams)',
                                name: 'weight',
                                type: 'number',
                                default: 0,
                                description: 'Item weight in grams',
                            },
                            {
                                displayName: 'Quantity',
                                name: 'quantity',
                                type: 'number',
                                default: 1,
                                description: 'Item quantity',
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
        const operation = this.getNodeParameter('operation', 0) as string;
        const credentials = await this.getCredentials('biteshipApi');

        for (let i = 0; i < items.length; i++) {
            try {
                if (operation === 'getRates') {
                    const body: { [key: string]: any } = {
                        origin_postal_code: this.getNodeParameter('originPostalCode', i) as number,
                        destination_postal_code: this.getNodeParameter('destinationPostalCode', i) as number,
                        items: (this.getNodeParameter('items', i) as any).item,
                    };

                    const response = await this.helpers.request({
                        method: 'POST',
                        uri: '/v1/rates/couriers',
                        headers: {
                            Authorization: `Bearer ${credentials.apiKey}`,
                        },
                        body,
                        json: true,
                    });

                    const simplifyResponse = this.getNodeParameter('simplifyResponse', i, false) as boolean;
                    if (simplifyResponse) {
                        const simplified = response.rates?.map((rate: any) => ({
                            courier: rate.company,
                            service: rate.service_type,
                            price: rate.price,
                            estimatedDelivery: rate.estimated_days,
                        }));
                        returnData.push({ json: simplified });
                    } else {
                        returnData.push({ json: response });
                    }
                }
            } catch (error) {
                throw new Error(`Error executing Biteship Rates ${operation}: ${error.message}`);
            }
        }

        return [returnData];
    }
}

module.exports = { BiteshipRates };