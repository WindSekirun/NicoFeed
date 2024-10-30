/*
  Warnings:

  - A unique constraint covering the columns `[uploaderUserId]` on the table `Follower` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uploaderUserId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userid" INTEGER NOT NULL,
    "videoTitle" TEXT NOT NULL,
    "videoLink" TEXT NOT NULL,
    "videoPubDate" DATETIME NOT NULL,
    "videoThumbnail" TEXT NOT NULL,
    "uploaderUserId" TEXT NOT NULL,
    "requestDateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Video_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Video_uploaderUserId_fkey" FOREIGN KEY ("uploaderUserId") REFERENCES "Follower" ("uploaderUserId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("id", "requestDateTime", "userid", "videoLink", "videoPubDate", "videoThumbnail", "videoTitle") SELECT "id", "requestDateTime", "userid", "videoLink", "videoPubDate", "videoThumbnail", "videoTitle" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Follower_uploaderUserId_key" ON "Follower"("uploaderUserId");
