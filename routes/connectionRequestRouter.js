const { Router } = require("express");
const { verifyToken } = require("../utils/jwt-token");
const Users = require("../db/Users");
const Connection = require("../db/Connection");

const connectionRequestRouter = Router();

connectionRequestRouter.post(
  "/request/send/:status/:toUserId",
  verifyToken,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;
      const fromUserId = req.user._id;

      const allowededStatus = ["ignored", "interested"];
      if (!allowededStatus.includes(status)) {
        return res.status(400).json({
          message: `Invalid type ${status}`,
        });
      }

      const toUser = await Users.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "Invalid connection id!",
        });
      }

      const isConnectionExisting = await Connection.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });


      if (isConnectionExisting) {
        return res.status(400).json({
          message: "Connection request is already exists!",
        });
      }

      const connectionRequest = new Connection({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save(connectionRequest);

      res.json({
        message: "Connection request successfully!",
        data: data,
      });
    } catch (error) {
      res.status(400).send("ERROR :" + error.message);
    }
  }
);

connectionRequestRouter.post(
  "/request/review/:status/:requestId",
  verifyToken,
  async (req, res) => {
    try {
      const { requestId, status } = req.params;
      const loggedInUser = req.user;
      const allowededStatus = ["accepeted", "rejected"];

      if (!allowededStatus.includes(status)) {
        return res.status(400).json({
          message: `Invalid type ${status}`,
        });
      }

      const connectionRequest = await Connection.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found.",
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(200).json(data);
    } catch (error) {
      res.status(400).send("ERROR :" + error.message);
    }
  }
);

module.exports = connectionRequestRouter;
