import styles from "./index.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../styles/global.css'

import { useState } from "react";

var csv = [];
var row = [];

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
// var regBank = new RegExp(/[(]?[구|신]?[)]?(([가-힣]+)(?=은행))/);
var regBank = new RegExp(/([가-힣]+|[a-z]+|[A-Z]+)(?=은행)/);

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

    row = [];
    csv = [];

    for (let j = 0; j < 7; j++) {
      data[j].found = 0;
    }

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
      var converted = '';

      if (regPhone.test(arr[i]) === true) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);

        arr[i] = converted;
        handleSingleCheck(true, 0);
        data[0].found = 1;
      }
      else if (regEmail.test(arr[i]) === true) {
        converted = arr[i].replace(/[a-zA-Z0-9]/g, "*");
        csvGenerator(arr[i], converted);

        arr[i] = arr[i].replace(/[a-zA-Z0-9]/g, "*");
        handleSingleCheck(true, 1);
        data[1].found = 1;
      }
      else if (regRRN.test(arr[i]) === true) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);

        arr[i] = converted;
        handleSingleCheck(true, 2);
        data[2].found = 1;
      }
      else if (regAge.test(arr[i]) === true) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);

        arr[i] = converted;
        handleSingleCheck(true, 3);
        data[3].found = 1;
      }
      else if (regDay.test(arr[i].replaceAll(" ", "")) === true) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);

        arr[i] = converted;
        handleSingleCheck(true, 4);
        data[4].found = 1;
      }
      else if (regCor.test(arr[i]) === true) {
        if (CorporateRegNumCheck(arr[i])) {
          converted = arr[i].replace(/[0-9]/gi, '*');
          csvGenerator(arr[i], converted);

          arr[i] = converted;
          handleSingleCheck(true, 5);
          data[5].found = 1;
        }
      }
      else if (regBank.test(arr[i]) === true) {
        converted = "**은행"
        csvGenerator(arr[i], converted);

        arr[i] = converted;
        handleSingleCheck(true, 6);
        data[6].found = 1;
      }
      name += arr[i];
      name += ' ';
    }
    return name;
  }

  function userSelectionTotal() {
    csv = [];

    var changed = '';
    var text = document.getElementById('text').value;
    var enter = text.split("\n");

    for (let i = 0; i < enter.length; i++) {
      changed = changed + userSelection(enter[i]) + '\n';
    }
    document.getElementById("result").innerText = changed;
  }

  function userSelection(enter) {
    var name = '';
    var converted = '';
    var arr = enter.split(' ');

    row = [];

    for (let i = 0; i < arr.length; i++) {
      if (regPhone.test(arr[i]) && data[0].checked) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);
        arr[i] = converted;
      }
      else if (regEmail.test(arr[i]) && data[1].checked) {
        converted = arr[i].replace(/[a-zA-Z0-9]/g, "*");
        csvGenerator(arr[i], converted);
        arr[i] = converted;
      }
      else if (regRRN.test(arr[i]) && data[2].checked) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);
        arr[i] = converted;
      }
      else if (regAge.test(arr[i]) && data[3].checked) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);
        arr[i] = converted;
      }
      else if (regDay.test(arr[i]) && data[4].checked) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);
        arr[i] = converted;
      }
      else if (regCor.test(arr[i]) && data[5].checked) {
        if (CorporateRegNumCheck(arr[i])) {
          converted = arr[i].replace(/[0-9]/gi, '*');
          csvGenerator(arr[i], converted);
          arr[i] = converted;
        }
      }
      else if (regBank.test(arr[i]) && data[6].checked) {
        converted = "**은행";
        csvGenerator(arr[i], converted);
        arr[i] = converted;
      }
      else {
        converted = '';
      }
      name += arr[i];
      name += ' ';
    }
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

  function csvGenerator(a, b) {
    row.push("'" + a, b);

    csv.push(row.join(","));
    row.splice(0, row.length);
    csv.join("\n");
  }

  function downloadCsv() {
    csv = csv.join("\n");
    let filename = "test.csv";

    var csvFile;
    let downloadLink;
    const BOM = "\uFEFF";
    csv = BOM + csv;

    csvFile = new Blob([csv], { type: "text/csv" });

    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    userSelectionTotal();

  }

  return (
    <div>
      <header className={styles.header}>
        BATONERS CONVERTER
      </header>
      <div class="container overflow-hidden">
        <div class="row">
          <div class="col-md">
            <div className={styles.input_container}>
              {/* <input type="text" id="text" placeholder="여기에 변환할 텍스트를 입력해주세요" className={styles.input_box} /> */}
              <textarea name="text" id="text" placeholder="여기에 입력" className={styles.input_box}></textarea>
              <button type="submit" onClick={fn_submit} className={styles.button}>변환하기</button>
            </div>
          </div>

          <div class="col-md">
            <div className={styles.output_container}>
              <div id="result" className={styles.output_box}></div>
              <div className={styles.output_option_box}>
                <div className={styles.output_option_box_top}>
                  <div className="form-check">
                    <input class="form-check-input" type='checkbox' name='select-all'
                      onChange={(e) => handleAllCheck(e.target.checked)}
                      checked={checkItems.length === data.length ? true : false} />
                    <label className='form-check-label'>전체선택</label>
                  </div>
                </div>
                <div className={styles.output_option_box_bottom}>
                  {data?.map((data, key) => (
                    <div key={key}>
                      <div className="form-check">
                        <input className="form-check-input" type='checkbox' name={`select-${data.id}`}
                          onChange={(e) => handleSingleCheck(e.target.checked, data.id)}
                          checked={checkItems.includes(data.id) && data.found === 1 ? true : false}
                          disabled={data.found === 1 ? false : true} />
                        <label className='form-check-label'>{data.title}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <button type="submit" onClick={downloadCsv} className={styles.button_rev}>csv Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>  
      <footer className={styles.footer}>
      </footer>    
    </div>
  );

}

export default Converter;