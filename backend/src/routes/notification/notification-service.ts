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

export class notificationServices {
  static async getNotification(request: Request): Promise<notification[]> {
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

  static async readNotification(request: Request): Promise<string> {
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
}
