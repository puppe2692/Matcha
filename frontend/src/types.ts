export type User = {
	id: number;
	email: string;
	username: string;
	firstname: string;
	lastname: string;
	verify: boolean;
	connection_status: boolean;
	created_at: Date;
	updated_at: Date;
};
