import { Twilio } from '@/infra/notifications/twilio';
import { env } from '@/main/config/env';


describe('Twilio Integration Test', () => {
  let sut: Twilio;
  const accountSid = env.notifications.twilioAccountSid;
  const authToken = env.notifications.twilioAccountToken;
  const from = env.notifications.twilioFakeWhatsAppFromNumber;
  const to = env.notifications.twilioFakeWhatsAppToNumber;

  beforeAll(() => {
    if (!accountSid || !authToken || !from || !to) {
      throw new Error('Missing Twilio credentials in environment variables');
    }
    sut = new Twilio(accountSid, authToken);
  });

  it('should send a WhatsApp message successfully', async () => {
    const message = {
      from,
      to,
      message: 'Testando envio de mensagem via Twilio!',
    };

    const messageIsSended = await sut.sendMessage(message)

     expect(messageIsSended).toBe(true)
  });
});
