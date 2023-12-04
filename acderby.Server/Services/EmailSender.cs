using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Configuration;


namespace acderby.Server.Services
{
    public class EmailSender: IEmailSender
    {
        private readonly IConfiguration _configuration;
        public EmailSender(IConfiguration configuration) 
        {
            _configuration = configuration;
        }
        public void SendEmail(MimeMessage message)
        {
            using var client = new SmtpClient();
            client.Connect(_configuration.GetValue<string>("ConnectionStrings:MailServer"), _configuration.GetValue<int>("ConnectionStrings:MailPort"), SecureSocketOptions.SslOnConnect);
            client.Authenticate(_configuration.GetValue<string>("ConnectionStrings:EmailUserName"), _configuration.GetValue<string>("ConnectionStrings:EmailPassword"));
            client.Send(message);
        }
    }
}
