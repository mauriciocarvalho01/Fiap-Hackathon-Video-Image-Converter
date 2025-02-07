import twilio from 'twilio';
import { WhatsAppNotifier } from '@/domain/contracts/services';

export class Twilio implements WhatsAppNotifier {
  private readonly client: twilio.Twilio;

  constructor(accountSid: string, authToken: string) {
    console.log(accountSid, authToken)
    this.client = twilio(accountSid, authToken);
  }

  async sendMessage(sendMessageOptions: WhatsAppNotifier.SendMessageOptions): Promise<boolean> {
    try {
      console.log(`Sending message with options: ${JSON.stringify(sendMessageOptions)}`)
      const twilioResponse = await this.client.messages.create({
        from: sendMessageOptions.from, //'whatsapp:+14155238886', // Número do Twilio
        body: sendMessageOptions.message, // Corpo da mensagem
        to: sendMessageOptions.to, // whatsapp:+5511991503310' // Número de destino
      });
      console.log(`Mensagem enviada com SID: ${twilioResponse.sid}`);
      return true;
    } catch (error: WhatsAppNotifier.Generictype) {
      console.error(`Erro ao enviar mensagem: ${error.message}`);
      return false;
    }
  }
}
