export interface CustomUser {
  id: number;
  email: string;
  username: string;
  password?: string;
  firstname: string;
  lastname: string;
  verify: boolean;
  connection_status: boolean;
  created_at: Date;
  updated_at: Date;
  gender: string;
  sex_pref: string;
  bio: string;
  age: number;
  hashtags: string[];
  profile_picture: string[5];
  latitude: number;
  longitude: number;
  fame_rating: number;
  isfake: boolean;
}
