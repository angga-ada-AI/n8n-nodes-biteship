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
					},
					{
						name: 'Track by Waybill',
						value: 'trackByWaybill',
						description: 'Track shipment by waybill ID and courier code',
						action: 'Track by waybill',
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

		for (let i = 0; i < items.length; i++) {
			try {
				let response;
				if (operation === 'trackByOrderId') {
					const orderId = this.getNodeParameter('orderId', i) as string;
					if (!orderId) {
						throw new Error('Order ID is required');
					}

					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'biteshipApi',
						{
							method: 'GET',
							url: `https://api.biteship.com/v1/trackings/${orderId}`,
							json: true,
						}
					);
				} else if (operation === 'trackByWaybill') {
					const waybillId = this.getNodeParameter('waybillId', i) as string;
					const courierCode = this.getNodeParameter('courierCode', i) as string;
					if (!waybillId || !courierCode) {
						throw new Error('Waybill ID and courier code are required');
					}

					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'biteshipApi',
						{
							method: 'GET',
							url: `https://api.biteship.com/v1/trackings/${waybillId}/couriers/${courierCode}`,
							json: true,
						}
					);
				} else {
					throw new Error(`Unknown operation: ${operation}`);
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

module.exports = { BiteshipTracking };