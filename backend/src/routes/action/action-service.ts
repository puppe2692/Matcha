import prismaFromWishInstance from "../../database/prismaFromWish";

export interface notification {
  user_id: number;
  date: Date;
  seen: boolean;
  content: string;
}

export type statusUpdate = "like" | "unlike" | "block";

export class actionServices {
  static async viewProfile(
    originId: number,
    destinationId: number
  ): Promise<string> {
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
    const newStatus =
      type === "unlike" ? "viewed" : type === "like" ? "liked" : "blocked";
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

  // we are not sure that a connection exists but it is not an issue if we try to delete a non-existing row, the sql request will still be successful and do nothing
  static async deleteConnection(originId: number, destinationId: number) {
    await prismaFromWishInstance.delete(
      "connection",
      ["origin_user_id", "destination_user_id"],
      [Math.min(originId, destinationId), Math.max(originId, destinationId)]
    );
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
    if (status.data?.rows.length == 0) {
      return false;
    } else {
      const reverseStatus = status.data!.rows[0].status;
      if (reverseStatus == "liked") {
        await prismaFromWishInstance.create(
          "connection",
          ["origin_user_id", "destination_user_id"],
          [Math.min(originId, destinationId), Math.max(originId, destinationId)]
        );
        return true;
      } else {
        return false;
      }
    }
  }
}
