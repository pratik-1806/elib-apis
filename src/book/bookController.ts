import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import fs from "node:fs"
import bookModel from "./bookModel";



const createBook = async (req: Request, res: Response, next: NextFunction)=>{
   const {title, genre} = req.body;

console.log("files",req.files)
try{
    const files =req.files as {[__filename:string]: Express.Multer.File[]}

//image/png
const coverImageMimeType =files.coverImage[0].mimetype.split('/').at(-1);

const filename = files.coverImage[0].filename;

const fileURLToPath = path.resolve(__dirname, '../../public/data/uploads', filename)


const uploadResult = await cloudinary.uploader.upload(fileURLToPath,{
    filename_override: filename,
    folder:'book-cover',
    format:coverImageMimeType,
})

const bookFileName = files.file[0].filename;
const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName);

const bookFileuploadResult = await cloudinary.uploader.upload(bookFilePath, {
    resource_type:'raw',
    filename_override: bookFileName,
    folder : 'book-pdfs',
    format: "pdf"
})

const newBook = await bookModel.create({
    title,
    genre,
    author : "67a7524f7ca73e672ad5a0fa",
    coverImage :uploadResult.secure_url,
    file : bookFileuploadResult.secure_url
});

//temp delete
await fs.promises.unlink(fileURLToPath);
await fs.promises.unlink(bookFilePath);

 res.status(201).json({id: newBook._id})



}catch(err){
  console.log(err)
  return next(createHttpError(500, "Error while uploading file"))
}

}


export {createBook};