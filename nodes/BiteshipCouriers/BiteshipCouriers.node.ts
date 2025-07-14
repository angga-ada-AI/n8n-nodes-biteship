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
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get list of all or specific couriers and their services',
						action: 'Get all couriers',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Couriers',
				name: 'courierCode',
				type: 'multiOptions',
				options: [
					{ name: 'GoJek', value: 'gojek' },
					{ name: 'Grab', value: 'grab' },
					{ name: 'Deliveree', value: 'deliveree' },
					{ name: 'JNE', value: 'jne' },
					{ name: 'TIKI', value: 'tiki' },
					{ name: 'Ninja Express', value: 'ninja' },
					{ name: 'Lion Parcel', value: 'lion' },
					{ name: 'Rara', value: 'rara' },
					{ name: 'SiCepat', value: 'sicepat' },
					{ name: 'J&T Express', value: 'jnt' },
					{ name: 'ID Express', value: 'idexpress' },
					{ name: 'RPX', value: 'rpx' },
					{ name: 'JDL', value: 'jdl' },
					{ name: 'Wahana', value: 'wahana' },
					{ name: 'Pos Indonesia', value: 'pos' },
					{ name: 'AnterAja', value: 'anteraja' },
					{ name: 'SAP Express', value: 'sap' },
					{ name: 'Paxel', value: 'paxel' },
					{ name: 'Borzo', value: 'borzo' },
					{ name: 'Lalamove', value: 'lalamove' },
				],
				default: [],
				description: 'Select one or more couriers to filter the results, or leave empty to get all couriers',
			},
			{
				displayName: 'Service Codes',
				name: 'serviceCode',
				type: 'multiOptions',
				default: [],
				options: [
					{ name: 'GoJek - Instant', value: 'gojek.instant', description: 'On Demand Instant (bike)' },
					{ name: 'GoJek - Same Day', value: 'gojek.same_day', description: 'On Demand within 8 hours (bike)' },
					{ name: 'Grab - Instant', value: 'grab.instant', description: 'On Demand Instant (bike)' },
					{ name: 'Grab - Same Day', value: 'grab.same_day', description: 'On Demand within 8 hours (bike)' },
					{ name: 'Grab - Instant Car', value: 'grab.instant_car', description: 'Grab Car Express' },
					{ name: 'Deliveree - Tronton Wing Box', value: 'deliveree.tronton_wing_box', description: 'Tronton Wing Box' },
					{ name: 'Deliveree - Tronton Box', value: 'deliveree.tronton_box', description: 'Tronton Box' },
					{ name: 'Deliveree - Fuso Heavy', value: 'deliveree.fuso_heavy', description: 'Fuso Heavy' },
					{ name: 'Deliveree - Fuso Lite', value: 'deliveree.fuso_light', description: 'Fuso Lite' },
					{ name: 'Deliveree - CDD Box', value: 'deliveree.cdd_box', description: 'CDD Box' },
					{ name: 'Deliveree - CDD Pickup', value: 'deliveree.cdd_pickup', description: 'CDD Pickup' },
					{ name: 'Deliveree - CDE - Frozen', value: 'deliveree.cde_frozen', description: 'CDE - Frozen' },
					{ name: 'Deliveree - CDE - Flammable', value: 'deliveree.cde_flammable', description: 'CDE - Flammable' },
					{ name: 'Deliveree - CDE - Chemical', value: 'deliveree.cde_chemical', description: 'CDE - Chemical' },
					{ name: 'Deliveree - Engkel Box', value: 'deliveree.engkel_box', description: 'Engkel Box' },
					{ name: 'Deliveree - Engkel Pickup', value: 'deliveree.engkel_pickup', description: 'Engkel Pickup' },
					{ name: 'Deliveree - Small Box', value: 'deliveree.small_box', description: 'Small Box' },
					{ name: 'Deliveree - Pickup', value: 'deliveree.pickup', description: 'Pickup' },
					{ name: 'Deliveree - Van', value: 'deliveree.van', description: 'Van' },
					{ name: 'Deliveree - Economy', value: 'deliveree.economy', description: 'Economy' },
					{ name: 'JNE - Reguler', value: 'jne.reg', description: 'Regular service' },
					{ name: 'JNE - YES', value: 'jne.yes', description: 'Express, next day' },
					{ name: 'JNE - OKE', value: 'jne.oke', description: 'Economy service' },
					{ name: 'JNE - JTR', value: 'jne.jtr', description: 'Trucking with minimum weight of 10 kg' },
					{ name: 'JNE - JTR 150 250', value: 'jne.jtr_150_250', description: 'Trucking for motorbike with 150cc to 250cc' },
					{ name: 'JNE - JTR 150', value: 'jne.jtr_150', description: 'Trucking for motorbike below 150cc' },
					{ name: 'JNE - JTR 250', value: 'jne.jtr_250', description: 'Trucking for motorbike above 250cc' },
					{ name: 'TIKI - EKO', value: 'tiki.eko', description: 'Economic service' },
					{ name: 'TIKI - SDS', value: 'tiki.sds', description: 'Same day service' },
					{ name: 'TIKI - REG', value: 'tiki.reg', description: 'Layanan reguler' },
					{ name: 'TIKI - ONS', value: 'tiki.ons', description: 'One night service' },
					{ name: 'TIKI - T15', value: 'tiki.t15', description: 'Motor di bawah 150CC' },
					{ name: 'TIKI - T25', value: 'tiki.t25', description: 'Motor di bawah 250CC' },
					{ name: 'TIKI - T60', value: 'tiki.t60', description: 'Motor di bawah 600CC' },
					{ name: 'TIKI - Trucking', value: 'tiki.trc', description: 'TIKI Trucking' },
					{ name: 'Ninja - Standard', value: 'ninja.standard', description: 'Layanan standard' },
					{ name: 'Lion - Reg Pack', value: 'lion.reg_pack', description: 'Layanan standard' },
					{ name: 'Lion - Land Pack', value: 'lion.land_pack', description: 'Pengiriman menggunakan kereta api' },
					{ name: 'Lion - One Pack', value: 'lion.one_pack', description: 'Layanan besok sampai' },
					{ name: 'Lion - Jago Pack', value: 'lion.jago_pack', description: 'Pengiriman standard' },
					{ name: 'Lion - Docu Pack', value: 'lion.docu_pack', description: 'Pengiriman dokumen' },
					{ name: 'Lion - Big Pack', value: 'lion.big_pack', description: 'Layanan trucking Lion Parcel' },
					{ name: 'Rara - Instant', value: 'rara.instant', description: 'Instant delivery service' },
					{ name: 'SiCepat - Reguler', value: 'sicepat.reg', description: 'Layanan reguler' },
					{ name: 'SiCepat - Best', value: 'sicepat.best', description: 'Besok sampai tujuan' },
					{ name: 'SiCepat - SDS', value: 'sicepat.sds', description: 'Same day service' },
					{ name: 'SiCepat - GOKIL', value: 'sicepat.gokil', description: 'Layanan kargo' },
					{ name: 'J&T - EZ', value: 'jnt.ez', description: 'Layanan reguler' },
					{ name: 'ID Express - Reguler', value: 'idexpress.reg', description: 'Layanan reguler' },
					{ name: 'ID Express - Same Day', value: 'idexpress.smd', description: 'Layanan Same Day' },
					{ name: 'ID Express - ID Truck', value: 'idexpress.idtruck', description: 'Layanan Trucking' },
					{ name: 'RPX - Same Day Package', value: 'rpx.sdp', description: 'Layanan sampai di hari yang sama' },
					{ name: 'RPX - Mid Day Package', value: 'rpx.mdp', description: 'Layanan tiba sebelum jam 12 siang esoknya' },
					{ name: 'RPX - Next Day Package', value: 'rpx.ndp', description: 'Layanan sampai 1 hari kerja' },
					{ name: 'RPX - Reguler Package', value: 'rpx.rgp', description: 'Pengiriman standard' },
					{ name: 'RPX - Paket Ambil Suka-suka', value: 'rpx.pas', description: 'Pengambilan barang mandiri di lokasi mitra RPX' },
					{ name: 'RPX - Economy Delivery', value: 'rpx.ecp', description: 'Kirim paket >10 kg dengan biaya hemat' },
					{ name: 'RPX - Heavy Weight Delivery', value: 'rpx.hwp', description: 'Kirim paket >20 kg dengan biaya hemat' },
					{ name: 'JDL - Reguler', value: 'jdl.reg', description: 'Regular shipment' },
					{ name: 'Wahana - Normal', value: 'wahana.normal', description: 'Layanan standard' },
					{ name: 'Pos - Kilat Khusus', value: 'pos.kilat_khusus', description: 'Layanan kilat khusus' },
					{ name: 'Pos - Q9 Same Day', value: 'pos.q9_same_day', description: 'Layanan max 9 jam sampai. Cut off pukul 16:00' },
					{ name: 'Pos - Same Day', value: 'pos.same_day', description: 'Layanan sampai di hari yang sama' },
					{ name: 'Pos - Next Day', value: 'pos.next_day', description: 'Layanan paket besok sampai' },
					{ name: 'Pos - Jumbo Ekonomi', value: 'pos.jumbo_ekonomi', description: 'Layanan dengan tarif tingkat berat pertama mulai dari 3kg - 30kg' },
					{ name: 'AnterAja - Reguler', value: 'anteraja.reg', description: 'Regular shipment' },
					{ name: 'AnterAja - Same Day', value: 'anteraja.same_day', description: 'Same day service for Jakarta Area' },
					{ name: 'AnterAja - Next Day', value: 'anteraja.next_day', description: 'Next day service delivery' },
					{ name: 'SAP - REG', value: 'sap.reg', description: 'Regular service' },
					{ name: 'SAP - ODS', value: 'sap.ods', description: 'One Day Service' },
					{ name: 'SAP - SDS', value: 'sap.sds', description: 'Same Day Service' },
					{ name: 'SAP - Cargo', value: 'sap.cargo', description: 'Cargo Land Service' },
					{ name: 'Paxel - Small Package', value: 'paxel.small', description: 'Layanan paket small' },
					{ name: 'Paxel - Medium Package', value: 'paxel.medium', description: 'Layanan paket medium' },
					{ name: 'Paxel - Large Package', value: 'paxel.large', description: 'Layanan paket large' },
					{ name: 'Paxel - Paxel Big', value: 'paxel.paxel_big', description: 'Layanan kargo paxel big' },
					{ name: 'Borzo - Instant Bike', value: 'borzo.instant_bike', description: 'Delivery using bike' },
					{ name: 'Borzo - Instant Car', value: 'borzo.instant_car', description: 'Delivery using car' },
					{ name: 'Lalamove - Motorcycle', value: 'lalamove.motorcycle', description: 'Layanan dapat digunakan dengan berat mulai dari 0 kg sampai 20 kg' },
					{ name: 'Lalamove - MPV', value: 'lalamove.mpv', description: 'Layanan dapat digunakan dengan berat mulai dari 0 kg sampai 200 kg' },
					{ name: 'Lalamove - Van', value: 'lalamove.van', description: 'Layanan dapat digunakan dengan berat mulai dari 200 kg sampai 600 kg' },
					{ name: 'Lalamove - Truck', value: 'lalamove.truck', description: 'Layanan dapat digunakan dengan berat mulai dari 600 kg sampai 800 kg' },
					{ name: 'Lalamove - Cdd Bak', value: 'lalamove.cdd_bak', description: 'Layanan dapat digunakan dengan berat mulai dari 2500 kg sampai 5000 kg' },
					{ name: 'Lalamove - Cdd Box', value: 'lalamove.cdd_box', description: 'Layanan dapat digunakan dengan berat mulai dari 2500 kg sampai 5000 kg' },
					{ name: 'Lalamove - Engkel Box', value: 'lalamove.engkel_box', description: 'Layanan dapat digunakan dengan berat mulai dari 1000 kg sampai 2000 kg' },
					{ name: 'Lalamove - Engkel Bak', value: 'lalamove.engkel_bak', description: 'Layanan dapat digunakan dengan berat mulai dari 2000 kg sampai 2500 kg' },
				],
				description: 'Select one or more service codes to filter the results, or leave empty to get all services for selected couriers',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Filter Active Only',
						name: 'activeOnly',
						type: 'boolean',
						default: false,
						description: 'Only return active/available services',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const courierCodes = this.getNodeParameter('courierCode', i, []) as string[];
				const serviceCodes = this.getNodeParameter('serviceCode', i, []) as string[];
				const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

				if (operation === 'getAll') {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'biteshipApi',
						{
							method: 'GET',
							url: 'https://api.biteship.com/v1/couriers',
							json: true,
						}
					);

					if (!response.couriers || !Array.isArray(response.couriers)) {
						throw new Error('Invalid response: No couriers found');
					}

					let filteredCouriers = response.couriers;
					if (courierCodes.length > 0) {
						filteredCouriers = response.couriers.filter(
							(c: any) => courierCodes.includes(c.code.toLowerCase())
						);
						if (filteredCouriers.length === 0) {
							returnData.push({
								json: {
									success: false,
									object: 'courier',
									error: `No couriers found for codes: ${courierCodes.join(', ')}`,
									availableCouriers: response.couriers.map((c: any) => c.code),
								},
							});
							continue;
						}
					}

					const couriers: any[] = [];
					for (const courier of filteredCouriers) {
						let services = courier.available_types || [];
						if (additionalFields.activeOnly) {
							services = services.filter((service: any) => service.is_active !== false);
						}

						if (serviceCodes.length > 0) {
							services = services.filter((service: any) =>
								serviceCodes.includes(`${courier.code.toLowerCase()}.${service.code.toLowerCase()}`)
							);
						}

						for (const service of services) {
							const serviceCodeLower = service.code.toLowerCase();
							const courierCodeLower = courier.code.toLowerCase();
							const fullServiceCode = `${courierCodeLower}.${serviceCodeLower}`;

							// Define metadata based on service code
							const isInstant = serviceCodeLower.includes('instant') || serviceCodeLower.includes('same_day') || serviceCodeLower === 'q9_same_day' || serviceCodeLower === 'sds' || serviceCodeLower === 'sdp';
							const isNextDay = serviceCodeLower.includes('next_day') || serviceCodeLower === 'yes' || serviceCodeLower === 'ons' || serviceCodeLower === 'best' || serviceCodeLower === 'one_pack' || serviceCodeLower === 'ndp' || serviceCodeLower === 'mdp';
							const isCargo = serviceCodeLower.includes('trucking') || serviceCodeLower.includes('jtr') || serviceCodeLower.includes('gokil') || serviceCodeLower.includes('big_pack') || serviceCodeLower.includes('idtruck') || serviceCodeLower.includes('cargo') || serviceCodeLower.includes('tronton') || serviceCodeLower.includes('fuso') || serviceCodeLower.includes('cdd') || serviceCodeLower.includes('engkel') || serviceCodeLower === 'paxel_big';
							const isDocument = serviceCodeLower === 'docu_pack';
							const isEconomy = serviceCodeLower === 'oke' || serviceCodeLower === 'eko' || serviceCodeLower === 'economy' || serviceCodeLower === 'jumbo_ekonomi' || serviceCodeLower === 'ecp' || serviceCodeLower === 'hwp';

							const courierEntry = {
								available_for_cash_on_delivery: ['jne.reg', 'sicepat.reg', 'jnt.ez', 'idexpress.reg', 'anteraja.reg', 'sap.reg', 'jdl.reg'].includes(fullServiceCode),
								available_for_proof_of_delivery: isNextDay || isInstant,
								available_for_instant_waybill_id: isInstant,
								courier_name: courier.name,
								courier_code: courier.code.toLowerCase(),
								courier_service_name: service.name,
								courier_service_code: serviceCodeLower,
								tier: isInstant ? 'premium' : isCargo ? 'cargo' : 'standard',
								description: service.description || '',
								service_type: isInstant ? 'same_day' : isNextDay ? 'next_day' : isCargo ? 'cargo' : 'regular',
								shipping_type: isDocument ? 'document' : isCargo ? 'cargo' : 'parcel',
								shipment_duration_range: isInstant ? '1 - 3' : isNextDay ? '1 - 1' : isCargo ? '2 - 7' : isEconomy ? '3 - 7' : '1 - 3',
								shipment_duration_unit: isInstant ? 'hours' : 'days',
							};

							couriers.push(courierEntry);
						}
					}

					if (couriers.length === 0) {
						returnData.push({
							json: {
								success: false,
								object: 'courier',
								error: `No services found for selected couriers and service codes`,
								availableCouriers: response.couriers.map((c: any) => c.code),
							},
						});
						continue;
					}

					returnData.push({
						json: {
							success: true,
							object: 'courier',
							couriers: couriers,
						},
					});
				} else {
					throw new Error(`Unknown operation: ${operation}`);
				}
			} catch (error) {
				returnData.push({
					json: {
						success: false,
						object: 'courier',
						error: error.message,
						details: error.response?.data || null,
					},
				});
			}
		}

		return [returnData];
	}
}

module.exports = { BiteshipCouriers };