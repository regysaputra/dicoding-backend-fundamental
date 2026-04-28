import BookmarkRepositories from "../repositories/bookmark-repositories.js";
import {uuidv7} from "uuidv7";
import response from "../../../utils/response.js";
import {NotFoundError} from "../../../exceptions/index.js";

const bookmarkRepositories = new BookmarkRepositories();
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function addBookmark(req, res) {
  const { jobId } = req.params;
  const { id: userId } = req.user;
  const id = uuidv7();

  await bookmarkRepositories.addBookmark({ id, jobId, userId });

  return response(
    res,
    201,
    "Bookmark added successfully",
    { id },
  );
}

export async function getAllUserBookmark(req, res) {
  const { id: userId } = req.user;
  const result = await bookmarkRepositories.getAllBookmarkByUserId(userId);

  res.setHeader("X-Data-Source", result.source);

  return response(
    res,
    200,
    "Bookmark retrieved successfully",
    {
      bookmarks: result.bookmarks
    },
  );
}

export async function getBookmarkById(req, res, next) {
  const { jobId, id } = req.params;
  const { id: userId } = req.user;

  if (!uuidRegex.test(id)) {
    return next(new NotFoundError("Bookmark tidak ditemukan"));
  }

  if (!uuidRegex.test(jobId)) {
    return next(new NotFoundError("Bookmark tidak ditemukan"));
  }

  const bookmark = await bookmarkRepositories.getBookmarkById(id, jobId, userId);

  if (!bookmark) {
    return next(new NotFoundError("Bookmark tidak ditemukan"));
  }

  return response(
    res,
    200,
    "Bookmark retrieved successfully",
    bookmark
  );
}

export async function deleteBookmark(req, res, next) {
  const { jobId } = req.params;
  const { id: userId } = req.user;

  if (!uuidRegex.test(jobId)) {
    return next(new NotFoundError("Bookmark tidak ditemukan"));
  }

  const deletedCount = await bookmarkRepositories.deleteBookmark(jobId, userId);

  if (deletedCount === 0) {
    return next(new NotFoundError("Bookmark tidak ditemukan"));
  }

  return response(
    res,
    200,
    "Bookmark deleted successfully",
  );
}