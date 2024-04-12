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
	sexual_preference: string;
	bio: string;
	age: number;
	hastags: string[];
	profile_picture: string[5];
}