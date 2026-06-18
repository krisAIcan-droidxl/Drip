export interface NotificationPreferences {
  enabled: boolean;
  dailyReminderHour?: number;
}

export async function scheduleDailyDripReminder(_preferences: NotificationPreferences): Promise<void> {
  if (__DEV__) {
    console.log('[notifications] scheduleDailyDripReminder is a stub');
  }
}

export async function cancelDailyDripReminder(): Promise<void> {
  if (__DEV__) {
    console.log('[notifications] cancelDailyDripReminder is a stub');
  }
}
