import {InvariantError, NotFoundError} from "../../../exceptions/index.js";
import UploadRepositories from "../repositories/upload-repositories.js";
import {uuidv7} from "uuidv7";
import response from "../../../utils/response.js";
import path from "path";
import fs from "fs/promises";

const uploadRepositories = new UploadRepositories();
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function uploadDocument(req, res, next) {
  const file = req.file;

  if(!file) {
    return next(new InvariantError("File is required"));
  }

  if(file.mimetype !== 'application/pdf') {
    return next(new InvariantError("File harus berupa PDF"));
  }

  if(file.size > 5 * 1024 * 1024) {
    return next(new InvariantError("File tidak boleh lebih dari 5MB"));
  }

  const id = uuidv7();
  const originalName = file.originalname;
  const storedName = file.filename;
  const mimeType = file.mimetype;
  const size = file.size;
  const uploadPath = file.path;

  await uploadRepositories.addDocument({id, originalName, storedName, mimeType, size, path: uploadPath});

  const uploadedDocument = {
    documentId: id,
    filename: storedName,
    originalName,
    size,
  };

  return response(
    res,
    201,
    "File berhasil diunggah",
    uploadedDocument
  );
}

export async function getAllDocument(req, res, next) {
  const documents = await uploadRepositories.getAllDocument();
  return response(
    res,
    200,
    "All document found",
    {
      documents
    }
  );
}

export async function getDocumentById(req, res, next) {
  const { id } = req.params;
  if(!uuidRegex.test(id)) {
    return next(new NotFoundError("Document tidak ditemukan"));
  }

  const document = await uploadRepositories.getDocumentById(id);
  if (!document) {
    return next(new NotFoundError("Document tidak ditemukan"));
  }

  const absolutePath = path.resolve(document.path);

  try {
    await fs.access(absolutePath);
  } catch {
    return next(new NotFoundError("Document tidak ditemukan"));
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${document.original_name}"`);

  return res.sendFile(absolutePath, (error) => {
    if (error) {
      next(error);
    }
  });
}

export async function deleteDocument(req, res, next) {
  const { id } = req.params;
  if(!uuidRegex.test(id)) {
    return next(new NotFoundError("Document tidak ditemukan"));
  }

  const deletedDocument = await uploadRepositories.deleteDocumentById(id);

  if (!deletedDocument) {
    return next(new NotFoundError("Document tidak ditemukan"));
  }

  return response(
    res,
    200,
    "Document deleted successfully"
  );
}