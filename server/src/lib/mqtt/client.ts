import mqtt from "mqtt";
import dotenv from "dotenv";

dotenv.config();

const MQTT_BROKER = process.env.MQTT_BROKER_URL!;
const MQTT_CLIENT_ID =
  process.env.MQTT_CLIENT_PREFIX + "-" + Math.random().toString(16).substring(2, 8);
const TOPIC_DATA = process.env.MQTT_TOPIC_DATA!;
const TOPIC_CONTROL = process.env.MQTT_TOPIC_CONTROL!;

const options: mqtt.IClientOptions = {
  clientId: MQTT_CLIENT_ID,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
};

if (process.env.MQTT_USERNAME && process.env.MQTT_PASSWORD) {
  options.username = process.env.MQTT_USERNAME;
  options.password = process.env.MQTT_PASSWORD;
}

const client = mqtt.connect(MQTT_BROKER, options);

client.on("connect", () => {
  console.log(`✅ MQTT connected to ${MQTT_BROKER}`);
  client.subscribe(TOPIC_DATA, (err) => {
    if (!err) console.log(`📡 Subscribed to topic: ${TOPIC_DATA}`);
  });
});

client.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log(`📥 Received on ${topic}:`, data);
  } catch (err) {
    console.error("❌ Error parsing message:", err);
  }
});

client.on("error", (err) => {
  console.error("❌ MQTT error:", err);
});

export default client;
