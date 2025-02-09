import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import fs from "node:fs";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

  console.log("files", req.files);
  try {
    const files = req.files as { [__filename: string]: Express.Multer.File[] };

    //image/png
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    const filename = files.coverImage[0].filename;

    const fileURLToPath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      filename
    );

    const uploadResult = await cloudinary.uploader.upload(fileURLToPath, {
      filename_override: filename,
      folder: "book-cover",
      format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    const bookFileuploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );

    const _req = req as AuthRequest;

    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileuploadResult.secure_url,
    });

    //temp delete
    await fs.promises.unlink(fileURLToPath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({ id: newBook._id });
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "Error while uploading file"));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

  const bookId = req.params.id;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }

  //Access check
  const _req = req as AuthRequest;
  if (book.author.toString() != _req.userId) {
    return next(createHttpError(403, "You can not update other books"));
  }

  try {
    const files = req.files as { [__filename: string]: Express.Multer.File[] };
    let completeCoverImage = "";
    if (files.coverImage) {
      const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

      const filename = files.coverImage[0].filename;

      const fileURLToPath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        filename
      );

      const uploadResult = await cloudinary.uploader.upload(fileURLToPath, {
        filename_override: filename,
        folder: "book-cover",
        format: coverImageMimeType,
      });

      completeCoverImage = uploadResult.secure_url;

      await fs.promises.unlink(fileURLToPath);
    }
    let completeFileName = "";
    if (files.file) {
      const bookFileName = files.file[0].filename;
      const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        bookFileName
      );

      const bookFileuploadResult = await cloudinary.uploader.upload(
        bookFilePath,
        {
          resource_type: "raw",
          filename_override: bookFileName,
          folder: "book-pdfs",
          format: "pdf",
        }
      );
      completeFileName = bookFileuploadResult.secure_url;
      await fs.promises.unlink(bookFilePath);
    }

    const updateBook = await bookModel.findOneAndUpdate(
      {
        _id: bookId,
      },
      {
        title: title,
        genre: genre,
        coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
        file: completeFileName ? completeFileName : book.file,
      },
      {
        new: true,
      }
    );

    res.status(202).json(updateBook);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return next(createHttpError(400, "Error while updating book"));
  }
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await bookModel.find().populate("auther","name");

    res.json(book);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return next(createHttpError(500, "Error while getting a book"));
  }
};

const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;

    const book = await bookModel.findById({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    res.json(book);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return next(createHttpError(500, "Error while getting book"));
  }
};
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;
  const book = await bookModel.findById({ _id: bookId });

  try {
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    const _req = req as AuthRequest;
    if (book.author.toString() != _req.userId) {
      return next(createHttpError(403, "You can not delete other books"));
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return next(createHttpError(500, "Error while deleting book"));
  }

  //getting public_id from file url

  const coverfileSplits = book.coverImage.split("/").at(-1)?.split(".").at(-2);
  const coverfileSplitefinal= book.coverImage.split("/").at(-2);

  const bookfileSplit= book.file.split("/").at(-1)
  const bookfileSplitfinal = book.file.split("/").at(-2);

  await cloudinary.uploader.destroy(`${coverfileSplitefinal}/${coverfileSplits}`)
  await cloudinary.uploader.destroy(`${bookfileSplitfinal}/${bookfileSplit}`,{
    resource_type:"raw"
  })

  await bookModel.deleteOne({_id: bookId})

  res.status(204).json({id:bookId})
};

export { createBook, updateBook, listBooks, getSingleBook, deleteBook };
