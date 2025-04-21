import wrapAsync from "../utils/wrapAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = wrapAsync(async (req, res) => {
  const { fullname, username, password, email } = req.body;
  console.log(req.body);

  //validation
  if (
    [fullname, username, password, email].some((field) => field?.trim() === "")
  ) {
    // fs.unlinkSync(req.files?.avatar[0]?.path);
    throw new ApiError(400, "All Fields Are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(409, "User with username or email already exist");
  }

  // const avatarLocalPath = req.files?.avatar[0]?.path;

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // if (!avatar) {
  //   throw new ApiError(400, "Avatar file is required");
  // }
  console.log("--------------------passsed-------------");
  const user = await User.create({
    fullname,
    email,
    username: username.toLowerCase(),
    password,
    // avatar: avatar.url,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const logInUser = wrapAsync(async (req, res) => {
  const { username, email, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "Username or Email is Required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "invalid user credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken, refreshToken },
        "User logged in sucessfully"
      )
    );
});

const logOutUser = wrapAsync(async (req, res) => {
  if (!req.cookies) {
    throw new ApiError(400, "user already logged out ");
  }
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = wrapAsync(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }

    if (!incomingRefreshToken === user?.refreshToken) {
      throw new ApiError(401, "refresh token is expired or used ");
    }
    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "acess token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});

const getCurrentUser = wrapAsync(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

const changeCurrentPassword = wrapAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!(currentPassword && newPassword)) {
    throw new ApiError(400, " both fields  are required  ");
  }
  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "inavlid old Passowrd");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(400, "Passsword changed successfully"));
});

const updateAvatar = wrapAsync(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file missing");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Error while updating Avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Updated sucessfully"));
});

const changeFullname = wrapAsync(async (req, res) => {
  const { fullname } = req.body;
  if (!fullname) {
    throw new ApiError(400, "fullname is required");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullname,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Fullname Updated successfully"));
});

const checkUserEmail = wrapAsync(async (req, res) => {
  const { email } = req.body;
  console.log(req.body);
  if (!email) {
    throw new ApiError(400, "Field is  empty ");
  }
  const isEmailChecked = await User.findOne({ email: email });
  if (isEmailChecked) {
    throw new ApiError(400, "Email Check failed email already exist");
  }

  res
  .status(200)
  .json(new ApiResponse(200, "Email check passed"));
});

const checkUserUsername = wrapAsync(async (req, res) => {
  const { username } = req.body;
  console.log(req.body);
  if (!username) {
    throw new ApiError(400, "Field is empty ");
  }
  if(username.length < 4){
    throw new ApiError(400,"username should be minimum 4 chracters long");
  }


  const isUsernameChecked = await User.findOne({ username: username });
  if (isUsernameChecked) {
    throw new ApiError(400, "Username check failed Username already exist");
  }

  res
  .status(200)
  .json(new ApiResponse(200, "username check passed "));
});

export {
  registerUser,
  logInUser,
  logOutUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  changeFullname,
  updateAvatar,
  checkUserEmail,
  checkUserUsername,
};
