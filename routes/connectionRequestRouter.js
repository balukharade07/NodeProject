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
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const toUser = await Users.findById(toUserId);

      const allowededStatus = ["ingore", "interested"];
      if (!allowededStatus.includes(status)) {
        return res.status(400).json({
          message: `Invalid type ${status}`,
        });
      }

      if (!toUser) {
        return res.status(400).json({
          message: "Invalid connection id!",
        });
      }

      const isConnectionExisting = await Connection.findOne({
        $OR: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
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

module.exports = connectionRequestRouter;
