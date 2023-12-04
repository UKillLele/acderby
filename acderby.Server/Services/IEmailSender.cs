using MimeKit;

namespace acderby.Server.Services
{
    public interface IEmailSender
    {
        void SendEmail(MimeMessage message);
    }
}
