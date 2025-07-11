# n8n-nodes-biteship

This is an n8n community node. It lets you use Biteship in your n8n workflows.

Biteship is Indonesia's leading shipping and logistics platform that connects businesses with multiple courier services including JNE, SiCepat, Grab, Gojek, and many others.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Rates
- **Get Rates**: Calculate shipping rates from multiple couriers based on origin/destination (supports postal codes, coordinates, or area IDs)

### Orders
- **Create**: Create a new shipping order
- **Get**: Retrieve order details by ID
- **Cancel**: Cancel an existing order

### Draft Orders
- **Create**: Create a draft order for rate comparison
- **Get**: Retrieve draft order details
- **Update**: Update draft order information (courier, location, items)
- **Delete**: Delete a draft order
- **Confirm**: Convert draft order to actual order
- **Get Rates**: Get available shipping rates for a draft order

### Tracking
- **Track by Order ID**: Track shipment using Biteship order ID
- **Track by Waybill**: Track shipment using waybill ID and courier code

### Couriers
- **Get All**: Retrieve list of available courier services

### Locations
- **Create**: Create a saved shipping location
- **Get**: Retrieve location details by ID
- **Update**: Update location information
- **Delete**: Delete a saved location

### Maps
- **Search Areas**: Search for areas, cities, or districts by name

## Credentials

To use this node, you need a Biteship API key:

1. Sign up for a [Biteship account](https://biteship.com/)
2. Go to your dashboard and navigate to API settings
3. Generate an API key
4. In n8n, create new Biteship API credentials
5. Enter your API key
6. Select environment (Test/Production)

**Note**: Use test environment for development and testing. Production environment will create actual shipments and charges.

## Compatibility

- Minimum n8n version: 0.198.0
- Tested with n8n versions: 0.198.0+

## Usage

### Basic Rate Calculation

1. Add Biteship node to your workflow
2. Select "Rates" resource and "Get Rates" operation
3. Choose location type (Postal Code, Coordinates, or Area ID)
4. Fill in origin and destination details
5. Add items with dimensions and weight
6. Specify courier codes (comma-separated, e.g., "jne,sicepat,grab")
7. Execute to get shipping rates

### Creating an Order

1. Select "Orders" resource and "Create" operation
2. Fill in origin and destination contact details
3. Choose location type and provide location data
4. Add items to ship
5. Set delivery type (now/schedule)
6. Optionally add courier preferences, insurance, or COD
7. Execute to create the order

### Tracking a Shipment

1. Select "Tracking" resource
2. Choose "Track by Order ID" for Biteship orders or "Track by Waybill" for external tracking
3. Provide the order ID or waybill ID + courier code
4. Execute to get tracking information and history

### Working with Draft Orders

Draft orders are useful for comparing rates before committing to a shipment:

1. Create a draft order with basic shipment details
2. Use "Get Rates" on the draft to see available courier options
3. Update the draft with preferred courier selection
4. Confirm the draft to create an actual order

### Location Management

Save frequently used addresses for faster order creation:

1. Create locations with full contact and address details
2. Use saved location IDs in orders instead of repeating address information
3. Update or delete locations as needed

## API Coverage

This node covers the main Biteship API endpoints:

- ✅ Rates API (all location types: postal codes, coordinates, area IDs, mixed)
- ✅ Orders API (create, retrieve, cancel)
- ✅ Draft Orders API (full lifecycle management)
- ✅ Tracking API (by order ID and waybill)
- ✅ Couriers API (list available services)
- ✅ Locations API (CRUD operations)
- ✅ Maps API (area search)
- ✅ Webhook support (through n8n webhook nodes)

## Error Handling

The node includes proper error handling for common scenarios:

- Invalid API keys
- Missing required fields
- Invalid location data
- Courier service unavailability
- Network timeouts

Error messages are descriptive and include suggestions for resolution.

## Examples

### E-commerce Order Fulfillment Workflow

```
Trigger (New Order) → 
Biteship (Get Rates) → 
Set (Select Best Rate) → 
Biteship (Create Order) → 
Database (Update Order Status) → 
Email (Send Tracking Info)
```

### Shipment Tracking Automation

```
Schedule Trigger → 
Database (Get Pending Orders) → 
Biteship (Track by Order ID) → 
Switch (Check Status) → 
Email/SMS (Notify Customer) → 
Database (Update Status)
```

### Multi-Courier Rate Comparison

```
Manual Trigger → 
Biteship (Get Rates) → 
Code (Parse & Compare) → 
Google Sheets (Log Results) → 
Slack (Send Summary)
```

## Best Practices

1. **Use Test Environment**: Always test with test API keys before production
2. **Rate Limiting**: Be mindful of API rate limits, especially in loops
3. **Error Handling**: Implement proper error handling for network issues
4. **Data Validation**: Validate address and item data before API calls
5. **Webhook Integration**: Use n8n webhook nodes to handle Biteship webhooks for real-time updates

## Supported Couriers

Biteship integrates with major Indonesian courier services:

- **Instant Delivery**: Grab, Gojek
- **Same Day**: Grab Same Day, Gojek Same Day  
- **Regular Services**: JNE, SiCepat, J&T Express, Pos Indonesia, Lion Parcel
- **And many more regional couriers**

Each courier has different service types (instant, same day, regular, express) with varying coverage areas and pricing.

## Troubleshooting

### Common Issues

**Authentication Failed**
- Verify API key is correct
- Check if using correct environment (test/production)
- Ensure API key has necessary permissions

**No Rates Returned**
- Verify origin/destination locations are valid
- Check if courier services are available for the route
- Ensure item dimensions and weight are realistic

**Order Creation Failed**
- Validate all required contact information
- Check if courier service supports the route
- Verify item details are complete and accurate

**Tracking Not Working**
- Confirm order ID or waybill ID is correct
- Check if order has been confirmed and picked up
- Some couriers may have delayed tracking updates

### Getting Help

1. Check the [Biteship API documentation](https://biteship.com/id/docs/api)
2. Review error messages carefully - they often include specific guidance
3. Test with smaller, simpler requests first
4. Use test environment to avoid charges while debugging

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Biteship API documentation](https://biteship.com/id/docs/api)
* [Biteship dashboard](https://biteship.com/dashboard)
* [Biteship courier coverage](https://biteship.com/couriers)

## Version History

### 1.0.0
- Initial release
- Support for all major Biteship API endpoints
- Declarative-style node implementation
- Comprehensive error handling
- Test and production environment support