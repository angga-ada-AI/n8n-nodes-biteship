import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class BiteshipTracking implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Biteship Tracking',
        name: 'biteshipTracking',
        icon: 'file:biteship.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Track shipments with Biteship API',
        defaults: {
            name: 'Biteship Tracking',
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
                        name: 'Track by Order ID',
                        value: 'trackByOrderId',
                        description: 'Track shipment by order ID',
                        action: 'Track by order ID',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/v1/trackings/{{$parameter["orderId"]}}',
                            },
                        },
                    },
                    {
                        name: 'Track by Waybill',
                        value: 'trackByWaybill',
                        description: 'Track shipment by waybill ID and courier code',
                        action: 'Track by waybill',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/v1/trackings/{{$parameter["waybillId"]}}/couriers/{{$parameter["courierCode"]}}',
                            },
                        },
                    },
                ],
                default: 'trackByOrderId',
            },
            {
                displayName: 'Order ID',
                name: 'orderId',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['trackByOrderId'],
                    },
                },
                default: '',
                description: 'The ID of the order to track',
                required: true,
            },
            {
                displayName: 'Waybill ID',
                name: 'waybillId',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['trackByWaybill'],
                    },
                },
                default: '',
                description: 'The waybill ID of the shipment',
                required: true,
            },
            {
                displayName: 'Courier Code',
                name: 'courierCode',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['trackByWaybill'],
                    },
                },
                default: '',
                description: 'The courier code (e.g., jne, sicepat)',
                required: true,
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
                if (operation === 'trackByOrderId') {
                    const orderId = this.getNodeParameter('orderId', i) as string;
                    response = await this.helpers.request({
                        method: 'GET',
                        uri: `/v1/trackings/${orderId}`,
                        headers: {
                            Authorization: `Bearer ${credentials.apiKey}`,
                        },
                        json: true,
                    });
                } else if (operation === 'trackByWaybill') {
                    const waybillId = this.getNodeParameter('waybillId', i) as string;
                    const courierCode = this.getNodeParameter('courierCode', i) as string;
                    response = await this.helpers.request({
                        method: 'GET',
                        uri: `/v1/trackings/${waybillId}/couriers/${courierCode}`,
                        headers: {
                            Authorization: `Bearer ${credentials.apiKey}`,
                        },
                        json: true,
                    });
                }

                const simplifyResponse = this.getNodeParameter('simplifyResponse', i, false) as boolean;
                if (simplifyResponse) {
                    const simplified = {
                        trackingId: response.tracking_id,
                        status: response.status,
                        courier: response.courier?.company,
                        history: response.history?.map((event: any) => ({
                            status: event.status,
                            timestamp: event.timestamp,
                        })),
                    };
                    returnData.push({ json: simplified });
                } else {
                    returnData.push({ json: response });
                }
            } catch (error) {
                throw new Error(`Error executing Biteship Tracking ${operation}: ${error.message}`);
            }
        }

        return [returnData];
    }
}

module.exports = { BiteshipTracking };