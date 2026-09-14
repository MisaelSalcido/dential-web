export interface DemoAccount {
  email: string;
  password: string;
  subscriptionPlan: 'FREE' | 'PAID' | 'CLINIC';
}

export const demoAccounts = {
  free: {
    email: process.env['DENTIAL_DEMO_FREE_EMAIL'] || 'demo.free@dential.local',
    password: process.env['DENTIAL_DEMO_FREE_PASSWORD'] || 'DentialDemoFree123',
    subscriptionPlan: 'FREE',
  },
  paid: {
    email: process.env['DENTIAL_DEMO_PAID_EMAIL'] || 'demo.paid@dential.local',
    password: process.env['DENTIAL_DEMO_PAID_PASSWORD'] || 'DentialDemoPaid123',
    subscriptionPlan: 'PAID',
  },
  clinic: {
    email: process.env['DENTIAL_DEMO_CLINIC_EMAIL'] || 'demo.clinic@dential.local',
    password: process.env['DENTIAL_DEMO_CLINIC_PASSWORD'] || 'DentialDemoClinic123',
    subscriptionPlan: 'CLINIC',
  },
} as const satisfies Record<'free' | 'paid' | 'clinic', DemoAccount>;

export type DemoAccountTier = keyof typeof demoAccounts;
