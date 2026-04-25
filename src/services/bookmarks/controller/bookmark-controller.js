import BookmarkRepositories from "../repositories/bookmark-repositories.js";
import {uuidv7} from "uuidv7";
import response from "../../../utils/response.js";
import {NotFoundError} from "../../../exceptions/index.js";

const bookmarkRepositories = new BookmarkRepositories();
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function addBookmark(req, res, next) {
  const { jobId } = req.params;
  console.log("JOB ID: ", jobId);
  const { id: userId } = req.user;
  console.log("USER ID: ", userId);
  const id = uuidv7();

  await bookmarkRepositories.addBookmark({ id, jobId, userId });

  return response(
    res,
    201,
    "Bookmark added successfully",
    { id },
  );
}

export async function getAllUserBookmark(req, res, next) {
  const { userId } = req.user;
  const bookmarks = await bookmarkRepositories.getAllBookmarkByUserId(userId);
  return response(
    res,
    200,
    "Bookmark retrieved successfully",
    {
      bookmarks
    },
  );
}

export async function getBookmarkById(req, res, next) {
  const { id } = req.params;

  if (!uuidRegex.test(id)) {
    return next(new NotFoundError("Bookmark tidak ditemukan"));
  }

  const bookmark = await bookmarkRepositories.getBookmarkById(id);

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
  await bookmarkRepositories.deleteBookmark(jobId);

  return response(
    res,
    200,
    "Bookmark deleted successfully",
  );
}