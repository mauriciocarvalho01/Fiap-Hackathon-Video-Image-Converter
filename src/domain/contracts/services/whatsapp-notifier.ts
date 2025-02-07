export interface WhatsAppNotifier {
  sendMessage(message: WhatsAppNotifier.SendMessageOptions): Promise<boolean>;
}

export namespace WhatsAppNotifier {
  export type Generictype<T=any> = T
  export type SendMessageOptions = {
    from: string
    message: Generictype
    to: string
  }
}
