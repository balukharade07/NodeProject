const { Router } = require("express");
const Users = require("../db/Users");
const {
  userRegisterValidation,
  handleValidation,
  handleUpdatedUserCalidation,
} = require("../utils/validation");
const { verifyToken } = require("../utils/jwt-token");

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

module.exports = userRouter;
