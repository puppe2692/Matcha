import { Request } from "express";
import { PrismaReturn } from "../../data_structures/data";
import prismaFromWishInstance from "../../database/prismaFromWish";
import { webSocket } from "../../server";

export interface notification {
  user_id: number;
  date: Date;
  seen: boolean;
  content: string;
}

export type notificationType = "viewed" | "like" | "unlike" | "match";

export class notificationServices {
  static async getNotifications(request: Request): Promise<notification[]> {
    const userId = parseInt(request.query.id as string);
    const notifications = await prismaFromWishInstance.selectAll(
      "notifications",
      ["user_id"],
      [userId]
    );
    if (!notifications.data?.rows) {
      return [];
    } else {
      return notifications.data.rows.sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
    }
  }

  static async readNotifications(request: Request): Promise<string> {
    try {
      const userId = parseInt(request.query.id as string);
      await prismaFromWishInstance.update(
        "notifications",
        ["seen"],
        [true],
        ["user_id"],
        [userId]
      );
      return "Success";
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  }

  static async deleteAllNotifications(request: Request): Promise<string> {
    try {
      const userId = parseInt(request.query.id as string);
      await prismaFromWishInstance.delete(
        "notifications",
        ["user_id"],
        [userId]
      );
      return "Success";
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  }

  static async deleteOneNotification(request: Request): Promise<string> {
    try {
      const notificationId = parseInt(request.query.notificationId as string);
      await prismaFromWishInstance.delete(
        "notifications",
        ["id"],
        [notificationId]
      );
      return "Success";
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  }

  static generateContent(username: string, type: notificationType) {
    if (type === "viewed") {
      return `${username} has viewed your profile`;
    } else if (type === "like") {
      return `${username} liked your profile`;
    } else if (type === "unlike") {
      return `${username} no longer likes your profile`;
    } else {
      return `${username} liked your profile back. It's a match`;
    }
  }

  static async createSendNotification(
    originId: number,
    destinationId: number,
    type: notificationType
  ) {
    const originUser = await prismaFromWishInstance.selectAll(
      "users",
      ["id"],
      [originId]
    );
    if (originUser.data?.rows.length === 0) {
      throw new Error("User not found");
    }
    const username = originUser.data!.rows[0].username;
    const content = this.generateContent(username, type);
    // check if destination user has not blocked origin user before creating the notification
    const destinationStatus = await prismaFromWishInstance.selectAll(
      "status",
      ["origin_user_id", "destination_user_id"],
      [destinationId, originId]
    );
    if (
      destinationStatus.data?.rows.length !== 0 &&
      destinationStatus.data?.rows[0] === "blocked"
    ) {
      return;
    } else {
      await prismaFromWishInstance.create(
        "notifications",
        ["user_id", "content"],
        [destinationId, content]
      );
      webSocket.sendNotification(destinationId.toString());
    }
  }
}
