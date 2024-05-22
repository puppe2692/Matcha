import prismaFromWishInstance from "../../database/prismaFromWish";
import { webSocket } from "../../server";

export interface notification {
  user_id: number;
  date: Date;
  seen: boolean;
  content: string;
}

export type statusUpdate = "like" | "unlike" | "block" | "unblock";

export class actionServices {
  static async viewProfile(
    originId: number,
    destinationId: number
  ): Promise<string> {
    if (originId === destinationId) {
      return "Both users are the same, no status created";
    }
    const status = await prismaFromWishInstance.selectAll(
      "status",
      ["origin_user_id", "destination_user_id"],
      [originId, destinationId]
    );
    if (status.data?.rows.length == 0) {
      await prismaFromWishInstance.create(
        "status",
        ["origin_user_id", "destination_user_id", "status"],
        [originId, destinationId, "viewed"]
      );
      return "Status was successfully created";
    } else {
      await prismaFromWishInstance.update(
        "status",
        ["last_update"],
        [new Date()],
        ["origin_user_id", "destination_user_id"],
        [originId, destinationId]
      );
      return "Status was successfully updated";
    }
  }

  static async updateProfile(
    originId: number,
    destinationId: number,
    type: statusUpdate
  ): Promise<{ message: string; newConnection: boolean }> {
    if (originId === destinationId) {
      return {
        message: "Both users are the same, no status created",
        newConnection: false,
      };
    }
    const newStatus =
      type === "unlike"
        ? "viewed"
        : type === "like"
        ? "liked"
        : type === "block"
        ? "blocked"
        : "viewed";
    await prismaFromWishInstance.update(
      "status",
      ["last_update", "status"],
      [new Date(), newStatus],
      ["origin_user_id", "destination_user_id"],
      [originId, destinationId]
    );
    let newConnection: boolean = false;
    if (type === "like") {
      newConnection = await this.checkCreateConnection(originId, destinationId);
    } else {
      await this.deleteConnection(originId, destinationId);
    }
    return { message: "Status was successfully updated", newConnection };
  }

  static async deleteConnection(originId: number, destinationId: number) {
    const existingConnection = await prismaFromWishInstance.selectAll(
      "connection",
      ["origin_user_id", "destination_user_id"],
      [Math.min(originId, destinationId), Math.max(originId, destinationId)]
    );
    if (existingConnection.data?.rows.length !== 0) {
      await prismaFromWishInstance.delete(
        "connection",
        ["origin_user_id", "destination_user_id"],
        [Math.min(originId, destinationId), Math.max(originId, destinationId)]
      );
      webSocket.notifyUnmatchBlock(destinationId, originId);
    }
  }

  static async checkCreateConnection(
    originId: number,
    destinationId: number
  ): Promise<boolean> {
    // check if the reverse status is already a like
    const status = await prismaFromWishInstance.selectAll(
      "status",
      ["origin_user_id", "destination_user_id"],
      [destinationId, originId]
    );
    const connection = await prismaFromWishInstance.selectAll(
      "connection",
      ["origin_user_id", "destination_user_id"],
      [Math.min(originId, destinationId), Math.max(originId, destinationId)]
    );
    if (status.data?.rows.length === 0 || connection.data?.rows.length !== 0) {
      return false;
    } else {
      const reverseStatus = status.data!.rows[0].status;
      if (reverseStatus == "liked") {
        await prismaFromWishInstance.create(
          "connection",
          ["origin_user_id", "destination_user_id"],
          [Math.min(originId, destinationId), Math.max(originId, destinationId)]
        );
        const newMatchUser = await prismaFromWishInstance.selectAll(
          "users",
          ["id"],
          [originId]
        );
        webSocket.notifyMatch(
          destinationId,
          originId,
          newMatchUser.data!.rows[0].username
        );
        return true;
      } else {
        return false;
      }
    }
  }

  static async updateRating(
    destinationId: number,
    ratingEvolution: number
  ): Promise<void> {
    const user = await prismaFromWishInstance.selectAll(
      "users",
      ["id"],
      [destinationId]
    );
    if (user.data?.rows.length === 0) {
      return;
    } else {
      const fame = user.data!.rows[0].fame_rating;
      const new_fame = Math.max(0, fame + ratingEvolution);
      await prismaFromWishInstance.update(
        "users",
        ["fame_rating"],
        [new_fame],
        ["id"],
        [destinationId]
      );
    }
  }
}
