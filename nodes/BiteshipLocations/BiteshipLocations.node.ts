import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class BiteshipLocations implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Biteship Locations',
        name: 'biteshipLocations',
        icon: 'file:biteship.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Manage location-related operations with Biteship API',
        defaults: {
            name: 'Biteship Locations',
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
                        name: 'Search Locations',
                        value: 'searchLocations',
                        description: 'Search locations by query',
                        action: 'Search locations',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/v1/locations',
                            },
                        },
                    },
                    {
                        name: 'Get Location Details',
                        value: 'getLocationDetails',
                        description: 'Get details of a specific location by ID',
                        action: 'Get location details',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/v1/locations/{{$parameter["locationId"]}}',
                            },
                        },
                    },
                ],
                default: 'searchLocations',
            },
            {
                displayName: 'Location Query',
                name: 'locationQuery',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['searchLocations'],
                    },
                },
                default: '',
                description: 'Query to search locations (e.g., city, postal code)',
                required: true,
                routing: {
                    request: {
                        qs: {
                            q: '={{$value}}',
                        },
                    },
                },
            },
            {
                displayName: 'Location ID',
                name: 'locationId',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['getLocationDetails'],
                    },
                },
                default: '',
                description: 'ID of the location to retrieve',
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
                if (operation === 'searchLocations') {
                    const locationQuery = this.getNodeParameter('locationQuery', i) as string;
                    response = await this.helpers.request({
                        method: 'GET',
                        uri: '/v1/locations',
                        headers: {
                            Authorization: `Bearer ${credentials.apiKey}`,
                        },
                        qs: { q: locationQuery },
                        json: true,
                    });
                } else if (operation === 'getLocationDetails') {
                    const locationId = this.getNodeParameter('locationId', i) as string;
                    response = await this.helpers.request({
                        method: 'GET',
                        uri: `/v1/locations/${locationId}`,
                        headers: {
                            Authorization: `Bearer ${credentials.apiKey}`,
                        },
                        json: true,
                    });
                }

                const simplifyResponse = this.getNodeParameter('simplifyResponse', i, false) as boolean;
                if (simplifyResponse) {
                    const simplified = operation === 'searchLocations'
                        ? { locations: response.locations?.map((loc: any) => ({ id: loc.id, name: loc.name, postalCode: loc.postal_code })) }
                        : { id: response.id, name: response.name, postalCode: response.postal_code };
                    returnData.push({ json: simplified });
                } else {
                    returnData.push({ json: response });
                }
            } catch (error) {
                throw new Error(`Error executing Biteship Locations ${operation}: ${error.message}`);
            }
        }

        return [returnData];
    }
}

module.exports = { BiteshipLocations };