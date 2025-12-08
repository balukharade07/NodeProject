const { Router } = require("express");
const Users = require("../db/Users");
const {
  userRegisterValidation,
  handleValidation,
  handleUpdatedUserCalidation,
} = require("../utils/validation");
const { verifyToken } = require("../utils/jwt-token");
const Connection = require("../db/Connection");

const userRouter = Router();

userRouter.get("/users", verifyToken, async (req, res) => {
  const allUser = await Users.find({}).select("-password");
  const updatedUserList = allUser.map((item) => {
    const user = {
      email: item.email,
      firstName: item.firstName,
      lastName: item.lastName,
      _id: item._id,
    };
    return user;
  });
  res.status(200).send(updatedUserList);
});

userRouter.get("/usersList", async (req, res) => {
  const allUser = await Users.find({}).select("-password");
  const updatedUserList = allUser.map((item) => {
    const user = {
      firstName: item.firstName,
      _id: item._id,
    };
    return user;
  });
  res.status(200).send(updatedUserList);
});

userRouter.delete("/userDelete/:_id", verifyToken, async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.params);
    res.status(200).send("Deleted Successfully...!!");
  } catch (error) {
    res.status(400).send("Somthing wrong!!");
  }
});

userRouter.patch(
  "/user/:_id",
  verifyToken,
  handleUpdatedUserCalidation,
  async (req, res) => {
    try {
      const user = await Users.findByIdAndUpdate(req.params, req.body);
      if (!user) throw new Error("Invalid user");
      const loggedInUser = req.user;
      Object.keys(req.body).forEach(
        (key) => (loggedInUser[key] = req.body[key])
      );
      loggedInUser.save();
      res.status(200).send("User Updated Successfully...!!");
    } catch (error) {
      res.status(400).send("User not fount");
    }
  }
);

userRouter.get("/user/:_id", verifyToken, async (req, res) => {
  try {
    const user = await Users.findOne(req.params).select("-password");
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("User not fount");
  }
});

userRouter.post("/usersList/:lastName", async (req, res) => {
  try {
    const result = await Users.aggregate([
      {
        $match: { age: { $gt: 20 } },
        // $match: { lastName: req.params.lastName, age: { $gt: 20 } },
      },
      {
        $addFields: {
          fullName: { $concat: ["$firstName", " ", "$lastName"] },
        },
      },
      {
        $project: { password: 0, createdAt: 0, updatedAt: 0, __v: 0 },
      },
      { $sort: { age: 1 } },
      {
        $lookup: {
          from: "connectionrequests",
          let: { userId: "$_id" }, // store user._id as variable
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$fromUserId", "$$userId"] },
              },
            },
            {
              $project: {
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
          as: "connectionRequests",
        },
      },
      // {
      //   $lookup: {
      //     from: "connectionrequests",
      //     localField: "_id",
      //     foreignField: "fromUserId",
      //     as: "connectionRequests",
      //   },
      // },
      {
        $group: {
          _id: "$lastName",
          users: {
            $push: "$$ROOT",
          },
          count: { $sum: 1 },
        },
      },
      {
        $facet: {
          result: [{ $skip: 0 }, { $limit: 10 }],
          count: [{ $count: "count" }],
        },
      },
      {
        $project: {
          result: 1,
          count: { $arrayElemAt: ["$count.count", 0] },
        },
      },
    ]);

    res.status(200).send(result?.[0]);
  } catch (error) {
    res.status(400).send("Invalid name" + req.params.lastName);
  }
});

userRouter.post("/user/requests/received", verifyToken, async (req, res) => {
  try {
    const logggedInUser = req.user;

    const isConnectionExisting = await Connection.find({
      toUserId: logggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    res.status(200).json({
      data: isConnectionExisting,
      message: "Connection requests send successfully!!",
    });
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
});

userRouter.post("/user/connections", verifyToken, async (req, res) => {
  try {
    const logggedInUser = req.user;

    const isConnectionExisting = await Connection.find({
      $or: [
        { toUserId: logggedInUser._id, status: "accepeted" },
        { fromUserId: logggedInUser._id, status: "accepeted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    res.status(200).json({
      data: isConnectionExisting.map((item) => {
        if (item.fromUserId._id.toString() === logggedInUser._id.toString()) {
          return item.toUserId;
        }

        return item.fromUserId;
      }),
      message: "Connection requests send successfully!!",
    });
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
});

userRouter.post("/feed", verifyToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const skip = (page - 1) * limit;
    const isAlreadyConnectionExists = await Connection.find({
      $or: [
        {
          toUserId: loggedInUser._id,
        },
        {
          fromUserId: loggedInUser._id,
        },
      ],
    });

    // const hideUserIds = new Set([]);
    // isAlreadyConnectionExists.forEach((item) => {
    //   hideUserIds.add(item.toUserId.toString());
    //   hideUserIds.add(item.fromUserId.toString());
    // });
    // console.log("hideUserIds", hideUserIds);

    // const allUsers = await Users.find({
    //   $and: [
    //     { _id: { $nin: Array.from(hideUserIds) } },
    //     { _id: { $ne: loggedInUser._id } },
    //   ],
    // }).select("firstName lastName gender age");

    const hideUserIds = [];

    isAlreadyConnectionExists.forEach((item) => {
      hideUserIds.push(...[item.toUserId, item.fromUserId]);
    });

    const allUsers = await Users.aggregate([
      {
        $match: {
          _id: { $nin: [loggedInUser._id, ...hideUserIds] },
        },
      },
      { $sort: { createdAt: 1 } },
      {
        $project: { password: 0, createdAt: 0, updatedAt: 0, __v: 0 },
      },
      {
        $facet: {
          result: [{ $skip: skip }, { $limit: limit }],
          count: [{ $count: "count" }],
        },
      },
      {
        $project: {
          result: 1,
          count: { $arrayElemAt: ["$count.count", 0] },
        },
      },
    ]);

    res.status(200).send(allUsers);
  } catch (error) {
    res.status(400).send("Connections not found!!");
  }
});

module.exports = userRouter;
