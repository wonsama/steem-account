var express = require("express");
var router = express.Router();

const steem = require("steem");
const { create_claimed_account } = require("./steemhelper");

const CREATOR_ID = process.env.CREATOR_ID;
const CREATOR_ACTIVE_KEY = process.env.CREATOR_ACTIVE_KEY;
const ACCOUNT_PER_SEC = process.env.ACCOUNT_PER_SEC || 60 * 10; // 기본 10 min

/* GET users listing. */
router.get("/", async function (req, res, next) {
  let acc = { pending_claimed_accounts: 0 };
  try {
    req.session.ok = true;
    acc = (await steem.api.getAccountsAsync(["dev.supporters"]))[0];
  } catch (err) {}

  res.render("create", {
    pending_claimed_accounts: acc.pending_claimed_accounts,
  });
});

router.post("/", async function (req, res, next) {
  let current = new Date().getTime();
  const MIN_GAP = 1e3 * ACCOUNT_PER_SEC; // 10 minutes
  if (!req.session.data || current - req.session.data.time > MIN_GAP) {
    let master = steem.formatter.createSuggestedPassword();
    try {
      // 계정 생성
      await create_claimed_account(
        CREATOR_ID,
        CREATOR_ACTIVE_KEY,
        req.body.author,
        master
      );

      // FOR TEST
      // await new Promise((resolve, reject) => setTimeout(resolve, 1000 * 3));

      // RETURN : SUCCESS
      req.session.data = {
        time: new Date().getTime(),
      };
      req.session.save(function () {
        res.json({
          success: true,
          time: current,
          author: req.body.author,
          master: master,
          owner: steem.auth.toWif(req.body.author, master, "owner"),
          active: steem.auth.toWif(req.body.author, master, "active"),
          posting: steem.auth.toWif(req.body.author, master, "posting"),
          memo: steem.auth.toWif(req.body.author, master, "memo"),
        });
      });
    } catch (err) {
      // RETURN : FAIL - 네트워크오류
      res.json({
        success: false,
        time: -1,
        remain: -1,
        permin: Math.floor(MIN_GAP / (1000 * 60)),
      });
    }
  } else {
    // RETURN : FAIL - 타임오류
    res.json({
      success: false,
      time: req.session.data.time,
      remain: Math.floor((MIN_GAP - (current - req.session.data.time)) / 1e3),
      permin: Math.floor(MIN_GAP / (1000 * 60)),
    });
  }
});

module.exports = router;
