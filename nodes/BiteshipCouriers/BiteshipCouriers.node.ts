import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class BiteshipCouriers implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Biteship Couriers',
        name: 'biteshipCouriers',
        icon: 'file:biteship.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Manage courier-related operations with Biteship API',
        defaults: {
            name: 'Biteship Couriers',
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
                        name: 'Get Couriers',
                        value: 'getCouriers',
                        description: 'Get list of available couriers',
                        action: 'Get couriers',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/v1/couriers',
                            },
                        },
                    },
                ],
                default: 'getCouriers',
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
                if (operation === 'getCouriers') {
                    const response = await this.helpers.request({
                        method: 'GET',
                        uri: '/v1/couriers',
                        headers: {
                            Authorization: `Bearer ${credentials.apiKey}`,
                        },
                        json: true,
                    });

                    const simplifyResponse = this.getNodeParameter('simplifyResponse', i, false) as boolean;
                    if (simplifyResponse) {
                        const simplified = response.couriers?.map((courier: any) => ({
                            code: courier.code,
                            name: courier.name,
                            types: courier.available_types,
                        }));
                        returnData.push({ json: simplified });
                    } else {
                        returnData.push({ json: response });
                    }
                }
            } catch (error) {
                throw new Error(`Error executing Biteship Couriers ${operation}: ${error.message}`);
            }
        }

        return [returnData];
    }
}

module.exports = { BiteshipCouriers };