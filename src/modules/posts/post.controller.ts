import { NextFunction, Request, Response } from "express";
import { PostService } from "./post.service";

import { PostStatus } from "../../../generated/prisma";
import paginationSortingHelper, {
  IOptionsResult,
} from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewares/auth";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const result = await PostService.createPost(req.body, userId);
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllPost = async (req: Request, res: Response, next: NextFunction) => {
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

    const { page, limit, sortBy, skip, sortOrder }: IOptionsResult =
      paginationSortingHelper(req.query);
    // console.log({ page, limit, sortBy, skip, sortOrder });
    const result = await PostService.getAllPost({
      search: searchStr,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      length: result.data.length,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getSinglePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Post id is required!");
    }
    const result = await PostService.getPostById(postId as string);
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
  } catch (error: any) {
    next(error);
  }
};

const getMyPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    console.log("User Data:", user);
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const result = await PostService.getMyPosts(user.id);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

//***
///** user -> sudhu nijer post update korte parbe , isFeatured update korte parbe  NA...!
///** admin -> post update korte parbe and isFeatured O update korte parbe ...> */

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const isAdmin = req.user?.role === UserRole.ADMIN;

    const result = await PostService.updatePost(
      postId as string,
      req.body,
      userId,
      isAdmin
    );

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const isAdmin = req.user?.role === UserRole.ADMIN;

    const result = await PostService.deletePost(id as string, userId, isAdmin);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await PostService.getStats();
    res.status(200).json({
      success: true,
      message: "Post Stats successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const PostController = {
  createPost,
  getAllPost,
  getSinglePost,
  getMyPosts,
  updatePost,
  deletePost,
  getStats,
};
