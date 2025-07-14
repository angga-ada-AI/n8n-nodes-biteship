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
					},
					{
						name: 'Get Draft',
						value: 'getDraft',
						description: 'Get draft order details by ID',
						action: 'Get draft order',
					},
					{
						name: 'Delete Draft',
						value: 'deleteDraft',
						description: 'Delete a draft order',
						action: 'Delete draft order',
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
				if (operation === 'createDraft') {
					const originContactName = this.getNodeParameter('originContactName', i) as string;
					const originContactPhone = this.getNodeParameter('originContactPhone', i) as string;
					const originAddress = this.getNodeParameter('originAddress', i) as string;
					const originPostalCode = this.getNodeParameter('originPostalCode', i) as number;
					const items = (this.getNodeParameter('items', i) as any).item || [];

					if (!originContactName || !originContactPhone || !originAddress || !originPostalCode) {
						throw new Error('All origin fields (contact name, phone, address, postal code) are required');
					}
					if (!items.length) {
						throw new Error('At least one item is required');
					}

					const body = {
						origin_contact_name: originContactName,
						origin_contact_phone: originContactPhone,
						origin_address: originAddress,
						origin_postal_code: originPostalCode,
						items,
					};

					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'biteshipApi',
						{
							method: 'POST',
							url: 'https://api.biteship.com/v1/draft-orders',
							body,
							json: true,
						}
					);
				} else if (operation === 'getDraft') {
					const draftId = this.getNodeParameter('draftId', i) as string;
					if (!draftId) {
						throw new Error('Draft ID is required');
					}

					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'biteshipApi',
						{
							method: 'GET',
							url: `https://api.biteship.com/v1/draft-orders/${draftId}`,
							json: true,
						}
					);
				} else if (operation === 'deleteDraft') {
					const draftId = this.getNodeParameter('draftId', i) as string;
					if (!draftId) {
						throw new Error('Draft ID is required');
					}

					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'biteshipApi',
						{
							method: 'DELETE',
							url: `https://api.biteship.com/v1/draft-orders/${draftId}`,
							json: true,
						}
					);
				} else {
					throw new Error(`Unknown operation: ${operation}`);
				}

				const simplifyResponse = this.getNodeParameter('simplifyResponse', i, false) as boolean;
				if (simplifyResponse) {
					const simplified = {
						draftId: response.id,
						status: response.status,
						items: response.items?.map((item: any) => ({ name: item.name, quantity: item.quantity })),
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

module.exports = { BiteshipDraftOrders };