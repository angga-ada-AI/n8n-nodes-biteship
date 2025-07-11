import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class BiteshipDraftOrders implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Biteship Draft Orders',
        name: 'biteshipDraftOrders',
        icon: 'file:biteship.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Manage draft orders with Biteship API',
        defaults: {
            name: 'Biteship Draft Orders',
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
                        name: 'Create Draft',
                        value: 'createDraft',
                        description: 'Create a new draft order',
                        action: 'Create draft order',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/v1/draft-orders',
                            },
                        },
                    },
                    {
                        name: 'Get Draft',
                        value: 'getDraft',
                        description: 'Get draft order details by ID',
                        action: 'Get draft order',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/v1/draft-orders/{{$parameter["draftId"]}}',
                            },
                        },
                    },
                    {
                        name: 'Delete Draft',
                        value: 'deleteDraft',
                        description: 'Delete a draft order',
                        action: 'Delete draft order',
                        routing: {
                            request: {
                                method: 'DELETE',
                                url: '=/v1/draft-orders/{{$parameter["draftId"]}}',
                            },
                        },
                    },
                ],
                default: 'createDraft',
            },
            {
                displayName: 'Draft ID',
                name: 'draftId',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['getDraft', 'deleteDraft'],
                    },
                },
                default: '',
                description: 'The ID of the draft order',
                required: true,
            },
            {
                displayName: 'Origin Contact Name',
                name: 'originContactName',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['createDraft'],
                    },
                },
                default: '',
                description: 'Origin contact person name',
                required: true,
                routing: {
                    request: {
                        body: {
                            origin_contact_name: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Origin Contact Phone',
                name: 'originContactPhone',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['createDraft'],
                    },
                },
                default: '',
                description: 'Origin contact phone number',
                required: true,
                routing: {
                    request: {
                        body: {
                            origin_contact_phone: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Origin Address',
                name: 'originAddress',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['createDraft'],
                    },
                },
                default: '',
                description: 'Origin full address',
                required: true,
                routing: {
                    request: {
                        body: {
                            origin_address: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Origin Postal Code',
                name: 'originPostalCode',
                type: 'number',
                displayOptions: {
                    show: {
                        operation: ['createDraft'],
                    },
                },
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
                displayName: 'Items',
                name: 'items',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: true,
                },
                displayOptions: {
                    show: {
                        operation: ['createDraft'],
                    },
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
                let response;
                if (operation === 'createDraft') {
                    const body: { [key: string]: any } = {
                        origin_contact_name: this.getNodeParameter('originContactName', i) as string,
                        origin_contact_phone: this.getNodeParameter('originContactPhone', i) as string,
                        origin_address: this.getNodeParameter('originAddress', i) as string,
                        origin_postal_code: this.getNodeParameter('originPostalCode', i) as number,
                        items: (this.getNodeParameter('items', i) as any).item,
                    };

                    response = await this.helpers.request({
                        method: 'POST',
                        uri: '/v1/draft-orders',
                        headers: {
                            Authorization: `Bearer ${credentials.apiKey}`,
                        },
                        body,
                        json: true,
                    });
                } else if (operation === 'getDraft') {
                    const draftId = this.getNodeParameter('draftId', i) as string;
                    response = await this.helpers.request({
                        method: 'GET',
                        uri: `/v1/draft-orders/${draftId}`,
                        headers: {
                            Authorization: `Bearer ${credentials.apiKey}`,
                        },
                        json: true,
                    });
                } else if (operation === 'deleteDraft') {
                    const draftId = this.getNodeParameter('draftId', i) as string;
                    response = await this.helpers.request({
                        method: 'DELETE',
                        uri: `/v1/draft-orders/${draftId}`,
                        headers: {
                            Authorization: `Bearer ${credentials.apiKey}`,
                        },
                        json: true,
                    });
                }

                const simplifyResponse = this.getNodeParameter('simplifyResponse', i, false) as boolean;
                if (simplifyResponse) {
                    const simplified = {
                        draftId: response.id,
                        status: response.status,
                        items: response.items?.map((item: any) => ({ name: item.name, quantity: item.quantity })),
                    };
                    returnData.push({ json: simplified });
                } else {
                    returnData.push({ json: response });
                }
            } catch (error) {
                throw new Error(`Error executing Biteship Draft Orders ${operation}: ${error.message}`);
            }
        }

        return [returnData];
    }
}

module.exports = { BiteshipDraftOrders };