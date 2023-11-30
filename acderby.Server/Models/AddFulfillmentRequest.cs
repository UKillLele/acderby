namespace acderby.Server.Models
{
    public class AddFulfillmentRequest: Address
    {
        public string DisplayName { get; set; } = string.Empty;
        public string EmailAddress { get; set; } = string.Empty;
        public string PhoneNumber {  get; set; } = string.Empty;
        public int Version { get; set; } = 0;
        public string OrderId {  get; set; } = string.Empty;
        public string Fulfillment { get; set; } = string.Empty;
        public string? FulfillmentUid {  get; set; }
    }
}
