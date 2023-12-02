using Square.Models;

namespace acderby.Server.Models
{
    public class PaymentRequest
    {
        public string SourceId { get; set; } = string.Empty;
        public Order? Order { get; set; }
    }
}
