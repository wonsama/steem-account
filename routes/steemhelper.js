const steem = require("steem");

const broadcast_send = (cmd, data, private_key) => {
  return broadcast_sends([[cmd, data]], private_key);
};

const broadcast_sends = (operations, private_key, extensions = []) => {
  return steem.broadcast.sendAsync({ extensions, operations }, [private_key]);
};

/// 계정 생성용 토큰을 만들어준다
const claim_account = (author) => {
  const cmd = "claim_account";
  const data = {
    creator: author,
    fee: "0.000 STEEM",
    extensions: [],
  };
  const keyActive = process.env[`ENV_AUTHOR_KEY_ACTIVE_${author}`];
  return broadcast_send(cmd, data, keyActive);
};

/// 계정 생성용 토큰을 가지고 계정을 생성한다
const create_claimed_account = async (
  author,
  keyActive,
  username,
  master_pw = steem.formatter.createSuggestedPassword(),
  check_validations = false
) => {
  // 유효성 검증 - 화면에서 처리하도록 한다
  if (check_validations) {
    // 계정 존재여부 확인
    let is_already_exist = await steem.api.getAccountsAsync([username]);
    if (is_already_exist.length == 1) {
      return Promise.reject({
        username,
        desc: `${username} is already exist`,
      });
    }

    // 계정명 유효성 검증
    var is_valid_username = steem.utils.validateAccountName(username);
    if (is_valid_username != null) {
      return Promise.reject({
        username,
        desc: is_valid_username,
      });
    }

    // 토큰 남은 개수 확인
    let pending_claimed_accounts = (
      await steem.api.getAccountsAsync([author])
    )[0].pending_claimed_accounts;
    if (pending_claimed_accounts == 0) {
      return Promise.reject({
        author,
        desc: `${author} has pending_claimed_accounts 0.`,
      });
    } else {
      console.log(
        `${author} has pending_claimed_accounts ${pending_claimed_accounts}.`
      );
    }
  }

  const cmd = "create_claimed_account";
  const _get_pri_key = (role) => steem.auth.toWif(username, master_pw, role);
  const _get_pub_key = (role) => steem.auth.wifToPublic(_get_pri_key(role));
  const _get_key_data = (role) => {
    if (role == "memo") {
      return _get_pub_key(role);
    }
    return {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[_get_pub_key(role), 1]],
    };
  };

  const data = {
    posting: _get_key_data("posting"),
    active: _get_key_data("active"),
    owner: _get_key_data("owner"),
    memo_key: _get_key_data("memo"),
    creator: author,
    extensions: [],
    json_metadata: "",
    new_account_name: username,
  };

  return broadcast_send(cmd, data, keyActive);
};

module.exports = {
  claim_account,
  create_claimed_account,
};
