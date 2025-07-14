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
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get order details by ID',
						action: 'Get order',
					},
					{
						name: 'Cancel',
						value: 'cancel',
						description: 'Cancel an existing order',
						action: 'Cancel order',
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
				required: true,
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
				required: true,
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
				required: true,
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
				required: true,
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
					},
					{
						displayName: 'Shipper Contact Phone',
						name: 'shipperContactPhone',
						type: 'string',
						default: '',
						description: 'Shipper contact phone',
					},
					{
						displayName: 'Shipper Contact Email',
						name: 'shipperContactEmail',
						type: 'string',
						default: '',
						description: 'Shipper contact email',
					},
					{
						displayName: 'Shipper Organization',
						name: 'shipperOrganization',
						type: 'string',
						default: '',
						description: 'Shipper organization name',
					},
					{
						displayName: 'Destination Contact Email',
						name: 'destinationContactEmail',
						type: 'string',
						default: '',
						description: 'Destination contact email',
					},
					{
						displayName: 'Origin Note',
						name: 'originNote',
						type: 'string',
						default: '',
						description: 'Additional note for origin location',
					},
					{
						displayName: 'Destination Note',
						name: 'destinationNote',
						type: 'string',
						default: '',
						description: 'Additional note for destination location',
					},
					{
						displayName: 'Order Note',
						name: 'orderNote',
						type: 'string',
						default: '',
						description: 'General order note',
					},
					{
						displayName: 'Courier Company',
						name: 'courierCompany',
						type: 'string',
						default: '',
						description: 'Specific courier company to use (e.g., jne, sicepat, grab)',
					},
					{
						displayName: 'Courier Type',
						name: 'courierType',
						type: 'string',
						default: '',
						description: 'Courier service type (e.g., reg, instant, same_day)',
					},
					{
						displayName: 'Courier Insurance (IDR)',
						name: 'courierInsurance',
						type: 'number',
						default: 0,
						description: 'Insurance amount in IDR',
					},
					{
						displayName: 'Cash on Delivery Amount (IDR)',
						name: 'destinationCashOnDelivery',
						type: 'number',
						default: 0,
						description: 'Cash on delivery amount in IDR',
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
					},
					{
						displayName: 'Reference ID',
						name: 'referenceId',
						type: 'string',
						default: '',
						description: 'Your internal reference ID for this order',
					},
					{
						displayName: 'Metadata',
						name: 'metadata',
						type: 'json',
						default: '{}',
						description: 'Additional metadata as JSON object',
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

		for (let i = 0; i < items.length; i++) {
			try {
				let response;
				if (operation === 'create') {
					const originContactName = this.getNodeParameter('originContactName', i) as string;
					const originContactPhone = this.getNodeParameter('originContactPhone', i) as string;
					const originAddress = this.getNodeParameter('originAddress', i) as string;
					const destinationContactName = this.getNodeParameter('destinationContactName', i) as string;
					const destinationContactPhone = this.getNodeParameter('destinationContactPhone', i) as string;
					const destinationAddress = this.getNodeParameter('destinationAddress', i) as string;
					const locationType = this.getNodeParameter('locationType', i) as string;
					const deliveryType = this.getNodeParameter('deliveryType', i) as string;
					const items = (this.getNodeParameter('items', i) as any).item || [];
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as { [key: string]: any };

					if (!originContactName || !originContactPhone || !originAddress) {
						throw new Error('All origin fields (contact name, phone, address) are required');
					}
					if (!destinationContactName || !destinationContactPhone || !destinationAddress) {
						throw new Error('All destination fields (contact name, phone, address) are required');
					}
					if (!items.length) {
						throw new Error('At least one item is required');
					}

					const body: { [key: string]: any } = {
						origin_contact_name: originContactName,
						origin_contact_phone: originContactPhone,
						origin_address: originAddress,
						destination_contact_name: destinationContactName,
						destination_contact_phone: destinationContactPhone,
						destination_address: destinationAddress,
						delivery_type: deliveryType,
						items,
					};

					if (locationType === 'postalCode') {
						const originPostalCode = this.getNodeParameter('originPostalCode', i) as number;
						const destinationPostalCode = this.getNodeParameter('destinationPostalCode', i) as number;
						if (!originPostalCode || !destinationPostalCode) {
							throw new Error('Origin and destination postal codes are required');
						}
						body.origin_postal_code = originPostalCode;
						body.destination_postal_code = destinationPostalCode;
					} else if (locationType === 'coordinates') {
						const originCoordinates = (this.getNodeParameter('originCoordinates', i) as any).coordinate;
						const destinationCoordinates = (this.getNodeParameter('destinationCoordinates', i) as any).coordinate;
						if (!originCoordinates || !destinationCoordinates) {
							throw new Error('Origin and destination coordinates are required');
						}
						body.origin_coordinate = originCoordinates;
						body.destination_coordinate = destinationCoordinates;
					} else if (locationType === 'areaId') {
						const originAreaId = this.getNodeParameter('originAreaId', i) as string;
						const destinationAreaId = this.getNodeParameter('destinationAreaId', i) as string;
						if (!originAreaId || !destinationAreaId) {
							throw new Error('Origin and destination area IDs are required');
						}
						body.origin_area_id = originAreaId;
						body.destination_area_id = destinationAreaId;
					} else {
						throw new Error(`Unknown location type: ${locationType}`);
					}

					if (additionalFields.metadata) {
						additionalFields.metadata = JSON.parse(additionalFields.metadata);
					}
					Object.assign(body, additionalFields);

					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'biteshipApi',
						{
							method: 'POST',
							url: 'https://api.biteship.com/v1/orders',
							body,
							json: true,
						}
					);
				} else if (operation === 'get') {
					const orderId = this.getNodeParameter('orderId', i) as string;
					if (!orderId) {
						throw new Error('Order ID is required');
					}

					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'biteshipApi',
						{
							method: 'GET',
							url: `https://api.biteship.com/v1/orders/${orderId}`,
							json: true,
						}
					);
				} else if (operation === 'cancel') {
					const orderId = this.getNodeParameter('orderId', i) as string;
					if (!orderId) {
						throw new Error('Order ID is required');
					}

					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'biteshipApi',
						{
							method: 'POST',
							url: `https://api.biteship.com/v1/orders/${orderId}/cancel`,
							json: true,
						}
					);
				} else {
					throw new Error(`Unknown operation: ${operation}`);
				}

				const simplifyResponse = this.getNodeParameter('simplifyResponse', i, false) as boolean;
				if (simplifyResponse) {
					const simplified = {
						orderId: response.id,
						status: response.status,
						courier: response.courier?.company,
						deliveryType: response.delivery_type,
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

module.exports = { BiteshipOrders };