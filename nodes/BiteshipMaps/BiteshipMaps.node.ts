import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class BiteshipMaps implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Biteship Maps',
		name: 'biteshipMaps',
		icon: 'file:biteship.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Manage map-related operations with Biteship API',
		defaults: {
			name: 'Biteship Maps',
		},
		inputs: ['main' as NodeConnectionType],
		outputs: ['main' as NodeConnectionType],
		credentials: [
			{
				name: 'biteshipApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Coordinates',
						value: 'getCoordinates',
						description: 'Get coordinates from address',
						action: 'Get coordinates',
					},
					{
						name: 'Get Area',
						value: 'getArea',
						description: 'Get area details by ID or query',
						action: 'Get area',
					},
				],
				default: 'getCoordinates',
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getCoordinates'],
					},
				},
				default: '',
				description: 'Address to convert to coordinates',
				required: true,
			},
			{
				displayName: 'Area Query',
				name: 'areaQuery',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getArea'],
					},
				},
				default: '',
				description: 'Query to search for areas (e.g., city or postal code)',
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

		for (let i = 0; i < items.length; i++) {
			try {
				let response;
				if (operation === 'getCoordinates') {
					const address = this.getNodeParameter('address', i) as string;
					if (!address) {
						throw new Error('Address is required');
					}

					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'biteshipApi',
						{
							method: 'GET',
							url: 'https://api.biteship.com/v1/maps/coordinates',
							qs: { address },
							json: true,
						}
					);
				} else if (operation === 'getArea') {
					const areaQuery = this.getNodeParameter('areaQuery', i) as string;
					if (!areaQuery) {
						throw new Error('Area query is required');
					}

					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'biteshipApi',
						{
							method: 'GET',
							url: 'https://api.biteship.com/v1/maps/areas',
							qs: { q: areaQuery },
							json: true,
						}
					);
				} else {
					throw new Error(`Unknown operation: ${operation}`);
				}

				const simplifyResponse = this.getNodeParameter('simplifyResponse', i, false) as boolean;
				if (simplifyResponse) {
					const simplified = operation === 'getCoordinates'
						? { coordinates: response.coordinates, address: response.address }
						: { areas: response.areas?.map((area: any) => ({ id: area.id, name: area.name })) };
					returnData.push({ json: { success: true, data: simplified } });
				} else {
					returnData.push({ json: { success: true, data: response } });
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

module.exports = { BiteshipMaps };