import UserRepositories from "../../users/repositories/user-repositories.js";
import response from "../../../utils/response.js";
import BookmarkRepositories from "../../bookmarks/repositories/bookmark-repositories.js";
import ApplicationRepositories from "../../applications/repositories/application-repositories.js";

const userRepositories = new UserRepositories();
const bookmarkRepositories = new BookmarkRepositories();
const applicationRepositories = new ApplicationRepositories();

export async function getProfile(req, res, next) {
  const { id } = req.user;

  const profile = await userRepositories.getUserById(id);

  return response(
    res,
    200,
    "Success get profile",
    profile,
  );
}

export async function getApplicationByUserId(req, res, next) {
  const { id } = req.user;

  const applications = await applicationRepositories.getApplicationByUserId(id);
  return response(
    res,
    200,
    "Success get application",
    {
      applications
    },
  );
}

export async function getBookmarkByUserId(req, res, next) {
  const { id } = req.user;

  const bookmarks = await bookmarkRepositories.getAllBookmarkByUserId(id);
  return response(
    res,
    200,
    "Success get bookmark",
    {
      bookmarks
    },
  );
}