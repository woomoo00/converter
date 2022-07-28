import styles from "./index.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../styles/global.css'

import { useState } from "react";

const data = [
  { id: 0, title: '전화번호', found: 0, checked: true },
  { id: 1, title: '이메일', found: 0, checked: true },
  { id: 2, title: '주민등록번호', found: 0, checked: true },
  // { id: 3, title: '계좌번호', found: 0, checked: true },
  { id: 3, title: '나이', found: 0, checked: true },
  { id: 4, title: '날짜', found: 0, checked: true },
  { id: 5, title: '사업자등록번호', found: 0, checked: true },
  { id: 6, title: '은행명', found: 0, checked: true },
]

//RegExp
var regPhone = new RegExp(/01(?:0|1|[6-9])-?(?:\d{3}|\d{4})-?\d{4}/);
var regEmail = new RegExp(/[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}/i);
var regRRN = new RegExp(/([0-9]{2}(?:0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))-?[1-4][0-9]{6}/i);
var regAge = new RegExp(/([0-9]{0,4}((?=세)|(?=살)|(?=생)))/);
var regDay = new RegExp(/((19[0-9][0-9]|20\d{2})(?=년))|((0?[1-9]|1[0-2])(?=월))|(0?([1-9]|[1-2][0-9]|3[0-1])(?=일))/);
var regCor = new RegExp(/([0-9]{3})-?([0-9]{2})-?([0-9]{5})/);
var regBank = new RegExp(/^[(]?[구|신]?[)]?([가-힣]+)은행/gm);

const Converter = () => {
  // const [isRRN, setIsRRN] = useState(false);
  const [checkItems, setCheckItems] = useState([]);

  const handleSingleCheck = (checked, id) => {
    if (checked) {
      setCheckItems(prev => [...prev, id]);
      data[id].checked = true;
      userSelectionTotal();
    } else {
      setCheckItems(checkItems.filter((el) => el !== id));
      data[id].checked = false;
      userSelectionTotal();
    }
  };

  const handleAllCheck = (checked) => {
    if (checked) {
      const idArray = [];
      data.forEach((el) => idArray.push(el.id));
      setCheckItems(idArray);
      data.forEach((el) => el.checked = true);
    }
    else {
      setCheckItems([]);
      data.forEach((el) => el.checked = false);
    }
    userSelectionTotal();
  }


  function fn_submit() {
    var name = '';
    handleAllCheck(false);

    var text = document.getElementById('text').value;
    var enter = text.split("\n");
    for (let i = 0; i < enter.length; i++) {
      name = name + longTextCheck(enter[i]) + '\n';
    }
    document.getElementById("result").innerText = name;
  }

  function longTextCheck(enter) {
    var name = '';
    var arr = enter.split(" ");

    for (let i = 0; i < arr.length; i++) {
      arr[i].split("\n").join(" ");
      if (regPhone.test(arr[i]) === true) {
        arr[i] = arr[i].replace(/[0-9]/gi, '*');
        handleSingleCheck(true, 0);
        data[0].found = 1;
      }
      else if (regEmail.test(arr[i]) === true) {
        arr[i] = arr[i].replace(/[a-zA-Z0-9]/g, "*");
        handleSingleCheck(true, 1);
        data[1].found = 1;
      }
      else if (regRRN.test(arr[i]) === true) {
        arr[i] = arr[i].replace(/[0-9]/gi, '*');
        handleSingleCheck(true, 2);
        data[2].found = 1;
      }
      else if (regAge.test(arr[i]) === true) {
        arr[i] = arr[i].replace(/[0-9]/gi, '*');
        handleSingleCheck(true, 3);
        data[3].found = 1;
      }
      else if (regDay.test(arr[i].replaceAll(" ", "")) === true) {
        arr[i] = arr[i].replace(/[0-9]/gi, '*');
        handleSingleCheck(true, 4);
        data[4].found = 1;
      }
      else if (regCor.test(arr[i]) === true) {
        if (CorporateRegNumCheck(arr[i])) {
          arr[i] = arr[i].replace(/[0-9]/gi, '*');
          handleSingleCheck(true, 5);
          data[5].found = 1;
        }
      }
      else if (regBank.test(arr[i]) === true) {
        handleSingleCheck(true, 6);
        arr[i] = "**은행";
        data[6].found = 1;
      }
      name += arr[i];
      name += ' ';
    }
    return name;
  }

  function userSelectionTotal() {
    var converted = '';
    var text = document.getElementById('text').value;
    var enter = text.split("\n");

    for (let i = 0; i < enter.length; i++) {
      converted = converted + userSelection(enter[i]) + '\n';
    }
    document.getElementById("result").innerText = converted;
  }

  function userSelection(enter) {
    var name = '';
    // var text = document.getElementById('text').value;
    var arr = enter.split(' ');

    for (let i = 0; i < arr.length; i++) {
      if (regPhone.test(arr[i]) && data[0].checked) {
        arr[i] = arr[i].replace(/[0-9]/gi, '*');
      }
      else if (regEmail.test(arr[i]) && data[1].checked) {
        arr[i] = arr[i].replace(/[a-zA-Z0-9]/g, "*");
      }
      else if (regRRN.test(arr[i]) && data[2].checked) {
        arr[i] = arr[i].replace(/[0-9]/gi, '*');
      }
      else if (regAge.test(arr[i]) && data[3].checked) {
        arr[i] = arr[i].replace(/[0-9]/gi, '*');
      }
      else if (regDay.test(arr[i]) && data[4].checked) {
        arr[i] = arr[i].replace(/[0-9]/gi, '*');
      }
      else if (regCor.test(arr[i]) && data[5].checked) {
        if (CorporateRegNumCheck(arr[i])) {
          arr[i] = arr[i].replace(/[0-9]/gi, '*');
        }
      }
      else if (regBank.test(arr[i]) && data[6].checked) {
        arr[i] = "**은행";
      }
      name += arr[i];
      name += ' ';
    }
    // document.getElementById("result").innerText = name;
    return name;
  }


  function CorporateRegNumCheck(number) {
    var numMap = number.replace(/-/gi, '').split('').map(function (d) {
      return parseInt(d, 10);
    });
    if (numMap.length === 10) {
      var keyArr = [1, 3, 7, 1, 3, 7, 1, 3, 5];
      var check = 0;

      keyArr.forEach(function (d, i) {
        check += d * numMap[i];
      });

      check += parseInt((keyArr[8] * numMap[8]) / 10, 10);
      return Math.floor(numMap[9]) === ((10 - (check % 10)) % 10);
    }
    return false;
  }
  return (

    <div>
      <header className={styles.header}>
        BATONERS CONVERTER
      </header>
      <div className={styles.container}>
        <div className={styles.converter_container}>
          <div className={styles.input_container}>
            {/* <input type="text" id="text" placeholder="여기에 변환할 텍스트를 입력해주세요" className={styles.input_box} /> */}
            <textarea name="text" id="text" placeholder="여기에 입력" className={styles.input_box}></textarea>
            <button type="submit" onClick={fn_submit} className={styles.button}>check</button>
          </div>

          <div className={styles.output_container}>
            <div id="result" className={styles.output_box}></div>
            <div className={styles.output_option_box}>
              <div className={styles.output_option_box_top}>
              <thead>
                <tr>
                  <div className="form-check">
                    <input className="form-check-input" type='checkbox' name='select-all'
                      onChange={(e) => handleAllCheck(e.target.checked)}
                      checked={checkItems.length === data.length ? true : false} />
                    <label className='form-check-label'>전체선택</label>
                  </div>
                </tr>
              </thead>
              </div>
              <div className={styles.output_option_box_bottom}>
                {data?.map((data, key) => (
                  <tr key={key}>
                    <div className="form-check">
                      <input class="form-check-input" type='checkbox' name={`select-${data.id}`}
                        onChange={(e) => handleSingleCheck(e.target.checked, data.id)}
                        checked={checkItems.includes(data.id) && data.found == 1 ? true : false}
                        disabled={data.found == 1 ? false : true} />
                      <label className='form-check-label'>{data.title}</label>
                    </div>
                  </tr>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Converter;