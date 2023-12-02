namespace acderby.Server.Models
{
    public class OrderAddItemRequest
    {
        public string? OrderId { get; set; }
        public int? Version { get; set; }
        public List<OrderItem> Items { get; set; } = [];
    }

    public class OrderItem
    {
        public string? LineItemId { get; set; }
        public string? Uid { get; set; }
        public required string Quantity { get; set; }
    }
}
