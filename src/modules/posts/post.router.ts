import express from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.createPost
);
router.get("/", PostController.getAllPost);
router.get("/stats", auth(UserRole.ADMIN), PostController.getStats);
router.get(
  "/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.getMyPosts
);
router.get("/:postId", PostController.getSinglePost);
router.patch(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  PostController.updatePost
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  PostController.deletePost
);

export const postRouter: express.Router = router;
