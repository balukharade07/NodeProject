const { Router } = require("express");
const Quote = require("../db/Quote");
const Users = require("../db/Users");
const { verifyExpressToken } = require("../utils/jwt-token");
// const { verifyToken } = require("../utils/jwt-token");

const router = Router();

router.post("/addQuote", verifyExpressToken, async (req, resp) => {
  const addQuote = new Quote(req.body);
  const res = await addQuote.save();
  resp.status(201).send(res);
});

router.put("/editQuote/:_id", verifyExpressToken, async (req, resp) => {
  const data = await Quote.findOne(req.body);
  if (data) {
    try {
      throw Error("Already modify this quote");
    } catch (error) {
      return resp.status(401).send("Already modify this quote");
    }
  } else {
    const quote = await Quote.updateOne(req.params, { $set: req.body });
    resp.status(200).send(req.body);
  }
});

router.get("/getAllQuote/:_id", async (req, resp) => {
  try {
    const pageSize = parseInt(req.query.pageSize);
    const page = parseInt(req.query.page);
    let allQuote = [];
    let count = 0;
    if (req.params._id === "all") {
      allQuote = await Quote.find({})
        .limit(pageSize)
        .skip(pageSize * (page - 1));
      count = await (await Quote.find({})).length;
    } else {
      allQuote = await Quote.find({
        $or: [{ by: new RegExp(req.params._id, "i") }],
      })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

      count = await (
        await Quote.find({
          $or: [{ by: new RegExp(req.params._id, "i") }],
        })
      ).length;
    }

    const allUser = await Users.find({});
    const userInfo = {};
    allUser.forEach((item) => (userInfo[item._id] = item.username));
    const updatedQuote = allQuote?.map((item) => {
      return {
        _id: item._id,
        quote: item.quote,
        name: userInfo[item.by],
      };
    });
    const result = {
      count,
      result: updatedQuote,
    };
    resp.status(200).send(result);
  } catch (e) {
    console.log(e);
  }
});

router.get("/getQuote/:by", verifyExpressToken, async (req, resp) => {
  const addQuote = await Quote.find(req.params);
  resp.status(200).send(addQuote);
});

router.delete("/delete/:_id", verifyExpressToken, async (req, resp) => {
  const addQuote = await Quote.deleteOne(req.params);
  resp.status(200).send(addQuote);
});

module.exports = { quoteRouter: router };
