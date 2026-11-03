export enum CommunicationChannel {
  SMS = 'sms',
  Email = 'email',
}

export enum CommunicationType {
  EmergencyAlert = 'emergency_alert',
  WeeklyBulletin = 'weekly_bulletin',
  ServiceReminder = 'service_reminder',
  GeneralAnnouncement = 'general_announcement',
}

export enum TargetAudience {
  AllMembers = 'all_members',
  LeadersOnly = 'leaders_only',
  ParentsOnly = 'parents_only',
  SpecificGroup = 'specific_group',
}

export enum MessageStatus {
  Draft = 'draft',
  Queued = 'queued',
  Sent = 'sent',
  Failed = 'failed',
}
