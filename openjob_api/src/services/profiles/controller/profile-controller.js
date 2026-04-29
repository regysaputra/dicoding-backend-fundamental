import UserRepositories from "../../users/repositories/user-repositories.js";
import response from "../../../utils/response.js";
import BookmarkRepositories from "../../bookmarks/repositories/bookmark-repositories.js";
import ApplicationRepositories from "../../applications/repositories/application-repositories.js";

const userRepositories = new UserRepositories();
const bookmarkRepositories = new BookmarkRepositories();
const applicationRepositories = new ApplicationRepositories();

export async function getProfile(req, res) {
  const { id } = req.user;

  const result = await userRepositories.getUserById(id);

  res.setHeader("X-Data-Source", result.source);

  return response(
    res,
    200,
    "Success get profile",
    result.user,
  );
}

export async function getApplicationByUserId(req, res) {
  const { id } = req.user;
  const result = await applicationRepositories.getApplicationByUserId(id);

  if (result.source) {
    res.setHeader("X-Data-Source", result.source);
  }

  return response(
    res,
    200,
    "Success get application",
    {
      applications: result.applications,
    },
  );
}

export async function getBookmarkByUserId(req, res) {
  const { id } = req.user;

  const result = await bookmarkRepositories.getAllBookmarkByUserId(id);

  res.setHeader("X-Data-Source", result.source);

  return response(
    res,
    200,
    "Success get bookmark",
    {
      bookmarks: result.bookmarks,
    },
  );
}