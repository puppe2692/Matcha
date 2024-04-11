import { Request } from "express";
import { PrismaReturn } from "../../data_structures/data";
import prismaFromWishInstance from "../../database/prismaFromWish";

export interface Contact {
  connectedUser: string;
  connectedUserId: number;
  date: Date;
}

export interface Message {
  sender_id: number;
  receiver_id: number;
  date_sent: Date;
  content: string;
  seen: boolean;
}

export class chatServices {
  static async getContacts(request: Request): Promise<Contact[]> {
    const userId = parseInt(request.query.id as string);
    const connections = await prismaFromWishInstance.customQuery(
      `SELECT
		connection.id,
		origin_user_id,
		destination_user_id,
		date,
		u1.username AS origin_user_username,
		u2.username AS destination_user_username
	FROM
		connection
	JOIN
		users u1 ON connection.origin_user_id = u1.id
	JOIN
		users u2 ON connection.destination_user_id = u2.id
	WHERE
		connection.origin_user_id = $1 OR connection.destination_user_id = $1;`,
      [userId]
    );
    if (!connections.data?.rows) {
      return [];
    } else {
      let data: Contact[] = [];
      for (const row of connections.data?.rows) {
        console.log(row.date.getTime());
        if (row.origin_user_id === userId) {
          data.push({
            connectedUser: row.destination_user_username,
            connectedUserId: row.destination_user_id,
            date: row.date,
          });
        } else {
          data.push({
            connectedUser: row.origin_user_username,
            connectedUserId: row.origin_user_id,
            date: row.date,
          });
        }
      }
      data.sort((a, b) => b.date.getTime() - a.date.getTime());
      return data;
    }
  }

  static async getMessages(request: Request): Promise<Message[]> {
    const userId = parseInt(request.query.id as string);
    const messages = await prismaFromWishInstance.selectAll(
      "messages",
      ["sender_id", "receiver_id"],
      [userId, userId],
      "OR"
    );
    if (!messages.data?.rows) {
      return [];
    } else {
      const messagesCleaned: Message[] = messages.data.rows.map(
        ({ id, ...rest }) => rest
      );
      return messages.data.rows;
    }
  }

  static async pushMessage(message: Message) {
    // create the message
    await prismaFromWishInstance.create(
      "messages",
      ["sender_id", "receiver_id", "date_sent", "seen", "content"],
      [
        message.sender_id,
        message.receiver_id,
        message.date_sent,
        message.seen,
        message.content,
      ]
    );

    //update the date of the last interaction in connections
    const origin_user_id = Math.min(message.sender_id, message.receiver_id);
    const destination_user_id = Math.max(
      message.sender_id,
      message.receiver_id
    );
    await prismaFromWishInstance.update(
      "connection",
      ["date"],
      [message.date_sent],
      ["origin_user_id", "destination_user_id"],
      [origin_user_id, destination_user_id]
    );
  }
}
