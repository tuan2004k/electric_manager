import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Owner', 'Admin']).optional().default('Owner'),
  apartment: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    tariffId: z.number().default(1)
  }).optional()
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export const deviceCreateSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  apartmentId: z.number().min(1, 'Apartment ID is required'),
  name: z.string().min(1, 'Device name is required'),
  type: z.string().min(1, 'Device type is required'),
  isControllable: z.boolean().default(true),
  mqttTopicPub: z.string().min(1, 'MQTT publish topic is required'),
  mqttTopicSub: z.string().min(1, 'MQTT subscribe topic is required')
})

export const deviceUpdateSchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  isControllable: z.boolean().optional(),
  mqttTopicPub: z.string().optional(),
  mqttTopicSub: z.string().optional()
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type DeviceCreateInput = z.infer<typeof deviceCreateSchema>
export type DeviceUpdateInput = z.infer<typeof deviceUpdateSchema>