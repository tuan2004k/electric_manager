export function parseMqttPayload(payload: string): any {
  try {
    return JSON.parse(payload);
  } catch (error) {
    console.error('Parse error:', error);
    return { raw: payload };
  }
}

