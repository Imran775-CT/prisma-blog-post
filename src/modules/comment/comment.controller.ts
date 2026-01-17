import { NextFunction, Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await CommentService.createComment(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

const getCommentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;

    const result = await CommentService.getCommentById(commentId as string);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

const getCommentsByAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorId } = req.params;
    const result = await CommentService.getCommentsByAuthor(authorId as string);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await CommentService.deleteComment(
      commentId as string,
      user?.id as string
    );
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await CommentService.updateComment(
      commentId as string,
      req.body,
      user?.id as string
    );
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

const moderateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await CommentService.moderateComment(
      req.params.commentId as string,
      req.body
    );
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const commentController = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteComment,
  updateComment,
  moderateComment,
};
