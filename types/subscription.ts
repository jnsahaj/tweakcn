export interface SubscriptionCheck extends SubscriptionStatus {
  canProceed: boolean;
  error?: string;
}

export interface SubscriptionStatus {
  isSubscribed: boolean;
  requestsUsed: number;
  requestsRemaining: number;
}
