import { Request, Response } from "express";
import { PostService } from "./post.service";

import { PostValidation } from "./post.validation";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
  try {
    const validatedData = PostValidation.createPostValidationSchema.parse(
      req.body
    );
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const result = await PostService.createPost(validatedData as any, userId);
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message:
        error.name === "ZodError" ? "Validation Error" : "Post creation failed",
      error: error.name === "ZodError" ? error.errors : "Internal server error",
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchStr = typeof search === "string" ? String(search) : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    const status = req.query.status as PostStatus | undefined;
    const authorId = req.query.authorId as string | undefined;
    const result = await PostService.getAllPost({
      search: searchStr,
      tags,
      isFeatured,
      status,
      authorId,
    });
    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      length: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "Fetching posts failed",
    });
  }
};

const getSinglePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await PostService.getPostById(id as string);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "Fetching post failed",
    });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const validatedData = PostValidation.updatePostValidationSchema.parse(
      req.body
    );
    const result = await PostService.updatePost(
      id as string,
      validatedData as any,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: result,
    });
  } catch (error: any) {
    const status = error.name === "ZodError" ? 400 : 500;
    res.status(status).json({
      success: false,
      message:
        error.name === "ZodError" ? "Validation Error" : "Post update failed",
      error:
        error.name === "ZodError"
          ? error.errors
          : "Internal server error (Ensure you are the author)",
    });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await PostService.deletePost(id as string, userId);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "Post deletion failed (Ensure you are the author)",
    });
  }
};

export const PostController = {
  createPost,
  getAllPost,
  getSinglePost,
  updatePost,
  deletePost,
};
