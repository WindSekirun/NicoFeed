-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follower" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "uploaderUserName" TEXT NOT NULL,
    "uploaderUserId" TEXT NOT NULL,
    "uploaderUserThumbnail" TEXT NOT NULL,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "videoTitle" TEXT NOT NULL,
    "videoLink" TEXT NOT NULL,
    "videoPubDate" TIMESTAMP(3) NOT NULL,
    "videoThumbnail" TEXT NOT NULL,
    "uploaderUserId" TEXT NOT NULL,
    "requestDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Follower_uploaderUserId_key" ON "Follower"("uploaderUserId");

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_uploaderUserId_fkey" FOREIGN KEY ("uploaderUserId") REFERENCES "Follower"("uploaderUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
