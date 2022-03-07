let account_id;
let account_checker;
let account_cause;
let btn_create;
let modal_target;
let account_create;
let account_create_cancel;
let account_create_close;
let account_create_loading;
let save_clip;
let saved_result = {};

//   navigator.clipboard.writeText(copyText.value);

/**
 * 출력 문자열 값을 처리
 * @param {string} msg 메시지
 * @param {string} clz 클래스
 * @param {string} errmsg 오류 문자열
 */
function _setCheckerText(msg, clz, errmsg = "") {
  account_checker.innerHTML = msg;
  account_checker.removeAttribute("class");
  account_checker.setAttribute("class", `input-group-text text-${clz}`);
  account_cause.innerHTML = errmsg;

  let defclz = "btn btn-primary ms-2";
  if (clz == "success") {
    btn_create.setAttribute("class", defclz);
  } else {
    btn_create.setAttribute("class", `${defclz} disabled`);
  }
}

/**
 * 입력받은 계정의 유효성 검증을 수행
 */
function addAccountValidator() {
  account_id.addEventListener("keypress", function (evt) {
    if (evt.key === "Enter") {
      account_id.dispatchEvent(new Event("change"));
    }
  });
  account_id.addEventListener("change", function (evt) {
    let val = account_id.value;
    let errmsg = steem.utils.validateAccountName(val);
    if (errmsg) {
      _setCheckerText("경고", "danger", errmsg);
      return;
    } else {
      _setCheckerText("조회 중...", "info");
      account_id.setAttribute("disabled", true);
      steem.api
        .getAccountsAsync([val])
        .then((res) => {
          if (res.length > 0) {
            _setCheckerText("존재하는 계정명", "danger");
          } else {
            _setCheckerText("정상", "success");
          }
        })
        .catch((err) => {
          _setCheckerText("통신오류", "danger");
        })
        .finally(() => {
          account_id.removeAttribute("disabled");
        });
    }
  });
}

window.onload = function () {
  // 버튼 등록
  account_id = document.querySelector("#account-id");
  account_checker = document.querySelector("#account-checker");
  account_cause = document.querySelector("#account-cause");
  btn_create = document.querySelector("#btn-create");
  account_create = document.querySelector("#account-create");
  account_create_cancel = document.querySelector("#account-create-cancel");
  account_create_close = document.querySelector("#account-create-close");
  account_create_loading = document.querySelector("#account-create-loading");
  save_clip = document.querySelector("#save-clip");

  // 계정명 유효성 검증처리
  addAccountValidator();

  // 계정생성 모달설정
  modal_target = new bootstrap.Modal(document.getElementById("account-modal"));

  // 계정생성 모달 보여주기
  btn_create.addEventListener("click", function () {
    account_create.innerHTML = "생성하기";
    account_create.setAttribute("class", "btn btn-primary");
    account_create_cancel.setAttribute("class", "btn btn-secondary");
    account_create_close.setAttribute("class", "btn-close");
    account_create_loading.setAttribute(
      "class",
      "btn btn-primary invisible hidden"
    );
    account_create_loading.setAttribute("style", "display:none");
    document.querySelector(
      "#account-name"
    ).innerHTML = `@${account_id.value} 를 생성하겠습니까 ?`;
    modal_target.show();
  });

  // 클립봅드에 저장
  new bootstrap.Tooltip(save_clip);
  save_clip.addEventListener("click", function () {
    navigator.clipboard.writeText(JSON.stringify(saved_result, null, 2));
  });

  // 계정 생성
  account_create.addEventListener("click", function () {
    account_create.innerHTML = "생성 중";
    account_create.setAttribute("class", "btn btn-primary invisible");
    account_create_cancel.setAttribute("class", "btn btn-secondary invisible");
    account_create_close.setAttribute("class", "btn-close invisible");
    account_create_loading.setAttribute("class", "btn btn-primary disabled");
    account_create_loading.setAttribute("style", "display:''");

    // hide result
    document
      .getElementsByClassName("account-result-fail")[0]
      .setAttribute("class", "account-result-fail invisible");
    document
      .getElementsByClassName("account-result-fail")[0]
      .setAttribute("style", "display:none");
    [].forEach.call(
      document.getElementsByClassName("account-result-success"),
      (item, idx, arr) => {
        item.setAttribute("class", "account-result-success invisible");
      }
    );

    fetch("/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ author: account_id.value }),
    })
      .then(async (res) => {
        await new Promise((r) => setTimeout(r, 3000));
        return res.json();
      })
      .then((res) => {
        if (res.success) {
          [].forEach.call(
            document.getElementsByClassName("account-result-success"),
            (item, idx, arr) => {
              item.setAttribute("class", "account-result-success");
            }
          );
          for (let key of ["posting", "active", "master", "owner", "memo"]) {
            document.querySelector(`#key-${key}`).innerHTML = res[key];
          }
          saved_result = res;
          document.querySelector(
            "#result-author"
          ).innerHTML = `@${res.author} 님의 계정 생성결과`;
          account_id.value = "";
          account_id.dispatchEvent(new Event("change"));
        } else {
          document
            .getElementsByClassName("account-result-fail")[0]
            .setAttribute("class", "account-result-fail");
          document
            .getElementsByClassName("account-result-fail")[0]
            .setAttribute("style", "display:''");
          document.querySelector(
            "#result-fail"
          ).innerHTML = `${res.remain} 초 후 다시 시도 바랍니다. 계정은 ${res.permin} 분 마다 1개 생성 할 수 있습니다.`;

          saved_result = {};
        }
      })
      .catch((err) => {
        document
          .getElementsByClassName("account-result-fail")[0]
          .setAttribute("class", "account-result-fail");
        document
          .getElementsByClassName("account-result-fail")[0]
          .setAttribute("style", "display:''");
        document.querySelector(
          "#result-fail"
        ).innerHTML = `네트워크 오류가 발생 하였습니다. 잠시 후 시도 바랍니다.`;
        saved_result = {};
      })
      .finally(() => {
        // show result
        modal_target.hide();
      });
  });
};
