export type Properties = {
  $os: string;
  $browser: string;
  $current_url: string;
  $browser_version: number;
  $screen_height: number;
  $screen_width: number;
  mp_lib: string;
  $lib_version: string;
  $insert_id: string;
  time: number;
  distinct_id: string;
  $device_id: string;
  $initial_referrer: string;
  $initial_referring_domain: string;
  is_electron?: boolean;
  super_organization_id?: string;
  active_organization_id?: string;
  current_plan_atm?: string;
  current_pro_plan_type_atm?: string | null;
  current_active_team_size?: number;
  token?: string;
  mp_sent_by_lib_version?: string;
  experiment?: string;
  variant?: string | boolean;
  path?: string;
  viewing_device?: string;
  creator?: string;
  creator_type?: string;
  doc_super_org_plan?: string;
  visible_in_gallery?: boolean;
  view_format?: string;
  $user_id?: string;
  $anon_distinct_id?: string;
};

export type Event = {
  event: string;
  properties: Properties;
  time: string;
};

export type EventList = Event[];
