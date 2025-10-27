export interface MqttConfig {
  brokerUrl: string;
  username?: string;
  password?: string;
  clientId: string;
  topics: {
    powerReadings: string;
    deviceStatus: string;
    control: string;
  };
  reconnectPeriod: number;
  keepalive: number;
}

export interface MqttClientWrapper {
  client: import('mqtt').IClient;
  config: MqttConfig;
}

export interface MqttMessage {
  topic: string;
  payload: any;
}