import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class BiteshipOrders implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Biteship Orders',
        name: 'biteshipOrders',
        icon: 'file:biteship.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Manage shipping orders with Biteship API',
        defaults: {
            name: 'Biteship Orders',
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
                        name: 'Create',
                        value: 'create',
                        description: 'Create a new shipping order',
                        action: 'Create order',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/v1/orders',
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get order details by ID',
                        action: 'Get order',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/v1/orders/{{$parameter["orderId"]}}',
                            },
                        },
                    },
                    {
                        name: 'Cancel',
                        value: 'cancel',
                        description: 'Cancel an existing order',
                        action: 'Cancel order',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '=/v1/orders/{{$parameter["orderId"]}}/cancel',
                            },
                        },
                    },
                ],
                default: 'create',
            },
            {
                displayName: 'Order ID',
                name: 'orderId',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['get', 'cancel'],
                    },
                },
                default: '',
                description: 'The ID of the order',
                required: true,
            },
            {
                displayName: 'Origin Contact Name',
                name: 'originContactName',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['create'],
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
                        operation: ['create'],
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
                        operation: ['create'],
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
                displayName: 'Destination Contact Name',
                name: 'destinationContactName',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Destination contact person name',
                required: true,
                routing: {
                    request: {
                        body: {
                            destination_contact_name: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Destination Contact Phone',
                name: 'destinationContactPhone',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Destination contact phone number',
                required: true,
                routing: {
                    request: {
                        body: {
                            destination_contact_phone: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Destination Address',
                name: 'destinationAddress',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Destination full address',
                required: true,
                routing: {
                    request: {
                        body: {
                            destination_address: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Location Type',
                name: 'locationType',
                type: 'options',
                displayOptions: {
                    show: {
                        operation: ['create'],
                    },
                },
                options: [
                    {
                        name: 'Postal Code',
                        value: 'postalCode',
                        description: 'Use postal codes',
                    },
                    {
                        name: 'Coordinates',
                        value: 'coordinates',
                        description: 'Use latitude and longitude',
                    },
                    {
                        name: 'Area ID',
                        value: 'areaId',
                        description: 'Use Biteship area IDs',
                    },
                ],
                default: 'postalCode',
                description: 'How to specify locations',
            },
            {
                displayName: 'Origin Postal Code',
                name: 'originPostalCode',
                type: 'number',
                displayOptions: {
                    show: {
                        operation: ['create'],
                        locationType: ['postalCode'],
                    },
                },
                default: 0,
                description: 'Origin postal code',
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
                displayOptions: {
                    show: {
                        operation: ['create'],
                        locationType: ['postalCode'],
                    },
                },
                default: 0,
                description: 'Destination postal code',
                routing: {
                    request: {
                        body: {
                            destination_postal_code: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Origin Coordinates',
                name: 'originCoordinates',
                type: 'fixedCollection',
                displayOptions: {
                    show: {
                        operation: ['create'],
                        locationType: ['coordinates'],
                    },
                },
                default: {},
                options: [
                    {
                        name: 'coordinate',
                        displayName: 'Coordinate',
                        values: [
                            {
                                displayName: 'Latitude',
                                name: 'latitude',
                                type: 'number',
                                default: 0,
                                description: 'Latitude',
                            },
                            {
                                displayName: 'Longitude',
                                name: 'longitude',
                                type: 'number',
                                default: 0,
                                description: 'Longitude',
                            },
                        ],
                    },
                ],
                routing: {
                    request: {
                        body: {
                            origin_coordinate: '={{$value.coordinate}}',
                        },
                    },
                },
            },
            {
                displayName: 'Destination Coordinates',
                name: 'destinationCoordinates',
                type: 'fixedCollection',
                displayOptions: {
                    show: {
                        operation: ['create'],
                        locationType: ['coordinates'],
                    },
                },
                default: {},
                options: [
                    {
                        name: 'coordinate',
                        displayName: 'Coordinate',
                        values: [
                            {
                                displayName: 'Latitude',
                                name: 'latitude',
                                type: 'number',
                                default: 0,
                                description: 'Latitude',
                            },
                            {
                                displayName: 'Longitude',
                                name: 'longitude',
                                type: 'number',
                                default: 0,
                                description: 'Longitude',
                            },
                        ],
                    },
                ],
                routing: {
                    request: {
                        body: {
                            destination_coordinate: '={{$value.coordinate}}',
                        },
                    },
                },
            },
            {
                displayName: 'Origin Area ID',
                name: 'originAreaId',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['create'],
                        locationType: ['areaId'],
                    },
                },
                default: '',
                description: 'Origin area ID from Biteship',
                routing: {
                    request: {
                        body: {
                            origin_area_id: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Destination Area ID',
                name: 'destinationAreaId',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['create'],
                        locationType: ['areaId'],
                    },
                },
                default: '',
                description: 'Destination area ID from Biteship',
                routing: {
                    request: {
                        body: {
                            destination_area_id: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Delivery Type',
                name: 'deliveryType',
                type: 'options',
                displayOptions: {
                    show: {
                        operation: ['create'],
                    },
                },
                options: [
                    {
                        name: 'Now',
                        value: 'now',
                        description: 'Deliver now',
                    },
                    {
                        name: 'Schedule',
                        value: 'schedule',
                        description: 'Schedule delivery',
                    },
                ],
                default: 'now',
                description: 'Delivery type',
                routing: {
                    request: {
                        body: {
                            delivery_type: '={{$value}}',
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
                        operation: ['create'],
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
                                displayName: 'Description',
                                name: 'description',
                                type: 'string',
                                default: '',
                                description: 'Item description',
                            },
                            {
                                displayName: 'Category',
                                name: 'category',
                                type: 'string',
                                default: '',
                                description: 'Item category',
                            },
                            {
                                displayName: 'Value (IDR)',
                                name: 'value',
                                type: 'number',
                                default: 0,
                                description: 'Item value in IDR',
                            },
                            {
                                displayName: 'Length (cm)',
                                name: 'length',
                                type: 'number',
                                default: 0,
                                description: 'Item length in centimeters',
                            },
                            {
                                displayName: 'Width (cm)',
                                name: 'width',
                                type: 'number',
                                default: 0,
                                description: 'Item width in centimeters',
                            },
                            {
                                displayName: 'Height (cm)',
                                name: 'height',
                                type: 'number',
                                default: 0,
                                description: 'Item height in centimeters',
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
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        operation: ['create'],
                    },
                },
                options: [
                    {
                        displayName: 'Shipper Contact Name',
                        name: 'shipperContactName',
                        type: 'string',
                        default: '',
                        description: 'Shipper contact name',
                        routing: {
                            request: {
                                body: {
                                    shipper_contact_name: '={{$value}}',
                                },
                            },
                        },
                    },
                    {
                        displayName: 'Shipper Contact Phone',
                        name: 'shipperContactPhone',
                        type: 'string',
                        default: '',
                        description: 'Shipper contact phone',
                        routing: {
                            request: {
                                body: {
                                    shipper_contact_phone: '={{$value}}',
                                },
                            },
                        },
                    },
                    {
                        displayName: 'Shipper Contact Email',
                        name: 'shipperContactEmail',
                        type: 'string',
                        default: '',
                        description: 'Shipper contact email',
                        routing: {
                            request: {
                                body: {
                                    shipper_contact_email: '={{$value}}',
                                },
                            },
                        },
                    },
                    {
                        displayName: 'Shipper Organization',
                        name: 'shipperOrganization',
                        type: 'string',
                        default: '',
                        description: 'Shipper organization name',
                        routing: {
                            request: {
                                body: {
                                    shipper_organization: '={{$value}}',
                                },
                            },
                        },
                    },
                    {
                        displayName: 'Destination Contact Email',
                        name: 'destinationContactEmail',
                        type: 'string',
                        default: '',
                        description: 'Destination contact email',
                        routing: {
                            request: {
                                body: {
                                    destination_contact_email: '={{$value}}',
                                },
                            },
                        },
                    },
                    {
                        displayName: 'Origin Note',
                        name: 'originNote',
                        type: 'string',
                        default: '',
                        description: 'Additional note for origin location',
                        routing: {
                            request: {
                                body: {
                                    origin_note: '={{$value}}',
                                },
                            },
                        },
                    },
                    {
                        displayName: 'Destination Note',
                        name: 'destinationNote',
                        type: 'string',
                        default: '',
                        description: 'Additional note for destination location',
                        routing: {
                            request: {
                                body: {
                                    destination_note: '={{$value}}',
                                },
                            },
                        },
                    },
                    {
                        displayName: 'Order Note',
                        name: 'orderNote',
                        type: 'string',
                        default: '',
                        description: 'General order note',
                        routing: {
                            request: {
                                body: {
                                    order_note: '={{$value}}',
                                },
                            },
                        },
                    },
                    {
                        displayName: 'Courier Company',
                        name: 'courierCompany',
                        type: 'string',
                        default: '',
                        description: 'Specific courier company to use (e.g., jne, sicepat, grab)',
                        routing: {
                            request: {
                                body: {
                                    courier_company: '={{$value}}',
                                },
                            },
                        },
                    },
                    {
                        displayName: 'Courier Type',
                        name: 'courierType',
                        type: 'string',
                        default: '',
                        description: 'Courier service type (e.g., reg, instant, same_day)',
                        routing: {
                            request: {
                                body: {
                                    courier_type: '={{$value}}',
                                },
                            },
                        },
                    },
                    {
                        displayName: 'Courier Insurance (IDR)',
                        name: 'courierInsurance',
                        type: 'number',
                        default: 0,
                        description: 'Insurance amount in IDR',
                        routing: {
                            request: {
                                body: {
                                    courier_insurance: '={{$value}}',
                                },
                            },
                        },
                    },
                    {
                        displayName: 'Cash on Delivery Amount (IDR)',
                        name: 'destinationCashOnDelivery',
                        type: 'number',
                        default: 0,
                        description: 'Cash on delivery amount in IDR',
                        routing: {
                            request: {
                                body: {
                                    destination_cash_on_delivery: '={{$value}}',
                                },
                            },
                        },
                    },
                    {
                        displayName: 'Cash on Delivery Type',
                        name: 'destinationCashOnDeliveryType',
                        type: 'options',
                        options: [
                            {
                                name: '7 Days',
                                value: '7_days',
                                description: 'Settlement in 7 days',
                            },
                            {
                                name: '14 Days',
                                value: '14_days',
                                description: 'Settlement in 14 days',
                            },
                        ],
                        default: '7_days',
                        description: 'Cash on delivery settlement type',
                        routing: {
                            request: {
                                body: {
                                    destination_cash_on_delivery_type: '={{$value}}',
                                },
                            },
                        },
                    },
                    {
                        displayName: 'Reference ID',
                        name: 'referenceId',
                        type: 'string',
                        default: '',
                        description: 'Your internal reference ID for this order',
                        routing: {
                            request: {
                                body: {
                                    reference_id: '={{$value}}',
                                },
                            },
                        },
                    },
                    {
                        displayName: 'Metadata',
                        name: 'metadata',
                        type: 'json',
                        default: '{}',
                        description: 'Additional metadata as JSON object',
                        routing: {
                            request: {
                                body: {
                                    metadata: '={{JSON.parse($value)}}',
                                },
                            },
                        },
                    },
                ],
            },
            {
                displayName: 'Simplify Response',
                name: 'simplifyResponse',
                type: 'boolean',
                default: false,
                description: 'Whether to return a simplified version of the response instead of the raw data',
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
                if (operation === 'create') {
                    const body: { [key: string]: any } = {};
                    const locationType = this.getNodeParameter('locationType', i) as string;
                    const additionalFields = this.getNodeParameter('additionalFields', i, {}) as { [key: string]: any };

                    body.origin_contact_name = this.getNodeParameter('originContactName', i) as string;
                    body.origin_contact_phone = this.getNodeParameter('originContactPhone', i) as string;
                    body.origin_address = this.getNodeParameter('originAddress', i) as string;
                    body.destination_contact_name = this.getNodeParameter('destinationContactName', i) as string;
                    body.destination_contact_phone = this.getNodeParameter('destinationContactPhone', i) as string;
                    body.destination_address = this.getNodeParameter('destinationAddress', i) as string;
                    body.delivery_type = this.getNodeParameter('deliveryType', i) as string;
                    body.items = (this.getNodeParameter('items', i) as any).item;

                    if (locationType === 'postalCode') {
                        body.origin_postal_code = this.getNodeParameter('originPostalCode', i) as number;
                        body.destination_postal_code = this.getNodeParameter('destinationPostalCode', i) as number;
                    } else if (locationType === 'coordinates') {
                        body.origin_coordinate = (this.getNodeParameter('originCoordinates', i) as any).coordinate;
                        body.destination_coordinate = (this.getNodeParameter('destinationCoordinates', i) as any).coordinate;
                    } else if (locationType === 'areaId') {
                        body.origin_area_id = this.getNodeParameter('originAreaId', i) as string;
                        body.destination_area_id = this.getNodeParameter('destinationAreaId', i) as string;
                    }

                    Object.assign(body, additionalFields);

                    response = await this.helpers.request({
                        method: 'POST',
                        uri: '/v1/orders',
                        headers: {
                            Authorization: 'Bearer ' + credentials.apiKey,
                        },
                        body,
                        json: true,
                    });
                } else if (operation === 'get') {
                    const orderId = this.getNodeParameter('orderId', i) as string;
                    response = await this.helpers.request({
                        method: 'GET',
                        uri: `/v1/orders/${orderId}`,
                        headers: {
                            Authorization: 'Bearer ' + credentials.apiKey,
                        },
                        json: true,
                    });
                } else if (operation === 'cancel') {
                    const orderId = this.getNodeParameter('orderId', i) as string;
                    response = await this.helpers.request({
                        method: 'POST',
                        uri: `/v1/orders/${orderId}/cancel`,
                        headers: {
                            Authorization: 'Bearer ' + credentials.apiKey,
                        },
                        json: true,
                    });
                }

                const simplifyResponse = this.getNodeParameter('simplifyResponse', i, false) as boolean;
                if (simplifyResponse) {
                    const simplified = {
                        orderId: response.id,
                        status: response.status,
                        courier: response.courier?.company,
                        deliveryType: response.delivery_type,
                    };
                    returnData.push({ json: simplified });
                } else {
                    returnData.push({ json: response });
                }
            } catch (error) {
                throw new Error('Error executing Biteship Orders ' + operation + ': ' + error.message);
            }
        }

        return [returnData];
    }
}

module.exports = { BiteshipOrders };