export interface Mission {
  flight_number: number;
  mission_name: string;
  launch_year: string;
  launch_date_local: string;
  details: string;
  launch_success: boolean;
  links: {
    mission_patch: string;
    mission_patch_small: string;
    article_link: string;
    wikipedia: string;
    video_link: string;
  };
  rocket: {
    rocket_name: string;
    rocket_type: string;
  };
  launch_site: {
    site_name_long: string;
  };
}
