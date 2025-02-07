import { env } from '@/main/config/env';
import { Twilio } from '@/infra/notifications/twilio';

export const makeWhatsAppNotifier = (): Twilio  => {
  const accountSid = env.notifications.twilioAccountSid;
  const authToken = env.notifications.twilioAccountToken;
  return new Twilio(accountSid, authToken);
}
