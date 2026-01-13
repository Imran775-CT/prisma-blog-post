import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await CommentService.createComment(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error,
      message:
        error.name === "ZodError"
          ? "Validation Error"
          : "Comment creation failed",
      //   error: error.name === "ZodError" ? error.errors : "Internal server error",
    });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const result = await CommentService.getCommentById(commentId as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: "Comment fetched failed",
      details: error,
      message:
        error.name === "ZodError"
          ? "Validation Error"
          : "Comment fetched failed",
      //   error: error.name === "ZodError" ? error.errors : "Internal server error",
    });
  }
};

const getCommentsByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await CommentService.getCommentsByAuthor(authorId as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: "Comment fetched failed ny author id.",
      details: error,
      message:
        error.name === "ZodError"
          ? "Validation Error"
          : "Comment fetched failed by author id",
      //   error: error.name === "ZodError" ? error.errors : "Internal server error",
    });
  }
};
export const commentController = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
};
